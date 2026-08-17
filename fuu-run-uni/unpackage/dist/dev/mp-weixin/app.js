"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const request_apis_login = require("./request/apis/login.js");
const request_apis_school = require("./request/apis/school.js");
const store_index = require("./store/index.js");
if (!Math) {
  "./pages/tabBar/index/index.js";
  "./pages/tabBar/order/order.js";
  "./pages/tabBar/my/my.js";
  "./pages/API/school/select/select.js";
  "./pages/API/order/qusong/qusong.js";
  "./pages/API/order/bangmai/bangmai.js";
  "./pages/API/order/wanneng/wanneng.js";
  "./pages/API/order/test/test.js";
  "./pages/API/user/profile/profile.js";
  "./pages/API/runner/introduce/introduce.js";
  "./pages/API/runner/apply/apply.js";
  "./pages/API/address/list/list.js";
  "./pages/API/address/add/add.js";
  "./pages/API/address/edit/edit.js";
  "./pages/API/order/list/list.js";
  "./pages/API/order/detail/detail.js";
  "./pages/API/order/runner/runner.js";
  "./pages/API/order/appeal/appeal.js";
  "./pages/API/chat/chat.js";
  "./pages/API/login/login.js";
  "./pages/API/runner/center/center.js";
  "./pages/API/runner/center/capitalflow/capitalflow.js";
  "./pages/API/runner/center/recode/recode.js";
  "./pages/API/user/setting/setting.js";
  "./pages/API/user/setting/agreement/agreement.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:13", "App Launch");
    request_apis_login.login.call(this);
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:18", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:21", "App Hide");
  },
  methods: {
    async checkSchool() {
      let school = common_vendor.index.getStorageSync("currentSchool");
      let city = common_vendor.index.getStorageSync("currentCity") || await this.getDefaultCity();
      common_vendor.index.setStorageSync("currentCity", city);
      this.$store.commit("setCity", city);
      if (school == null || school == void 0 || school == "") {
        common_vendor.index.navigateTo({
          url: "/pages/API/school/select/select"
        });
      } else {
        request_apis_school.getSchool(school.id).then((res) => {
          common_vendor.index.__f__("log", "at App.vue:36", res);
          const compatSchool = {
            ...res.data,
            legacySchoolId: school.legacySchoolId
          };
          this.$store.commit("setSchool", compatSchool);
          common_vendor.index.setStorageSync("currentSchool", compatSchool);
        });
      }
      this.$store.commit("setAppLaunch", true);
    },
    async getDefaultCity() {
      const fallback = {
        name: "哈尔滨市",
        cityName: "哈尔滨市",
        cityCode: "230100",
        adcode: "230100",
        centerLng: 126.642464,
        centerLat: 45.756967
      };
      try {
        const res = await request_apis_school.listOpenedCity();
        const city = res.data && res.data.length > 0 ? res.data[0] : null;
        if (!city) {
          return fallback;
        }
        return {
          id: city.id,
          name: city.cityName || city.name,
          cityName: city.cityName || city.name,
          cityCode: city.cityCode,
          adcode: city.adcode,
          centerLng: city.centerLng,
          centerLat: city.centerLat
        };
      } catch (e) {
        common_vendor.index.__f__("log", "at App.vue:74", e);
        return fallback;
      }
    },
    async login() {
      let isLogined = await request_apis_login.checkLogin();
      common_vendor.index.__f__("log", "at App.vue:80", isLogined);
      if (!isLogined.data) {
        common_vendor.index.showLoading({
          title: "登陆中...",
          duration: 2e3
        });
        let code = await this.getCode();
        let loginRes = await request_apis_login.xcxLogin({ "xcxCode": code });
        let token = loginRes.data.token;
        common_vendor.index.setStorageSync("token", token);
      }
      let info = await request_apis_login.getInfo();
      common_vendor.index.__f__("log", "at App.vue:92", info);
      this.$store.commit("login", info.data.user);
      this.$store.commit("setConfig", info.data.config);
      this.checkSchool();
    },
    async getCode() {
      const code = await getLoginCode();
      return code;
    }
  }
};
const getLoginCode = () => {
  return new Promise((resolve, reject) => {
    common_vendor.index.login({
      success: (res) => {
        if (res.code) {
          resolve(res.code);
        } else {
          reject("获取 code 失败");
        }
      },
      fail: (err) => {
        reject("登录失败: " + err.errMsg);
      }
    });
  });
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(store_index.store);
  return { app };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
