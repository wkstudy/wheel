import globalData from "./state.js";
//  监听路由变化 正确加载子应用
const events = ["hashchange", "popstate"];
export function start() {
  main();
}
export function registerApplication(obj) {
  apps.push({
    ...obj,
    status: REGISTERED,
  });
}
const REGISTERED = "REGISTERED"; // 加载了的
const BOOTSTRAP = "BOOTSTRAP"; // bootstrapp执行成功了的
const MOUNTING = "MOUNTING"; // 正在挂载的
const UNMOUNT = "UNMOUNT"; // 卸载

let apps = [];

function getUrls() {
  let oldUrl, newUrl;
  console.log(arguments);
  if (arguments[0].length) {
    if (arguments[0].type === events[0]) {
      // hashchange
      oldUrl = arguments[0].oldUrl;
      newUrl = arguments[0].newUrl;
    } else {
      // todo  popstate
      //todo 每次hashchange的时候popstate也会触发，此时怎么只响应触发一次
      //暂不作处理
    }
  } else {
    // 初始化进来
    newUrl = location.href;
  }

  return {
    newUrl,
    oldUrl,
  };
}
function main() {
  const { oldUrl, newUrl } = getUrls(arguments);
  if (oldUrl === newUrl) return;
  const oldApps = apps.find((item) => oldUrl && oldUrl.indexOf(item.activeWhen) !== -1);
  const nweApps = apps.find((item) => newUrl.indexOf(item.activeWhen) !== -1);
  changeStatus(oldApps, UNMOUNT).then(() => changeStatus(nweApps, MOUNTING));
}
function changeStatus(obj, status) {
  if (!obj) return Promise.resolve();
  const command = {
    MOUNTING: mountingApp,
    UNMOUNT: unmountApp,
  };
  return command[status](obj);
}
function mountingApp(obj) {
  return obj.app
    .then((res) => {
      if ([REGISTERED, UNMOUNT].includes(obj.status)) {
        return res.bootstrap().then(() => {
          console.log(`${obj.name} just bootstrap`);
          obj.status = BOOTSTRAP;
          return res;
        });
      }
      return res;
    })
    .then((res) => {
      return res.mount({ operate: globalData.operate });
    })
    .then(() => {
      console.log(`${obj.name} just mounting`);
      obj.status = MOUNTING;
    });
}
function unmountApp(obj) {
  return obj.app
    .then((res) => res.unmount())
    .then(() => {
      obj.status = UNMOUNT;
      console.log(`${obj.name} just unmount`);
      return obj;
    });
}
// 绑定url change事件
events.forEach((item) => {
  window.addEventListener(item, main);
});
// todo  处理pushstate,replaceState
// window.history.pushState = () => {};
// window.history.replaceState = () => {};
