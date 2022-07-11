// 每隔time执行一次（hover的时候，每个time执行一次函数）
const throttle = function (fn, time = 300) {
  let old = Date.now();
  return function (...args) {
    let now = Date.now();
    if (now - old > time) {
      fn(...args);
      old = now;
    }
  };
};
// 只执行最后一次（不停的输入，当输入完成后在进行函数请求）
const debuounce = function (fn, time = 300) {
  let id;
  return function (...rest) {
    if (id) clearTimeout(id);
    id = setTimeout(function () {
      fn(...rest);
    }, time);
  };
};
// throttle 思路： 不到time就不执行，到了time就执行并且重新开始计时
// debounce 思路：直接清空id，再重新赋值
