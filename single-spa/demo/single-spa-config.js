//main.js
// import * as singleSpa from "./single-spa.dev.js";
import * as singleSpa from "./my-single-spa.js";
import globalData from "./state.js";
const operate = globalData.initState({
  name: "li",
  age: 18,
});
// 点击hello 改变全局state
document.getElementsByTagName("main")[0].addEventListener("click", function () {
  operate.setState({ age: 22 });
});
operate.onStateChange((state, prev) => {
  console.log("主应用发现state改变了，来做点什么吧");
  console.log(state, "state");
  console.log(prev, "prev");
});

singleSpa.registerApplication({ name: "app1", app: import("./app1/app1.js"), activeWhen: "/son1" });
singleSpa.registerApplication({ name: "app2", app: import("./app2/app2.js"), activeWhen: "/son2" });
singleSpa.start();
