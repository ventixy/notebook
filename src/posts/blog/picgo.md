---
article: true
date: 2022-09-09
category:
  - Github
  - Cloudflare
  - PicGo
tag:
  - Github
  - Cloudflare
  - PicGo
  - 图床
shortTitle: 免费图床搭建
title: 免费图床搭建：Github+Cloudflare+PicGo
---



PicGo: [Github](https://github.com/Molunerfinn/PicGo)， [Download](https://github.com/Molunerfinn/PicGo/releases)


## Github图床

注意：Github单个仓库有容量限制 [Repository size limits](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github#repository-size-limits)

::: info Github图床搭建步骤
#### 1. 创建 GitHub 图床仓库

注册登录Github --> 创建一个新仓库

#### 2. 生成Personal access token(个人令牌)

  - 点击右上角用户头像，选择 `Settings`
  - 左侧菜单栏末尾，选择 `Developer settings`
  - 点击 `Personal access tokens`（个人访问令牌）,选择 `Token`(classic)
  - 点击 `Generate new token` 开始创建一个新的令牌，选择 classic 方式

  ![](https://image.ventix.top/img02/20220111111556617.png)

#### 3. 保存生成的tokens

输入个人令牌名称(自定义) --> Expiration选择 `No expiration`(永久) --> repo全部打勾，其他保持默认，然后点击`Generate token`

![](https://image.ventix.top/img02/20220111112303274.png)

保存生成的tokens, 注意页面关闭后就无法查看!

:::


## Cloudflare加速

1. 登录 Cloudflare，新建并部署 Workers

![](https://image.ventix.top/img02/20240111113331308.png)

点击 `Create Worker`，自定义应用名，点击 Deploy

![](https://image.ventix.top/img02/20250111113620298.png)


2. 点击 `edit code`, 将代码替换为下面的内容：

::: details Github图床代理 代码示例

```js
// Website you intended to retrieve for users.
const upstream = "raw.githubusercontent.com";

// Custom pathname for the upstream website.
// (1) 填写代理的路径，格式为 /<用户>/<仓库名>/<分支>
const upstream_path = "/username/reponame/master";

// github personal access token.
// (2) 填写github令牌
const github_token = "ghp_rxxxxxxxxxxxxxxxxxxxxxxxx";

// Website you intended to retrieve for users using mobile devices.
const upstream_mobile = upstream;

// Countries and regions where you wish to suspend your service.
const blocked_region = [];

// IP addresses which you wish to block from using your service.
const blocked_ip_address = ["0.0.0.0", "127.0.0.1"];

// Whether to use HTTPS protocol for upstream address.
const https = true;

// Whether to disable cache.
const disable_cache = false;

// Replace texts.
const replace_dict = {
  $upstream: "$custom_domain",
};

addEventListener("fetch", (event) => {
  event.respondWith(fetchAndApply(event.request));
});

async function fetchAndApply(request) {
  const region = request.headers.get("cf-ipcountry")?.toUpperCase();
  const ip_address = request.headers.get("cf-connecting-ip");
  const user_agent = request.headers.get("user-agent");

  let response = null;
  let url = new URL(request.url);
  let url_hostname = url.hostname;

  if (https == true) {
    url.protocol = "https:";
  } else {
    url.protocol = "http:";
  }

  if (await device_status(user_agent)) {
    var upstream_domain = upstream;
  } else {
    var upstream_domain = upstream_mobile;
  }

  url.host = upstream_domain;
  if (url.pathname == "/") {
    url.pathname = upstream_path;
  } else {
    url.pathname = upstream_path + url.pathname;
  }

  if (blocked_region.includes(region)) {
    response = new Response(
      "Access denied: WorkersProxy is not available in your region yet.",
      {
        status: 403,
      }
    );
  } else if (blocked_ip_address.includes(ip_address)) {
    response = new Response(
      "Access denied: Your IP address is blocked by WorkersProxy.",
      {
        status: 403,
      }
    );
  } else {
    let method = request.method;
    let request_headers = request.headers;
    let new_request_headers = new Headers(request_headers);

    new_request_headers.set("Host", upstream_domain);
    new_request_headers.set("Referer", url.protocol + "//" + url_hostname);
    new_request_headers.set("Authorization", "token " + github_token);

    let original_response = await fetch(url.href, {
      method: method,
      headers: new_request_headers,
      body: request.body,
    });

    let connection_upgrade = new_request_headers.get("Upgrade");
    if (connection_upgrade && connection_upgrade.toLowerCase() == "websocket") {
      return original_response;
    }

    let original_response_clone = original_response.clone();
    let original_text = null;
    let response_headers = original_response.headers;
    let new_response_headers = new Headers(response_headers);
    let status = original_response.status;

    if (disable_cache) {
      new_response_headers.set("Cache-Control", "no-store");
    } else {
      new_response_headers.set("Cache-Control", "max-age=43200000");
    }

    new_response_headers.set("access-control-allow-origin", "*");
    new_response_headers.set("access-control-allow-credentials", true);
    new_response_headers.delete("content-security-policy");
    new_response_headers.delete("content-security-policy-report-only");
    new_response_headers.delete("clear-site-data");

    if (new_response_headers.get("x-pjax-url")) {
      new_response_headers.set(
        "x-pjax-url",
        response_headers
          .get("x-pjax-url")
          .replace("//" + upstream_domain, "//" + url_hostname)
      );
    }

    const content_type = new_response_headers.get("content-type");
    if (
      content_type != null &&
      content_type.includes("text/html") &&
      content_type.includes("UTF-8")
    ) {
      original_text = await replace_response_text(
        original_response_clone,
        upstream_domain,
        url_hostname
      );
    } else {
      original_text = original_response_clone.body;
    }

    response = new Response(original_text, {
      status,
      headers: new_response_headers,
    });
  }
  return response;
}

async function replace_response_text(response, upstream_domain, host_name) {
  let text = await response.text();

  var i, j;
  for (i in replace_dict) {
    j = replace_dict[i];
    if (i == "$upstream") {
      i = upstream_domain;
    } else if (i == "$custom_domain") {
      i = host_name;
    }

    if (j == "$upstream") {
      j = upstream_domain;
    } else if (j == "$custom_domain") {
      j = host_name;
    }

    let re = new RegExp(i, "g");
    text = text.replace(re, j);
  }
  return text;
}

async function device_status(user_agent_info) {
  var agents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];
  var flag = true;
  for (var v = 0; v < agents.length; v++) {
    if (user_agent_info.indexOf(agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}
```
:::

将 `upstream_path` 和 `github_token` 替换为自己的仓库信息和前面保存的token


3. 添加自定义域名

注意：需要准备好一个托管到Cloudflare的二级域名(域名前面添加一个名称就变成二级域名)

在刚才创建的应用下点击 `Settings` --> 点击`Domains & Routes`后面的`Add` --> 点击`Custom domain`, 输入自定义域名：

![](https://image.ventix.top/img02/20250111115624102.png)

点击右下角的 `Add domain` 即可

## PicGo配置

配置PicGo的Github图床

![](https://image.ventix.top/img02/20240111112734212.png)