//main.js
// import * as singleSpa from "./single-spa.dev.js";
import * as singleSpa from "./my-single-spa.js";

singleSpa.registerApplication({ name: "app1", app: import("./app1/app1.js"), activeWhen: "/son1" });
singleSpa.registerApplication({ name: "app2", app: import("./app2/app2.js"), activeWhen: "/son2" });
singleSpa.start();
