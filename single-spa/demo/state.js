const state = {};
let prevState = {};
const cbs = []; // state改变后的监听函数
const operate = {
  setState: (obj) => {
    prevState = _.cloneDeep(state);
    let changed = false;
    Object.keys(obj).reduce((_state, key) => {
      if (_state.hasOwnProperty(key) && _state[key] !== obj[key]) {
        _state[key] = obj[key];
        changed = true;
      }
    }, state);
    changed && trigger();
  },
  onStateChange: (fn) => {
    cbs.push(fn);
  },
};

const trigger = () => {
  cbs.forEach((fn) => fn(state, prevState));
};
const initState = (obj) => {
  Object.keys(obj).forEach((key) => (state[key] = obj[key]));
  return operate;
};
export default {
  operate,
  initState,
};
