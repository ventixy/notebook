---
article: true
date: 2024-12-09
category:
  - Kubernetes
tag:
  - kubeadm 
  - K8S
  - CentOS
shortTitle: Kubernetes集群搭建
title: CentOS虚拟机的Kubernetes主从架构集群搭建
---

参考Blog：[K8S集群搭建](https://blog.csdn.net/weixin_45130293/article/details/144885255)

## Linux基础环境准备

此次K8S集群开发环境采用VM+CentOS7.9搭建，先准备一个基本环境完善的Linux系统作为模板，利用VM克隆出搭建集群所需的机器，再修改必要的配置文件即可

基础Linux环境：基于VM环境的 CentOS7.9 , 设置好固定静态IP（NAT模式），内网互通


### 关闭Swap分区

kubelet要求必须禁用交换分区，所以kubeadm初始化时回检测swap是否关闭，如果没有关闭会报错

```bash
# 临时关闭，重启恢复
swapoff -a

# 永久关闭，注释swap行
vim /etc/fstab
# /dev/mapper/centos-swap swap                    swap    defaults        0 0
```

重启后验证 Swap 是否禁用: 
```bash
free -h  #输出中的 Swap 部分应该显示为 0B
```


### 禁用SELinux

```bash
# 临时禁用 SELinux
sudo setenforce 0

sudo vim /etc/selinux/config
# 找到 SELINUX 参数，并将其值设置为 disabled
SELINUX=disabled
```
也可以直接执行如下命令：
```bash
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
```

验证状态 确保为 disabled
```bash
sestatus     # SELINUX=disabled
```


### 关闭防火墙
在 CentOS 中，`firewalld` 是默认的防火墙管理工具

为了永久关闭防火墙，并确保系统重启后防火墙不会自动启动，你需要执行以下两个命令：

1. **停止防火墙**：
   ```bash
   sudo systemctl stop firewalld
   ```

2. **禁用防火墙**：防止 `firewalld` 在系统启动时自动启动。
   ```bash
   sudo systemctl disable firewalld
   ```

关闭防火墙后，再次检查防火墙状态以确认它已经停止：

```bash
sudo firewall-cmd --state   # not running
```



### 配置时间同步

CentOS 7 开始默认使用 Chrony，不再默认安装 NTP（ntpd），推荐使用基于chrony配置服务器时间跟网络时间同步

::: tabs

@tab NTP（ntpd）

```bash
# 硬件时钟设置为UTC
timedatectl set-local-rtc 0

# 设置本地时区，显示本地时间
timedatectl set-timezone Asia/Shanghai

# 手动加载RTC设置
hwclock --systohc
```

@tab:active Chrony

确保安装了chronyd 并设置了开机自启

```bash
yum install -y chrony
systemctl enable chronyd --now

systemctl status chronyd
```

修改配置文件： `vim /etc/chrony.conf` ，添加时间服务器：
```bash
server ntp.aliyun.com iburst
server ntp1.aliyun.com iburst
server ntp2.aliyun.com iburst
server ntp.tencent.com iburst
server ntp1.tencent.com iburst
server ntp2.tencent.com iburst
server time1.ntsc.ac.cn iburst
server time2.ntsc.ac.cn iburst
```
在修改完配置文件之后，需要重启 `chronyd`: `systemctl restart chronyd`

检查 `chronyd` 是否正确地连接到了新的NTP服务器：`chronyc sources` （重启后可能需要等一段时间才正常）

:::

使用 `timedatectl` 验证是否启用了时间同步（主要看最后三个字段）：
```bash
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
```

NTP（Network Time Protocol） 是一种用于计算机时钟同步的协议

Chrony 是 NTP 的一个轻量级实现，专为现代系统优化，尤其适用于间歇性联网或高精度需求的环境。



---



### 配置网络

通过修改 iptables 的配置, 让 K8s 能够转发网络流量

- `modprobe`： 是一个用于管理 Linux 内核模块的工具
- `br_netfilter` 模块：为网桥（bridge）提供网络过滤功能，允许桥接接口参与 iptables 规则处理

```bash
modprobe br_netfilter  # 临时加载 br_netfilter 模块到当前运行的内核中

lsmod | grep br_netfilter    # 检查模块是否已被加载
```

**自动加载 `br_netfilte`r 模块**:  创建/更新一个名为 `br_netfilter.conf` 的文件，并将 `br_netfilter` 写入其中，以便系统启动时自动加载该模块
```bash
echo "br_netfilter" | sudo tee /etc/modules-load.d/br_netfilter.conf
```
查看 `/etc/modules-load.d/` 目录下的相关文件来确认设置是否正确

---

设置内核参数（启用网桥上的`iptables`处理和`IP`转发）：

```bash
tee /etc/sysctl.d/k8s.conf << EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
EOF
```
从指定配置文件中读取并立即应用内核参数设置: 
```bash
sysctl -p /etc/sysctl.d/k8s.conf
```

---





## kubernetes相关准备


### 安装Docker

CentOS7.9安装Docker需要配置可用的 yum 源 和 `docker-ce.repo`，参照：[Docker的安装](/tool/cloud/Docker.md#docker的安装)

Docker 的 `cgroup` 驱动是 `cgroupfs`，而 Kubernetes 推荐使用 `systemd`
```bash
docker info | grep -i cgroup   # Cgroup Driver: cgroupfs
```

编辑 Docker 配置文件: 打开 `/etc/docker/daemon.json` 文件
```bash
vim /etc/docker/daemon.json
```
将`exec-opts`内容添加到该文件中，注意文件内容格式
```bash
{
    "registry-mirrors": [
        "https://do.nark.eu.org",
        "https://2epe3hl0.mirror.aliyuncs.com"
    ],
    "exec-opts": ["native.cgroupdriver=systemd"]
}
```

重启Docker，验证是否修改成功：
```bash
systemctl daemon-reload && systemctl restart docker

docker info | grep -i cgroup    # Cgroup Driver: systemd
```



### cri-dockerd

cri-dockerd 用于为 Docker 提供一个能够支持 K8s 容器运行时标准的工具，从而能够让 Docker 作为 K8s 容器引擎，可通过 wget 命令获取 cri-dockerd软件：
```bash
wget https://github.com/Mirantis/cri-dockerd/releases/download/v0.3.12/cri-dockerd-0.3.12-3.el7.x86_64.rpm
```
也可以通过Github下载后上传至CentOS：[Github—cri-dockerd](https://github.com/Mirantis/cri-dockerd/releases)

准备好rpm文件后，通过 rpm 命令执行安装：
```bash
rpm -ivh cri-dockerd-0.3.12-3.el7.x86_64.rpm
```
安装完成后修改配置文件（`vim /usr/lib/systemd/system/cri-docker.service`）中的`ExecStart`
```bash
ExecStart=/usr/bin/cri-dockerd --container-runtime-endpoint fd:// --pod-infra-container-image=registry.aliyuncs.com/google_containers/pause:3.9
```    

配置文件修改后，重新加载配置并开启 cri-dockerd 服务: 
```bash
systemctl daemon-reload
systemctl enable cri-docker && systemctl start cri-docker
```



### 配置k8s的Yum源

编辑 `/etc/yum.repos.d/kubernetes.repo`  配置文件，添加阿里云的镜像库

```bash
cat > /etc/yum.repos.d/kubernetes.repo << EOF
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```
更新仓库信息并清理缓存：
```bash
yum clean all && yum makecache
```


### kubeadm安装

所有K8S服务器上都需要安装 kubeadm、kubelet 和 kubectl 这三个工具
- kubeadm 用来初始化 K8s 集群；
- kubelet 是每个节点的 K8s 管理员；
- kubectl 是 K8s 的命令行交互工具。
```bash
# 指定了安装的版本是 1.28.0
yum install -y kubelet-1.28.0 kubeadm-1.28.0 kubectl-1.28.0

# 开机启动 kubelet 服务
systemctl enable kubelet
```


### IP和域名映射

修改所有节点的IP和域名映射: 
```bash
vim /etc/hosts
192.168.16.99 master
192.168.16.101 node1
192.168.16.102 node2
```



## 安装kubernetes

前面的所有操作均在模板Linux完成，接下来克隆出K8S集群所需的机器，并分别修改IP及UUID，以及主机名

1. 分别修改IP地址及UUID（使用`uuidgen`命令生成）
```bash
vim /etc/sysconfig/network-scripts/ifcfg-ens33  
```

2. 分别修改3台主机名称
```bash
hostnamectl set-hostname master / node1 / node2
more /etc/hostname  
```



### Master节点初始化
 K8s 的初始化：只需要在 Master 节点上执行以下初始化命令（最后一行可省略）
```bash
kubeadm init \
  --apiserver-advertise-address=192.168.16.99 \
  --image-repository registry.aliyuncs.com/google_containers \
  --kubernetes-version v1.28.0 \
  --service-cidr=10.96.0.0/12 \
  --pod-network-cidr=172.20.0.0/16 \
  --ignore-preflight-errors=all \
  --cri-socket=unix:///var/run/cri-dockerd.sock
```
- apiserver-advertise-address：集群广播地址，用 master 节点的内网 IP。
- image-repository：默认拉取镜像地址是 `k8s.gcr.io` 国内无法访问，这里使用阿里云镜像
- kubernetes-version： K8s 版本，与上面安装的软件版本一致。
- service-cidr：集群 Service 网段。
- pod-network-cidr：集群 Pod 网段。
- cri-socket：指定 cri-socket 接口，可以使用 `unix:///var/run/cri-dockerd.sock`

初始化比较耗时，然后按照提示执行下面命令：

配置k8s访问用户，在master节点执行以下命令：
```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```
如果是root用户，则可以执行以下命令：
```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```


### token&sha256


上述`kubeadm init`执行完成后记住输出的`kubeadm join`命令，等下需要用该命令将节点加入集群。


命令中 token 有效期为 24 小时，当 token 过期或者忘记，执行 “kubeadm join” 命令就会报错。这时可以直接在 Master 节点上使用以下命令生成新的 token

```bash
kubeadm token create --print-join-command
```


### 从节点加入集群

Master初始化之后，就可以在其他 工作节点上执行 `kubeadm join`  命令

```bash
# 示例命令
kubeadm join 192.168.xxx.xxx:6443 --token xxxxxx \
        --discovery-token-ca-cert-hash sha256:xxxxxx

# 具体参照：        
kubeadm join 192.168.16.99:6443 --token v3gf54.0uth7h65thzeozxk \
	--discovery-token-ca-cert-hash sha256:01e5553af60e305e2c732bb410947a3769d79fdd9702de0cb30cf4bd87f34b7f --cri-socket=unix:///var/run/cri-dockerd.sock
```

如果主节点指定了 cri-socket 接口，这里也要加上：
`--cri-socket=unix:///var/run/cri-dockerd.sock`




### 标记worker节点

master节点执行以下命令标记worker节点，需要将node1/node2按照salve主机名称进行修改

```bash
kubectl label node node1 node-role.kubernetes.io/worker=worker
kubectl label node node2 node-role.kubernetes.io/worker=worker
```

master节点执行查看节点信息:
```bash
kubectl get nodes
```



### Calico网络插件

下载`calico.yaml`插件部署文件并保存到本地：

```bash
mkdir -p /root/calico
cd /root/calico

curl https://docs.projectcalico.org/v3.15/manifests/calico.yaml -O
# 或者
wget https://docs.projectcalico.org/manifests/calico.yaml
```

修改`calico.yaml`中的`CALICO_IPV4POOL_CIDR`地址，value值为Master初始化开始时指定的`–pod-network-cidr`参数值，修改时注意对齐 （该文件内容很多，可通过vim 的 `/xxx`然后回车进行搜索）

```bash
# The default IPv4 pool to create on startup if none exists. Pod IPs will be
# chosen from this range. Changing this value after installation will have
# no effect. This should fall within `--cluster-cidr`.
- name: CALICO_IPV4POOL_CIDR
  value: "172.20.0.0/16"
# Disable file logging so `kubectl logs` works.
- name: CALICO_DISABLE_FILE_LOGGING
```

最后，使用 `kubectl apply` 命令将 Calico 插件部署到集群里（master部署即可）: 
```bash
kubectl apply -f calico.yaml
```
验证是否成功
```bash
kubectl get pod -A | grep calico
```

Calico 部署会比较慢，大概等个几分钟，等待 Calico 部署完成后，再次通过命令 “kubectl get node” 查看节点状态，就可以看到所有节点已经准备就绪，此时集群正式搭建成功。

```bash
[root@master ~]$ kubectl get node
NAME     STATUS   ROLES           AGE   VERSION
master   Ready    control-plane   48m   v1.28.0
node1    Ready    worker          44m   v1.28.0
node2    Ready    worker          43m   v1.28.0

```


::: info 测试网络连接 — 创建nginx pod
在默认命名空间default中创建一个名称为mynignx的deployment
```bash
kubectl create deployment mynginx --image=nginx
```
检查 Deployment 是否成功创建：`kubectl get deployments`

基于第一步创建的deployment再创建一个名叫mynginx的Service，资源类型由`–type=ClusterIP`修改为`–type=NodePort`，会在每个Node节点上监听30161端口，用于接收集群外部访问。
```bash
kubectl expose deployment mynginx --port=80 --type=NodePort
```
检查 Pod 和Service ： `kubectl get pod,svc` ，并获取供访问的端口号

访问nginx：浏览器输入`http://192.168.16.101:32116`，任意节点IP都可以访问nginx首页表示测试成功。
:::




### 初始化kubectl配置

使用 kubeadm 安装的 Kubernetes 集群，需要使用以下命令来初始化 kubectl 配置（否则后续使用`kubectl get xxx`会报错）：

```bash
couldn't get current server API group list: Get "http://localhost:8080/api?timeout=32s": dial tcp [::1]:8080: connect: connection refused
```

1. master主机配置环境变量并刷新：
    ```bash
    vim /etc/profile
    ```
    加入以下内容：
    ```bash
    export KUBECONFIG=/etc/kubernetes/admin.conf
    ```
    保存退出并执行以下代码使用环境变量生效
    ```bash
    source /etc/profile
    ```

2. 接下来还要检查各节点是否有`/etc/kubernetes/admin.conf`文件。如果没有则从主节点复制

    在master主机上执行下列命令，将配置文件复制到指定IP的主机：

    ```bash
    scp /etc/kubernetes/admin.conf root@192.168.16.101:/etc/kubernetes/
    ```
    然后到各节点主机上按照master的示例配置环境变量并刷新
    




### Kubernetes Dashboard

Dashboard是官方提供的可视化插件，可用于 部署容器化的应用、监控应用的状态、执行故障排查任务以及管理 Kubernetes 各种资源。[Github](github.com/kubernetes/dashboard)

dashboard的服务默认没使用nodeport，可将yaml文件下载到本地，在service里添加nodeport

```bash
curl -O https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
```

编辑文件内容,修改type和nodePort（nodePort也可以不声明，会自动生成随机端口号）

```yaml
spec:
  type: NodePort
  ports:
    - port: 443
      targetPort: 8443
      #nodePort: 30000
```

应用配置文件，然后查看kubernetes-dashboard的service状态获取端口号：
```bash
kubectl apply -f recommended.yaml
# 或者kubectl create -f recommended.yaml

# 检查是否处于 Running 状态
kubectl get pods -n kubernetes-dashboard
# 获取端口号
kubectl get svc -n kubernetes-dashboard
```
在浏览器输入机器的ip+端口，进入登录页面 （注意使用`https://`访问）浏览器可能会提示不安全，此时在浏览器界面输入：`thisisunsafe`即可 （没有输入框的，盲打即可）


::: tip 创建Kubernetes Dashboard管理员并生成登录token

为了安全地访问 Dashboard，建议创建一个具有适当权限的服务账户和绑定角色
```bash
vim dashboard-admin.yaml
```
内容如下：
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard
```
配置应用，并获取token：
```bash
kubectl apply -f dashboard-admin.yaml
```

从 Kubernetes v1.24 开始，默认情况下 ServiceAccount 不再自动创建 Secret（用于存储 Token）。需要为 ServiceAccount 手动生成 Token。

```bash
kubectl -n kubernetes-dashboard create token admin-user
```

复制生成的 Token，用于登录 Dashboard。需要注意的是这种方式1小时就会过期。
:::


### Metrics Server

Metrics Server 是 Kubernetes 集群中的一个组件，负责提供节点和 Pod 的资源使用指标（如 CPU、内存）。这些指标被 Dashboard 和 kubectl top 等工具使用，用于显示集群运行状态。

```bash
wget https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```
修改配置文件，确保包含下面的内容（实验环境没有证书，因此禁用Kubelet 证书验证）：
```yaml
args:
  - --kubelet-insecure-tls
  - --kubelet-preferred-address-types=InternalIP
```
这里需要注意配置文件中的镜像，根据环境看是否可以替换为自己已知的镜像网址，或者找其他地方下载的镜像导入到docker中， 接下来就可以部署了
```bash
kubectl apply -f metrics-server.yaml

# 查看运行状态
kubectl -n kube-system get pods -l k8s-app=metrics-server

# 检查集群指标是否可用：
kubectl top nodes
kubectl top pods
```


### 部署本地镜像

以在集群中通过本地镜像安装dashboard为例：

提前准备好 yaml 文件，根据配置文件提前将镜像文件pull下来，复制到其他节点：
```bash
docker pull kubernetesui/dashboard:v2.7.0
docker pull kubernetesui/metrics-scraper:v1.0.8
```
在 master 节点，使用 `docker save` 将镜像导出为 `.tar` 文件：
```bash
docker save -o metrics-scraper.tar kubernetesui/metrics-scraper:v1.0.8
docker save -o dashboard.tar kubernetesui/dashboard:v2.7.0
```
将 `.tar` 文件使用 `scp` 命令从 master 节点复制到其他节点：
```bash
scp metrics-scraper.tar dashboard.tar root@192.168.16.101:/root/docker-images
scp metrics-scraper.tar dashboard.tar root@192.168.16.102:/root/docker-images
```
登录到每个目标节点，并使用 `docker load` 将镜像加载到本地：
```bash
docker load -i /root/docker-images/metrics-scraper.tar
docker load -i /root/docker-images/dashboard.tar
# 验证镜像是否加载成功
docker images | grep kubernetesui
```

加载完成后，可以删除临时的 `.tar` 文件以释放空间
```bash
rm -f /root/docker-images/metrics-scraper.tar
rm -f /root/docker-images/dashboard.tar
```





## 通过代理安装官方源

配置永久代理：

```bash
vim /etc/profile
# 内容：
export http_proxy=http://192.168.83.54:7890
export https_proxy=http://192.168.83.54:7890
export no_proxy=localhost,127.0.0.1,192.168.0.0/16
# source
source /etc/profile

# docker proxy
mkdir -p /etc/systemd/system/docker.service.d
vim /etc/systemd/system/docker.service.d/http-proxy.conf
# 添加下面内容
[Service]
Environment="HTTP_PROXY=http://192.168.83.54:7890"
Environment="HTTPS_PROXY=http://192.168.83.54:7890"
Environment="NO_PROXY=localhost,127.0.0.1,192.168.0.0/16,10.233.64.0/18,lb.kubesphere.local,10.233.0.0/18"

# 重启Docker
systemctl daemon-reload && systemctl restart docker


# containerd proxy
mkdir -p /etc/systemd/system/containerd.service.d
vim /etc/systemd/system/containerd.service.d/http-proxy.conf
# 添加下面内容
[Service]
Environment="HTTP_PROXY=http://192.168.83.54:7890"
Environment="HTTPS_PROXY=http://192.168.83.54:7890"
Environment="NO_PROXY=localhost,127.0.0.1,192.168.0.0/16,10.233.64.0/18,lb.kubesphere.local,10.233.0.0/18"

# 重启containerd
systemctl daemon-reload && systemctl restart containerd
```

临时代理方式：

```bash
export http_proxy=http://192.168.83.54:7890
export https_proxy=http://192.168.83.54:7890
export no_proxy=localhost,127.0.0.1,192.168.0.0/16

unset http_proxy
```


