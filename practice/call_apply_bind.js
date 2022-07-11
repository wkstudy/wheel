Function.prototype.myCall = function (...rest) {
  // 关键点其实就是要知道这里的this就是调用的函数
  const fn = this;
  const obj = rest[0];
  obj.fn = fn;
  obj.fn(...rest.slice(1));
  delete obj.fn;
};
Function.prototype.myApply = function (...rest) {
  const fn = this;
  const obj = rest[0];
  obj.fn = fn;
  obj.fn(...rest[1]);
  delete obj.fn;
};
Function.prototype.myBind = function (...rest) {
  const fn = this;
  const obj = rest[0];
  obj.fn = fn;
  return function (...other) {
    obj.fn(...rest.slice(1).concat(other));
  };
};
// 思路就是通过  a.fn()的形式把this绑定为a，但之前一直没想清楚fn怎么获取，看了下别人思路才明白this就是fn
function hello(age, hobby) {
  console.log(`${this.name} - ${age} -${hobby}`);
}
hello();
var p = {
  name: "wh",
};

hello.call(p, 12, "ball");
hello.myCall(p, 12, "ball");
hello.myApply(p, [12, "ball"]);
const b = hello.bind(p, "12");
b("ball");
