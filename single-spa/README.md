# 学习 single-spa

## 前言

工作中用到了 qiankunjs,想着大概了解一下其原理，方便后续遇到问题能够快速排查。根据自己看到的一些文章，我能 get 到的关键点是：

1. 路由加载 ——single-spa 方案
2. 应用隔离（js/css） ——自己实现
   因此关于路由加载这块我就选择了解一下 single-spa 的实现方案。

## 起 demo

不得不说官网的内容太多了，不光是概念，还有涉及到的无数个 npm 包和 examnples 要看，给人一种很复杂的感觉。最后我终于找到了一个起 demo 最简单的方式，将[概览](https://zh-hans.single-spa.js.org/docs/getting-started-overview#%E7%AE%80%E5%8D%95%E7%94%A8%E6%B3%95)提供的代码进行稍微改动即可

### 目录

├── app1 -- 子应用 1
│ └── app1.js
├── app2 -- 子应用 2
│ └── app2.js
├── index.html -- 主应用入口
├── single-spa-config.js -- 主应用 js
├── single-spa.dev.js -- single-spa（本地 build:dev single-spa 后从 lib/esm 里获取的）
├── single-spa.dev.js.map
├── single-spa.min.js -- single-spa（本地 build:prod single-spa 后从 lib/esm 里获取的）
└── single-spa.min.js.map

### 运行方式

1. 本地
   1. 可以全局安装[http-server](https://www.npmjs.com/package/http-server)(此包可在本地快速起一个静态服务器，平时也用得到)
   2. 运行`http-server --proxy http://localhost:8080\?`,[proxy](https://github.com/http-party/http-server#catch-all-redirect)这么配置是做一个重定向，如果找不到路径就重定向到 index.html,在访问子应用的时候有用
   3. 访问路由`http://localhost:8080`、`http://localhost:8080/son1`、`http://localhost:8080/son2`可看到正常加载 app1 app2
2. 放到服务器上
   1. 配置 nginx 做一个重定向，访问子应用时重定向到 index.html

```
//此处是我的nginx配置
server {
    listen       7000;
    server_name  _;

    location / {
   	  root	/usr/share/nginx/single-spa;
	    index index.html;
	    # 处理前端路由history模式找不到，默认给index.html
	    try_files $uri /index.html;
	  }

}
```

2.  访问`http://ip:port`、`http://ip:port/son1`、`http://ip:port/son2`
3.  这里是我部署的[效果](http://139.196.89.228:7000)

## 自己实现路由加载功能

1. `single-spa-config.js` 不再引入打包的 single-spa, 而引入自己写的 `my-single-spa.js`， 依然可以正常运行
2. 只实现了自己认为是最关键的主流程，保证能基本运行

## 实现 qiankun 的全局通信

1. 在分支 `feature-message` 上，可以实现任何一个应用（父/子）可以改变全局 state、并监听到 state 的改变
   1. 父应用点击文本‘hello’，改变 state， 子应用监听到 state 改变并进行操作
   2. 子应用加载完成就会改变 state，父应用也可监听到
2. 只实现了自己认为是最关键的主流程，保证能基本运行，比如还可以做（监听事件和应用挂钩，在子应用 unmount 的时候把相关的监听事件去掉）

## 参考

1. [可能是你见过最完善的微前端解决方案](https://zhuanlan.zhihu.com/p/78362028)
2. [【微前端】single-spa 到底是个什么鬼](https://zhuanlan.zhihu.com/p/378346507)
