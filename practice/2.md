### 问题： then 里的 status 什么情况下是 pending，什么情况下是 fullfilled/rejected

答案： 如果在 then 之前执行了 resolve 函数/reject 函数，那么 status 就是 fullfilled/rejected，如果没走的话就是 pengding
翻译一下就是说是同步的 promise 是 fullfilled/rejected，异步的是 pending

同步（代码执行到 then 的时候 reslove 已经执行过了）
new Promise((resolve) => resolve(1)).then((res) => console.log(res));

异步 (代码执行到 then 的时候 resolve 还没开始执行)
new Promise((resolve) => setTimeout(resolve(1), 100)).then((res) => console.log(res));

### 其他

Pledge 是自己的最初版实现，（出了不支持链式回调外）和 Pledge2 的一个区别就是回调函数都是在 resolve/reject 里执行的

```
<!-- 这样是没问题的 -->
new Pledge((resolve) =>
setTimeout(function () {
resolve(1);
}, 1)
).then((res) => console.log(res));

<!-- 这里就报错了 原因是 在执行 resolve 的时候 resolve 还没有赋值（也就是回调函数还没注册上）就开始执行 this.resolveFn(res)了 -->
new Pledge((resolve) => resolve(1)).then((res) => console.log(res));
```

所以 Pledge 里自己的思路是有问题的
思路一（错误思路）（同步的 resolve 函数会报错）

1.  resolve 负责 状态变更 +执行回调函数
2.  then 负责注册回调函数

思路二（目前的思路）

3.  resolve 负责变更状态，其次是如果发现有回调函数，就帮 then 执行一下
4.  then 负责执行回调函数，执行不了的（异步任务）就存起来让 resolve 帮着执行
