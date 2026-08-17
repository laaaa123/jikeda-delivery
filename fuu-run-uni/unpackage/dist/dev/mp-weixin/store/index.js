"use strict";
const common_vendor = require("../common/vendor.js");
const store = common_vendor.createStore({
  state: {
    appLaunch: false,
    //appLaunch是否执行完毕
    userInfo: null,
    // 用户信息
    currSchool: null,
    //当前学校信息
    currentCity: null,
    locatedCity: null,
    currentLocation: null,
    config: null,
    //系统配置
    weather: null
    //天气
  },
  mutations: {
    setAppLaunch(state, bool) {
      state.appLaunch = bool;
      common_vendor.index.__f__("log", "at store/index.js:19", "设置appLaunch成功");
    },
    setSchool(state, school) {
      state.currSchool = school;
      common_vendor.index.__f__("log", "at store/index.js:23", "设置学校成功");
    },
    setCity(state, city) {
      state.currentCity = city;
      common_vendor.index.__f__("log", "at store/index.js:27", "设置城市成功");
    },
    setLocatedCity(state, city) {
      state.locatedCity = city;
      common_vendor.index.__f__("log", "at store/index.js:31", "设置定位城市成功");
    },
    setCurrentLocation(state, location) {
      state.currentLocation = location;
      common_vendor.index.__f__("log", "at store/index.js:35", "设置当前位置成功");
    },
    setConfig(state, config) {
      state.config = config;
      common_vendor.index.__f__("log", "at store/index.js:39", "设置配置成功");
    },
    setWeather(state, weather) {
      state.weather = weather;
      common_vendor.index.__f__("log", "at store/index.js:43", "设置天气成功");
    },
    // 登录
    login(state, user) {
      state.userInfo = user;
      common_vendor.index.__f__("log", "at store/index.js:49", "登陆成功");
    },
    // 退出登录
    logout(state) {
      state.userInfo = {};
      common_vendor.index.__f__("log", "at store/index.js:56", "退出登录");
    }
  },
  actions: {
    // 你可以在这里定义异步操作
  }
});
exports.store = store;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/index.js.map
