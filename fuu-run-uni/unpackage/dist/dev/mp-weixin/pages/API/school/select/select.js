"use strict";
const common_vendor = require("../../../../common/vendor.js");
const request_apis_school = require("../../../../request/apis/school.js");
const request_apis_amap = require("../../../../request/apis/amap.js");
const _sfc_main = {
  data() {
    return {
      title: "Hello",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        name: void 0
      },
      // 总条数
      total: 0,
      rows: [],
      hasMore: true,
      back: false,
      locatedCity: null
    };
  },
  onLoad(options) {
    this.back = options && options.back == "1";
    this.locatedCity = common_vendor.index.getStorageSync("locatedCity") || null;
    this.getList();
  },
  onReachBottom() {
    common_vendor.index.__f__("log", "at pages/API/school/select/select.vue:76", "214");
    if (this.hasMore) {
      this.getList();
    }
  },
  methods: {
    async selectSchool(e) {
      const city = this.buildCity(e, true);
      const school = this.buildSchool(city);
      request_apis_amap.getWeatherByAdcode(city.adcode).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/school/select/select.vue:86", res);
        this.$store.commit("setWeather", res.data);
      });
      common_vendor.index.setStorageSync("currentCity", city);
      this.$store.commit("setCity", city);
      common_vendor.index.setStorageSync("currentSchool", school);
      this.$store.commit("setSchool", school);
      this.goAfterSelect();
    },
    selectLocatedCity() {
      if (!this.locatedCity || !this.locatedCity.opened) {
        common_vendor.index.showToast({
          title: "当前城市暂未开通",
          icon: "none"
        });
        return;
      }
      const city = this.buildCity(this.locatedCity, false);
      const school = this.buildSchool(city);
      common_vendor.index.setStorageSync("currentCity", city);
      this.$store.commit("setCity", city);
      common_vendor.index.setStorageSync("currentSchool", school);
      this.$store.commit("setSchool", school);
      this.goAfterSelect();
    },
    buildCity(e, manualSelected) {
      return {
        id: e.id,
        name: e.name || e.cityName,
        cityName: e.cityName || e.name,
        cityCode: e.cityCode,
        adcode: e.adcode,
        centerLng: e.centerLng,
        centerLat: e.centerLat,
        defaultLegacySchoolId: e.defaultLegacySchoolId || null,
        manualSelected,
        opened: e.opened !== false
      };
    },
    buildSchool(city) {
      return {
        id: city.defaultLegacySchoolId || city.id,
        name: city.name,
        adcode: city.adcode,
        legacySchoolId: city.defaultLegacySchoolId || city.id || null
      };
    },
    goAfterSelect() {
      if (this.back) {
        common_vendor.index.navigateBack();
        return;
      }
      common_vendor.index.reLaunch({
        url: "/pages/tabBar/index/index"
      });
    },
    searchName() {
      common_vendor.index.__f__("log", "at pages/API/school/select/select.vue:143", 111);
      this.resizePage();
      this.getList();
    },
    resizePage() {
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = 20;
      this.rows = [];
      this.total = 0;
      this.hasMore = true;
    },
    naviBack() {
      common_vendor.index.navigateBack();
    },
    getList() {
      request_apis_school.listOpenedCity().then((res) => {
        common_vendor.index.__f__("log", "at pages/API/school/select/select.vue:159", res);
        const keyword = this.queryParams.name;
        const rows = res.data || [];
        const filteredRows = keyword ? rows.filter((item) => {
          const name = item.cityName || item.name || "";
          return name.indexOf(keyword) >= 0;
        }) : rows;
        this.total = filteredRows.length;
        this.rows = filteredRows.map((item) => ({
          ...item,
          name: item.cityName || item.name,
          logo: item.logo || "/static/logo.png"
        }));
        this.queryParams.pageNum += 1;
        this.hasMore = false;
      });
    }
  }
};
if (!Array) {
  const _easycom_nut_icon2 = common_vendor.resolveComponent("nut-icon");
  const _easycom_nut_navbar2 = common_vendor.resolveComponent("nut-navbar");
  const _easycom_nut_searchbar2 = common_vendor.resolveComponent("nut-searchbar");
  const _component_template = common_vendor.resolveComponent("template");
  const _easycom_nut_cell2 = common_vendor.resolveComponent("nut-cell");
  const _easycom_nut_empty2 = common_vendor.resolveComponent("nut-empty");
  const _easycom_nut_divider2 = common_vendor.resolveComponent("nut-divider");
  const _easycom_nut_safe_area2 = common_vendor.resolveComponent("nut-safe-area");
  (_easycom_nut_icon2 + _easycom_nut_navbar2 + _easycom_nut_searchbar2 + _component_template + _easycom_nut_cell2 + _easycom_nut_empty2 + _easycom_nut_divider2 + _easycom_nut_safe_area2)();
}
const _easycom_nut_icon = () => "../../../../node-modules/nutui-uniapp/components/icon/icon.js";
const _easycom_nut_navbar = () => "../../../../node-modules/nutui-uniapp/components/navbar/navbar.js";
const _easycom_nut_searchbar = () => "../../../../node-modules/nutui-uniapp/components/searchbar/searchbar.js";
const _easycom_nut_cell = () => "../../../../node-modules/nutui-uniapp/components/cell/cell.js";
const _easycom_nut_empty = () => "../../../../node-modules/nutui-uniapp/components/empty/empty.js";
const _easycom_nut_divider = () => "../../../../node-modules/nutui-uniapp/components/divider/divider.js";
const _easycom_nut_safe_area = () => "../../../../node-modules/nutui-uniapp/components/safearea/safearea.js";
if (!Math) {
  (_easycom_nut_icon + _easycom_nut_navbar + _easycom_nut_searchbar + _easycom_nut_cell + _easycom_nut_empty + _easycom_nut_divider + _easycom_nut_safe_area)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.naviBack, "40"),
    b: common_vendor.p({
      name: "left"
    }),
    c: common_vendor.p({
      title: "城市选择",
      fixed: "true",
      placeholder: "true"
    }),
    d: common_vendor.p({
      name: "search2"
    }),
    e: common_vendor.o($options.searchName, "c0"),
    f: common_vendor.o(($event) => $data.queryParams.name = $event, "95"),
    g: common_vendor.p({
      modelValue: $data.queryParams.name
    }),
    h: $data.locatedCity && $data.locatedCity.name
  }, $data.locatedCity && $data.locatedCity.name ? {
    i: common_vendor.p({
      name: "location2"
    }),
    j: common_vendor.o($options.selectLocatedCity, "4c"),
    k: common_vendor.p({
      title: "当前定位：" + $data.locatedCity.name,
      desc: $data.locatedCity.opened ? "点击切换到定位城市" : "当前城市暂未开通服务"
    })
  } : {}, {
    l: common_vendor.f($data.rows, (item, index, i0) => {
      return {
        a: item.logo,
        b: common_vendor.o(($event) => $options.selectSchool(item), index),
        c: index,
        d: "e221673a-6-" + i0,
        e: common_vendor.p({
          title: item.name
        })
      };
    }),
    m: common_vendor.p({
      description: "暂无数据"
    }),
    n: $data.total == 0,
    o: common_vendor.p({
      dashed: true
    }),
    p: !$data.hasMore && $data.total != 0,
    q: common_vendor.p({
      position: "bottom"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/API/school/select/select.js.map
