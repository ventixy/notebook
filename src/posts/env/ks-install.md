---
article: true
date: 2024-12-29
category:
  - Kubernetes
tag:
  - kubesphere 
  - K8S
  - Kubekey 
shortTitle: KubeSphere离线安装
title: KubeSphere离线安装Kubernetes集群
---


官网也有介绍关于离线环境中部署 Kubernetes v1.28.12 和 KubeSphere v4.1.2 的教程： [离线安装 KubeSphere](https://kubesphere.io/zh/docs/v4.1/03-installation-and-upgrade/02-install-kubesphere/04-offline-installation/)

但有一些细节地方容易出错，加上高度集成的工具，安装过程出错很难排查


本次实验通过两台CentOS7.9的虚拟机进行：
| IP    | hostname    |  角色和作用   |
| --- | --- | --- |
|  192.168.16.60   |   ks-registry  |   离线环境的镜像仓库节点  |
|  192.168.16.61    |  ks-master   |  制作离线包（需要联网），集群主节点和工作节点   |

所有节点需要安装如下软甲：
```bash
yum install socat conntrack -y
```
实验环境并且最好关闭防火墙，交换分区等，详细设置参考：[linux基础环境设置](/posts/env/k8s.md#linux基础环境准备)，避免后续安装出问题


## 构建离线安装包

先根据版本信息获取镜像列表，具体参考官网即可：[获取版本信息及镜像列表](https://kubesphere.io/zh/docs/v4.1/03-installation-and-upgrade/02-install-kubesphere/04-offline-installation/#_获取版本信息及镜像列表)

拓展插件建议全部勾选，因为有的插件存在依赖，若没选中需要的依赖，后续无法顺利安装插件

kubesphere将会发送以下三个文件到指定邮箱：`kubesphere-images.txt`, `kk-manifest.yaml`, `kk-manifest-mirror.yaml` 


### 下载相关工具

以下命令需要联网（最好提前配置好代理），也可以预先使用  `export KKZONE=cn` 命令

1. 安装 KubeKey，执行以下命令安装⼯具 KubeKey：

```bash
curl -sSL https://get-kk.kubesphere.io | sh -
```
下载完成后当前目录下将生成 KubeKey 二进制文件 `kk`

2. 安装 helm

```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

3. 下载 KubeSphere Core Helm Chart

```bash
helm fetch https://charts.kubesphere.io/main/ks-core-1.1.3.tgz
```




### 构建离线安装包

创建 manifest 文件 （同样考虑使用代理或`export KKZONE=cn`命令）

如需使用 KubeKey 离线部署镜像仓库，添加 `--with-registry` 打包镜像仓库的安装文件

```
./kk create manifest --with-kubernetes v1.28.12 --with-registry
```
该命令将创建一个 `manifest-sample.yaml` 文件。

若需要使用 kk 部署 Kubernetes 以及镜像仓库，将从邮件获取到的 KubeSphere 镜像列表添加到新创建的 manifest 文件中即可：
```bash
vim manifest-sample.yaml
```
复制 `kk-manifest.yaml` 或 `kk-manifest-mirror.yaml`（若访问 DockerHub 受限） 中的镜像列表，添加到新创建的 `manifest-sample.yaml` 文件中(追加到 `images:` 后面即可)

::: details manifest 文件示例
```yaml

apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Manifest
metadata:
  name: sample
spec:
  arches:
  - amd64
  operatingSystems: []
  kubernetesDistributions:
  - type: kubernetes
    version: v1.28.12
  components:
    helm:
      version: v3.14.3
    cni:
      version: v1.2.0
    etcd:
      version: v3.5.13
    containerRuntimes:
    - type: docker
      version: 24.0.9
    - type: containerd
      version: 1.7.13
    calicoctl:
      version: v3.27.4
    crictl:
      version: v1.29.0
    docker-registry:
      version: "2"
    harbor:
      version: v2.10.1
    docker-compose:
      version: v2.26.1
  images:
  - registry.cn-beijing.aliyuncs.com/kubesphereio/pause:3.9
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-apiserver:v1.28.12
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controller-manager:v1.28.12
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-scheduler:v1.28.12
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-proxy:v1.28.12
  - registry.cn-beijing.aliyuncs.com/kubesphereio/coredns:1.9.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/k8s-dns-node-cache:1.22.20
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-controllers:v3.27.4
  - registry.cn-beijing.aliyuncs.com/kubesphereio/cni:v3.27.4
  - registry.cn-beijing.aliyuncs.com/kubesphereio/node:v3.27.4
  - registry.cn-beijing.aliyuncs.com/kubesphereio/pod2daemon-flexvol:v3.27.4
  - registry.cn-beijing.aliyuncs.com/kubesphereio/typha:v3.27.4
  - registry.cn-beijing.aliyuncs.com/kubesphereio/flannel:v0.21.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/flannel-cni-plugin:v1.1.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/cilium:v1.15.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/operator-generic:v1.15.3
  - registry.cn-beijing.aliyuncs.com/kubesphereio/hybridnet:v0.8.6
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-ovn:v1.10.10
  - registry.cn-beijing.aliyuncs.com/kubesphereio/multus-cni:v3.8
  - registry.cn-beijing.aliyuncs.com/kubesphereio/provisioner-localpv:3.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/linux-utils:3.3.0
  - registry.cn-beijing.aliyuncs.com/kubesphereio/haproxy:2.9.6-alpine
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kube-vip:v0.7.2
  - registry.cn-beijing.aliyuncs.com/kubesphereio/kata-deploy:stable
  - registry.cn-beijing.aliyuncs.com/kubesphereio/node-feature-discovery:v0.10.0
  ## ks-core
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/ks-apiserver:v4.1.2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/ks-console:v4.1.2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/ks-controller-manager:v4.1.2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kubectl:v1.27.16
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/redis:7.2.4-alpine
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/haproxy:2.9.6-alpine
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/ks-extensions-museum:v1.1.2
  ## devops
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/devops-apiserver:v4.1.2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/devops-controller:v4.1.2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/devops-tools:v4.1.2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/devops-jenkins:v4.1.2-2.346.3
  - swr.cn-southwest-2.myhuaweicloud.com/ks/jenkins/inbound-agent:4.10-2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-base:v3.2.2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-nodejs:v3.2.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-maven:v3.2.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-maven:v3.2.1-jdk11
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-python:v3.2.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-go:v3.2.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-go:v3.2.2-1.16
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-go:v3.2.2-1.17
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-go:v3.2.2-1.18
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-base:v3.2.2-podman
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-nodejs:v3.2.0-podman
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-maven:v3.2.0-podman
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-maven:v3.2.1-jdk11-podman
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-python:v3.2.0-podman
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-go:v3.2.0-podman
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-go:v3.2.2-1.16-podman
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-go:v3.2.2-1.17-podman
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/builder-go:v3.2.2-1.18-podman
  - swr.cn-southwest-2.myhuaweicloud.com/ks/argoproj/argocd:v2.3.3
  - swr.cn-southwest-2.myhuaweicloud.com/ks/argoproj/argocd-applicationset:v0.4.1
  - swr.cn-southwest-2.myhuaweicloud.com/ks/dexidp/dex:v2.30.2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/library/redis:6.2.6-alpine
  ## gatekeeper
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/gatekeeper-extension-apiserver:v1.0.1
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kubectl:v1.27.12
  - swr.cn-southwest-2.myhuaweicloud.com/ks/openpolicyagent/gatekeeper:v3.14.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/openpolicyagent/gatekeeper-crds:v3.14.0
  ## gateway
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/nginx-ingress-controller:v1.4.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/gateway-apiserver:v1.0.2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/gateway-controller-manager:v1.0.2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kubectl:v1.27.16
  ## grafana
  - swr.cn-southwest-2.myhuaweicloud.com/ks/curlimages/curl:7.85.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/grafana/grafana:10.4.1
  - swr.cn-southwest-2.myhuaweicloud.com/ks/library/busybox:1.31.1
  ## kubeedge
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubeedge/iptables-manager:v1.13.1
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubeedge/cloudcore:v1.13.1
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubeedge/controller-manager:v1.13.1
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kubeedge-proxy:v0.4.1
  ## kubefed
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kubefed-extension:v1.0.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kubefed:v0.8.1
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kubectl:v1.27.4
  ## loki
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kubectl:v1.27.12
  - swr.cn-southwest-2.myhuaweicloud.com/ks/grafana/loki:3.0.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/grafana/loki-helm-test:ewelch-distributed-helm-chart-17db5ee
  - swr.cn-southwest-2.myhuaweicloud.com/ks/grafana/loki-canary:3.0.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/nginxinc/nginx-unprivileged:1.24-alpine
  - swr.cn-southwest-2.myhuaweicloud.com/ks/library/memcached:1.6.23-alpine
  - swr.cn-southwest-2.myhuaweicloud.com/ks/prom/memcached-exporter:v0.14.2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kiwigrid/k8s-sidecar:1.24.3
  - swr.cn-southwest-2.myhuaweicloud.com/ks/minio/minio:RELEASE.2022-09-17T00-09-45Z
  - swr.cn-southwest-2.myhuaweicloud.com/ks/minio/mc:RELEASE.2022-09-16T09-16-47Z
  ## metrics-server
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/metrics-server:v0.7.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/addon-resizer:1.8.20
  ## network
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/network-extension-apiserver:v1.1.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/network-extension-controller:v1.1.0
  ## openpitrix
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/apps-manage:v2.0.1
  ## opensearch
  - swr.cn-southwest-2.myhuaweicloud.com/ks/opensearchproject/opensearch:2.8.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/library/busybox:1.35.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/opensearch-curator:v0.0.5
  - swr.cn-southwest-2.myhuaweicloud.com/ks/opensearchproject/opensearch-dashboards:2.8.0
  ## servicemesh
  - swr.cn-southwest-2.myhuaweicloud.com/ks/istio/pilot:1.16.5
  - swr.cn-southwest-2.myhuaweicloud.com/ks/istio/proxyv2:1.16.5
  - swr.cn-southwest-2.myhuaweicloud.com/ks/istio/istioctl:1.16.5
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kubectl:v1.27.4
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kiali-operator:v1.59.1
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kiali:v1.59
  - swr.cn-southwest-2.myhuaweicloud.com/ks/jaegertracing/jaeger-operator:1.35.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/jaegertracing/jaeger-agent:1.35
  - swr.cn-southwest-2.myhuaweicloud.com/ks/jaegertracing/jaeger-collector:1.35
  - swr.cn-southwest-2.myhuaweicloud.com/ks/jaegertracing/jaeger-query:1.35
  - swr.cn-southwest-2.myhuaweicloud.com/ks/jaegertracing/jaeger-es-index-cleaner:1.35
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/servicemesh-apiserver:v0.1.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/servicemesh-controller-manager:v0.1.0
  ## storage-utils
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/storageclass-accessor:v0.2.5
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/snapshot-controller:v4.2.1
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/snapshotclass-controller:v0.0.1
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/pvc-autoresizer:v0.3.1
  ## tower
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/tower:v0.2.1
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/tower-extension:v1.0.0
  ## vector
  - swr.cn-southwest-2.myhuaweicloud.com/ks/timberio/vector:0.39.0-debian
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kubectl:v1.27.12
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/vector-config:v0.2.1
  ## whizard-alerting
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/whizard-alerting-apiserver:v1.0.2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/whizard-alerting-controller-manager:v1.0.2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/thanosio/thanos:v0.36.1
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kubectl:v1.27.12
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/cortex-tenant:v1.12.5
  - swr.cn-southwest-2.myhuaweicloud.com/ks/prometheus-operator/prometheus-config-reloader:v0.75.1
  ## whizard-events
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kube-events-exporter:v0.8.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/jimmidyson/configmap-reload:v0.9.0
  ## whizard-logging
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kubectl:v1.27.12
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/log-sidecar-injector:v1.3.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/jimmidyson/configmap-reload:v0.9.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/elastic/filebeat:6.7.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/timberio/vector:0.39.0-debian
  - swr.cn-southwest-2.myhuaweicloud.com/ks/library/alpine:3.14
  ## whizard-monitoring
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kubectl:v1.27.12
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kube-state-metrics:v2.12.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubespheredev/kube-webhook-certgen:v20221220-controller-v1.5.1-58-g787ea74b6
  - swr.cn-southwest-2.myhuaweicloud.com/ks/thanosio/thanos:v0.36.1
  - swr.cn-southwest-2.myhuaweicloud.com/ks/brancz/kube-rbac-proxy:v0.18.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/prometheus-operator/prometheus-config-reloader:v0.75.1
  - swr.cn-southwest-2.myhuaweicloud.com/ks/prometheus-operator/prometheus-operator:v0.75.1
  - swr.cn-southwest-2.myhuaweicloud.com/ks/prometheus/node-exporter:v1.8.1
  - swr.cn-southwest-2.myhuaweicloud.com/ks/prometheus/prometheus:v2.51.2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/dcgm-exporter:3.3.5-3.4.0-ubuntu22.04
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/process-exporter:0.5.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/nginxinc/nginx-unprivileged:1.24
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/calico-exporter:v0.3.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/whizard-monitoring-helm-init:v0.1.0
  ## whizard-notification
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kubectl:v1.27.12
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/kube-rbac-proxy:v0.11.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/alertmanager-proxy:v0.2.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/notification-manager-operator:v2.5.2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/notification-manager:v2.5.2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/notification-tenant-sidecar:v4.0.2
  - swr.cn-southwest-2.myhuaweicloud.com/ks/prometheus/alertmanager:v0.27.0
  - swr.cn-southwest-2.myhuaweicloud.com/ks/prometheus-operator/prometheus-config-reloader:v0.75.1
  ## whizard-telemetry
  - swr.cn-southwest-2.myhuaweicloud.com/ks/kubesphere/whizard-telemetry-apiserver:v1.2.2
  registry:
    auths: {}
```
:::


执行以下命令构建包含`ks-core` 及各扩展组件镜像的离线安装包：

```bash
./kk artifact export -m manifest-sample.yaml -o kubesphere.tar.gz
```

执行成功后，将显示：`Pipeline[ArtifactExportPipeline] execute successfully`

<br/>

到此获得了离线安装需要的全部文件：

- kk

- kubesphere.tar.gz

- ks-core-1.1.3.tgz


### 安装环境说明

一般情况下，离线安装的场景是通过一台联网主机获取离线镜像（上面的操作），再部署到自己的内网环境中，这时候把上面的三个文件传到需要安装集群的master节点主机即可。本次实验就继续使用该主机作为kubernetes的master节点和工作节点。

<br/>

在后续的安装过程中，官网教程在制作镜像仓库和安装的文档中给的信息相对简洁，容易出问题，这里采用先创建仓库（这里选择docker registry， harbor相对麻烦一些），再把前面准备镜像安装包推送到仓库，然后再执行最后的安装。

<br/>

后续操作全部再**主节点**上进行即可（自己提前配置好内网环境）


### 离线集群配置文件

创建离线集群配置文件：

```bash
./kk create config --with-kubernetes v1.28.12
```

⭐⭐⭐**修改配置文件** ：按照离线环境的实际配置修改节点信息

```bash
vim config-sample.yaml
```
关键点在于配置好自己机器的信息和集群节点分配，以及镜像仓库相关配置

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Cluster
metadata:
  name: ks-sample
spec:
  hosts:
  - {name: ks-master, address: 192.168.16.61, internalAddress: 192.168.16.61, user: root, password: "000000"}
  - {name: ks-registry, address: 192.168.16.60, internalAddress: 192.168.16.60, user: root, password: "000000"}
  roleGroups:
    etcd:
    - ks-master
    control-plane: 
    - ks-master
    worker:
    - ks-master
    registry:
    - ks-registry
  controlPlaneEndpoint:
    ## Internal loadbalancer for apiservers 
    # internalLoadbalancer: haproxy

    domain: lb.kubesphere.local
    address: ""
    port: 6443
  kubernetes:
    version: v1.28.12
    clusterName: cluster.local
    autoRenewCerts: true
    containerManager: containerd
  etcd:
    type: kubekey
  network:
    plugin: calico
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
    ## multus support. https://github.com/k8snetworkplumbingwg/multus-cni
    multusCNI:
      enabled: false
  registry:
    #type: 默认使用 docker registry
    auths:
      "dockerhub.kubekey.local":
        # 部署 harbor 时需指定 harbor 帐号密码
        # username: admin
        # password: Harbor12345
        skipTLSVerify: true
    # 私有仓库地址：填写自己创建的镜像仓库地址
    privateRegistry: "dockerhub.kubekey.local"
    # 注意这里不要乱填
    namespaceOverride: "kubesphereio"
    registryMirrors: []
    insecureRegistries: []
  addons: []

```
最容易出问题就是`privateRegistry`和`namespaceOverride`这里，按照官网的不要乱改就行，个人感觉官网文档描述也不够清晰准确






## 自建镜像仓库

### 创建镜像仓库

执行以下命令创建镜像仓库: （KubeKey帮我们在指定节点创建一个镜像仓库）
```bash
./kk init registry -f config-sample.yaml -a kubesphere.tar.gz
```

- `config-sample.yaml` 为离线集群的关键配置文件。

- `kubesphere.tar.gz` 为前面生成的离线安装包。

如果显示下面内容，则表明镜像仓库创建成功
```bash
Local image registry created successfully. Address: dockerhub.kubekey.local

00:14:20 EST success: [ks-registry]
00:14:20 EST [ChownWorkerModule] Chown ./kubekey dir
00:14:20 EST success: [LocalHost]
00:14:20 EST Pipeline[InitRegistryPipeline] execute successfully
```

::: important pull自建仓库镜像的注意事项
在创建镜像仓库的同时，已经在配置文件中的主机会在`dockerhub.kubekey.local`目录下多出一个凭证目录：
```bash
[root@ks-master ~]$ ls /etc/docker/certs.d/dockerhub.kubekey.local/
ca.crt  dockerhub.kubekey.local.cert  dockerhub.kubekey.local.key
```
后续加入集群的节点或者想要拉取自建仓库镜像的其他主机需要将`dockerhub.kubekey.local`拷贝过去。

并且`/etc/hosts` 文件中有  `192.168.16.60  dockerhub.kubekey.local` 这个配置（`192.168.16.60` 为自建镜像仓库主机的IP地址）
:::



### 推送镜像到仓库 

推送离线镜像到刚才创建的镜像仓库：
```bash
./kk artifact image push -f config-sample.yaml -a kubesphere.tar.gz
```
如果显示下面内容，则表明镜像推送到仓库成功
```bash
00:27:52 EST success: [LocalHost]
00:27:52 EST [ChownWorkerModule] Chown ./kubekey dir
00:27:52 EST success: [LocalHost]
00:27:52 EST Pipeline[ArtifactImagesPushPipeline] execute successfully
```

推送成功后，可以在镜像仓库节点主机上的指定位置看到相关镜像：
```bash
[root@ks-registry ~]$ ls /mnt/registry/docker/registry/v2/repositories/
ks  kubesphereio
[root@ks-registry ~]$ ls /mnt/registry/docker/registry/v2/repositories/ks
argoproj    dexidp   istio          jimmidyson  kubesphere     minio            opensearchproject  prometheus-operator
brancz      elastic  jaegertracing  kiwigrid    kubespheredev  nginxinc         prom               thanosio
curlimages  grafana  jenkins        kubeedge    library        openpolicyagent  prometheus         timberio
```

此时可以在内网环境的机器中使用 `crictl pull` 或 `docker pull` 拉去到该仓库的镜像（具体镜像名和版本参照邮件收到的文件中的信息），例如：
```bash
dockerhub.kubekey.local
```





## 安装KubeSphere

创建好仓库并准备好镜像后，安装就变得很简单了

### 安装Kubernetes

安装 Kubernetes，执行以下命令创建 Kubernetes 集群
```bash
./kk create cluster -f config-sample.yaml -a kubesphere.tar.gz --with-local-storage --skip-push-images
```
`--skip-push-images`表明不再需要推送镜像到仓库了，前面已经单独推送过了

创建成功会看到如下信息：
```bash
00:32:20 EST Pipeline[CreateClusterPipeline] execute successfully
Installation is complete.
Please check the result using the command:
        kubectl get pod -A
```



### 安装KubeSphere

安装 KubeSphere：
```bash
helm upgrade --install -n kubesphere-system --create-namespace ks-core ks-core-1.1.3.tgz \
     --set global.imageRegistry=dockerhub.kubekey.local/ks \
     --set extension.imageRegistry=dockerhub.kubekey.local/ks \
     --set ksExtensionRepository.image.tag=v1.1.2 \
     --debug \
     --wait
```
如需高可用部署 KubeSphere，可在命令中添加 `--set ha.enabled=true,redisHA.enabled=true`

如果显示如下信息，则表明 KubeSphere 安装成功：
```bash
NOTES:
Thank you for choosing KubeSphere Helm Chart.

Please be patient and wait for several seconds for the KubeSphere deployment to complete.

1. Wait for Deployment Completion

    Confirm that all KubeSphere components are running by executing the following command:

    kubectl get pods -n kubesphere-system
2. Access the KubeSphere Console

    Once the deployment is complete, you can access the KubeSphere console using the following URL:  

    http://192.168.16.61:30880

3. Login to KubeSphere Console

    Use the following credentials to log in:

    Account: admin
    Password: P@88w0rd

NOTE: It is highly recommended to change the default password immediately after the first login.
For additional information and details, please visit https://kubesphere.io.
```

浏览器访问提示的网址，输入账号密码即可进入管理界面。可根据需要自行安装插件，因为前面全部插件都选中了，所以所有的插件镜像都在我们的自建仓库了，安装无需再下载。




### 添加集群节点

在使用kk安装kubernetes的场景下，可以很方便的添加节点， 但如果您的 Kubernetes 不是通过 KubeKey 安装的话，并不适用下列方法。

在一般场景下，需要准备新的主机来拓展集群，这里直接使用注册镜像仓库的节点来拓展一个工作节点

1. 准备好新节点的主机，确保与当前集群互联互通
2. 基于之前的 `config-sample.yaml` 配置文件，添加新节点信息，并配置角色类型，如：

```yaml
spec:
  hosts:
  - {name: ks-master, address: 192.168.16.61, internalAddress: 192.168.16.61, user: root, password: "000000"}
  - {name: ks-registry, address: 192.168.16.60, internalAddress: 192.168.16.60, user: root, password: "000000"}
  roleGroups:
    etcd:
    - ks-master
    control-plane: 
    - ks-master
    worker:
    - ks-master
    - ks-registry
```

3. 直接在已有的master节点执行以下命令添加节点（复用之前的`kk`，不用重新在新机器下载）：

```bash
./kk add nodes -f config-sample.yaml
```

成功会有如下信息：`Pipeline[AddNodesPipeline] execute successfully`，接下来执行以下命令查看当前集群的节点：
```bash
kubectl get node
```
在kubesphere的管理界面中也能看到新添加的节点信息