//  status  pending  fullfilled   rejected
// 看了下别人的思路，自己直接写有点难，没理解透promise

// 核心流程
//  1. 有个状态status， pendign  fullfilled rejected
//  2. 提供两个钩子 resolve, reject, 成功了用户调resolve, 失败了调reject
//  3. then里注册回调函数，在resolve/reject执行的时候执行回调

// 不考虑then的链式回调
class Pledge {
  constructor(fn) {
    this.status = "pending";
    this.value = undefined;
    this.resolveFn = null;
    this.rejectFn = null;

    let resolve = (res) => {
      this.status = "fullfilled";
      this.value = res;
      this.resolveFn(res);
    };
    let reject = (err) => {
      this.status = "rejected";
      this.value = err;
      this.rejectFn(err);
    };
    fn(resolve, reject);
  }

  then(fa, fb) {
    this.resolveFn = fa;
    this.rejectFn = fb;
  }
}

// then链式回调
class Pledge2 {
  constructor(fn) {
    this.status = "pending";
    this.value = undefined;
    this.resolveFn = []; // resolve 是异步执行的时候then里注册的回调函数会放在这里，同步的话回调函数直接执行，不会在这里
    this.rejectFn = []; // reject 是异步执行的时候then里注册的回调函数会放在这里，同步的话回调函数直接执行，不会在这里

    let resolve = (res) => {
      console.log("s1");
      this.status = "fullfilled";
      this.value = res;
      this.resolveFn.forEach((fn) => fn(res));
    };
    let reject = (err) => {
      this.status = "rejected";
      this.value = err;
      this.rejectFn.forEach((fn) => fn(err));
    };
    fn(resolve, reject);
  }

  then(fa, fb) {
    // then中如果是已经fullfilled 或者rejected了，那么就直接调用回调函数 fa fb
    let self = this;
    console.log("s2");
    if (self.status === "fullfilled") {
      console.log("s3");
      const v = fa(self.value);
      if (v instanceof Pledge2) {
        return v;
      } else {
        return new Pledge2((resolve) => {
          resolve(v);
        });
      }
    } else if (self.status === "rejected") {
      const v = fb(self.value);
      if (v instanceof Pledge2) {
        return v;
      } else {
        return new Pledge2((resolve, reject) => {
          reject(v);
        });
      }
    }
    // 如果是pending状态的话那么就得在resolve函数或者reject函数中执行 fa fb了，所以这里需要把fa fb注册到pledge里
    return new Pledge2(function (resolve, reject) {
      self.resolveFn.push(function (val) {
        const v = fa(val);
        if (v instanceof Pledge2) {
          return v;
        } else {
          return resolve(v);
        }
      });
      self.rejectFn.push(function (val) {
        const v = fb(val);
        if (v instanceof Pledge2) {
          return v;
        } else {
          return reject(v);
        }
      });
    });
  }
}
let t = new Pledge((resolve) =>
  setTimeout(function () {
    resolve(1);
  }, 1)
).then((res) => console.log(res, "222"));

new Pledge2((resolve, reject) => {
  // setTimeout(function () {
  //   resolve(2);
  // }, 100);
  resolve(2);
  console.log("s4");
})
  .then(
    (res) => {
      console.log(res, "res");
    },
    (rej) => {
      console.log(rej, "rej");
    }
  )
  .then(
    (res) => {
      console.log(res, "res");
    },
    (rej) => {
      console.log(rej, "rej");
    }
  );
