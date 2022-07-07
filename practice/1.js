function createNew() {
  const fn = arguments[0];
  const obj = {};

  // 原型链继承
  obj.__proto__ = fn.prototype;
  // 绑定this
  const res = fn.apply(obj,[].slice.call(arguments, 1));
  if (res && typeof res === 'object') {
    return res
  }
  return obj;
}

function Person(name, age) {
  this.name =  name;
  this.age = age
}

var p = createNew(Person, 'w',20)
console.log(p);
