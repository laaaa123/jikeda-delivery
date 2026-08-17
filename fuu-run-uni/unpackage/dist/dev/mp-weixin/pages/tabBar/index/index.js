"use strict";
const common_vendor = require("../../../common/vendor.js");
const request_apis_amap = require("../../../request/apis/amap.js");
const request_apis_order = require("../../../request/apis/order.js");
const DEFAULT_CITY = {
  name: "哈尔滨市",
  cityName: "哈尔滨市",
  cityCode: "230100",
  adcode: "230100",
  centerLng: 126.642464,
  centerLat: 45.756967
};
const _sfc_main = {
  data() {
    return {
      weather: {
        weather: "",
        temperature: ""
      },
      currSchool: null,
      currentCity: DEFAULT_CITY,
      mapCenter: {
        lng: DEFAULT_CITY.centerLng,
        lat: DEFAULT_CITY.centerLat
      },
      currentLocation: null,
      pickupAddress: null,
      dropAddress: null,
      nearbyRiderCount: null,
      nearbyRiderLoading: false,
      selectedService: "qusong",
      serviceTabs: [
        { label: "帮取送", value: "qusong" },
        { label: "帮买", value: "bangmai" },
        { label: "万能跑腿", value: "wanneng" }
      ]
    };
  },
  computed: {
    currentCityName() {
      return this.currentCity.cityName || this.currentCity.name || "选择城市";
    },
    weatherText() {
      if (!this.weather || !this.weather.temperature) {
        return "";
      }
      return `${this.weather.weather || ""} ${this.weather.temperature}°`;
    },
    pickupTitle() {
      return this.pickupAddress && this.pickupAddress.title ? this.pickupAddress.title : "请选择取货地址";
    },
    pickupSubTitle() {
      return this.pickupAddress && this.pickupAddress.detail ? this.pickupAddress.detail : "选择后可查看附近骑手数量";
    },
    dropTitle() {
      return this.dropAddress && this.dropAddress.title ? this.dropAddress.title : "送到哪里";
    },
    dropSubTitle() {
      return this.dropAddress && this.dropAddress.detail ? this.dropAddress.detail : "请选择收货地址";
    },
    nearbyRiderText() {
      if (this.nearbyRiderLoading) {
        return "正在查询附近骑手";
      }
      if (!this.pickupAddress) {
        return "选择取货地址后查看附近骑手";
      }
      if (this.nearbyRiderCount === null) {
        return "附近骑手数量暂未获取";
      }
      if (this.nearbyRiderCount === 0) {
        return "附近骑手较少，接单可能变慢";
      }
      return `附近约${this.nearbyRiderCount}名骑手可接单`;
    },
    pickupEtaText() {
      if (!this.pickupAddress) {
        return "点击选择取货地址";
      }
      if (this.nearbyRiderCount === 0) {
        return "接单可能较慢";
      }
      if (this.nearbyRiderCount === null) {
        return "等待运力查询";
      }
      return "预计较快响应";
    },
    mapMarkers() {
      const markers = [];
      if (this.pickupAddress && this.pickupAddress.lat && (this.pickupAddress.lng || this.pickupAddress.lon)) {
        markers.push({
          id: 1,
          latitude: Number(this.pickupAddress.lat),
          longitude: Number(this.pickupAddress.lng || this.pickupAddress.lon),
          title: this.pickupAddress.title || "取货地址",
          iconPath: "/static/icons/start.png",
          width: 32,
          height: 32
        });
      }
      if (this.dropAddress && this.dropAddress.lat && (this.dropAddress.lng || this.dropAddress.lon)) {
        markers.push({
          id: 2,
          latitude: Number(this.dropAddress.lat),
          longitude: Number(this.dropAddress.lng || this.dropAddress.lon),
          title: this.dropAddress.title || "收货地址",
          iconPath: "/static/icons/end.png",
          width: 32,
          height: 32
        });
      }
      return markers;
    }
  },
  watch: {
    "$store.state.appLaunch": function(val) {
      if (val) {
        this.initHome();
      }
    }
  },
  mounted() {
    this.initHome();
  },
  onLoad() {
    const timer = setInterval(() => {
      if (this.$store.state.appLaunch) {
        this.initHome();
        clearInterval(timer);
      }
    }, 100);
  },
  onShow() {
    this.loadCityByStore();
  },
  methods: {
    initHome() {
      this.loadCityByStore();
      this.initWeather();
      if (!this.currentLocation) {
        this.locateCurrentPosition(true);
      }
    },
    loadCityByStore() {
      const city = common_vendor.toRaw(this.$store.state.currentCity || common_vendor.index.getStorageSync("currentCity") || DEFAULT_CITY);
      this.currentCity = {
        ...DEFAULT_CITY,
        ...city,
        name: city.name || city.cityName || DEFAULT_CITY.name,
        cityName: city.cityName || city.name || DEFAULT_CITY.cityName
      };
      this.currSchool = common_vendor.toRaw(this.$store.state.currSchool || common_vendor.index.getStorageSync("currentSchool") || null);
      if (!this.currentLocation && this.currentCity.centerLng && this.currentCity.centerLat) {
        this.mapCenter = {
          lng: Number(this.currentCity.centerLng),
          lat: Number(this.currentCity.centerLat)
        };
      }
    },
    initWeather() {
      const cached = this.$store.state.weather || null;
      if (cached) {
        this.weather = cached;
        return;
      }
      if (!this.currentCity || !this.currentCity.adcode) {
        return;
      }
      request_apis_amap.getWeatherByAdcode(this.currentCity.adcode).then((res) => {
        this.weather = res.data || {};
        this.$store.commit("setWeather", this.weather);
      }).catch(() => {
      });
    },
    locateCurrentPosition(silent = false) {
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (res) => {
          this.currentLocation = {
            lng: res.longitude,
            lat: res.latitude
          };
          this.mapCenter = {
            lng: res.longitude,
            lat: res.latitude
          };
          this.$store.commit("setCurrentLocation", this.currentLocation);
        },
        fail: () => {
          if (!silent) {
            common_vendor.index.showToast({
              title: "定位失败，请检查位置权限",
              icon: "none"
            });
          }
        }
      });
    },
    choosePickupAddress() {
      this.chooseMapAddress("pickup");
    },
    chooseDropAddress() {
      this.chooseMapAddress("drop");
    },
    chooseMapAddress(type) {
      common_vendor.index.chooseLocation({
        latitude: this.mapCenter.lat,
        longitude: this.mapCenter.lng,
        success: (res) => {
          const address = this.buildOrderAddress(res);
          if (type === "pickup") {
            this.pickupAddress = address;
            this.mapCenter = {
              lng: Number(address.lng),
              lat: Number(address.lat)
            };
            this.refreshNearbyRiderCount();
          } else {
            this.dropAddress = address;
          }
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "未选择地址",
            icon: "none"
          });
        }
      });
    },
    buildOrderAddress(location) {
      return {
        id: "",
        name: "",
        phone: "",
        title: location.name || "地图选点",
        detail: location.address || "",
        lat: location.latitude,
        lon: location.longitude,
        lng: location.longitude
      };
    },
    refreshNearbyRiderCount() {
      if (!this.pickupAddress || !this.pickupAddress.lat || !(this.pickupAddress.lng || this.pickupAddress.lon)) {
        this.nearbyRiderCount = null;
        return;
      }
      this.nearbyRiderLoading = true;
      request_apis_order.getNearbyRiderCount({
        lng: this.pickupAddress.lng || this.pickupAddress.lon,
        lat: this.pickupAddress.lat
      }).then((res) => {
        const data = res.data || {};
        this.nearbyRiderCount = Number(data.nearbyRiderCount || 0);
      }).catch(() => {
        this.nearbyRiderCount = null;
      }).finally(() => {
        this.nearbyRiderLoading = false;
      });
    },
    goNextOrder() {
      if (!this.pickupAddress) {
        common_vendor.index.showToast({
          title: "请先选择取货地址",
          icon: "none"
        });
        return;
      }
      const routeMap = {
        qusong: "/pages/API/order/qusong/qusong",
        bangmai: "/pages/API/order/bangmai/bangmai",
        wanneng: "/pages/API/order/wanneng/wanneng"
      };
      const params = [
        `startAddress=${encodeURIComponent(JSON.stringify(this.pickupAddress))}`
      ];
      if (this.dropAddress) {
        params.push(`endAddress=${encodeURIComponent(JSON.stringify(this.dropAddress))}`);
      }
      common_vendor.index.navigateTo({
        url: `${routeMap[this.selectedService]}?${params.join("&")}`
      });
    },
    goToSelectSchool() {
      common_vendor.index.navigateTo({
        url: "/pages/API/school/select/select"
      });
    }
  }
};
if (!Array) {
  const _easycom_nut_toast2 = common_vendor.resolveComponent("nut-toast");
  const _easycom_nut_notify2 = common_vendor.resolveComponent("nut-notify");
  (_easycom_nut_toast2 + _easycom_nut_notify2)();
}
const _easycom_nut_toast = () => "../../../node-modules/nutui-uniapp/components/toast/toast.js";
const _easycom_nut_notify = () => "../../../node-modules/nutui-uniapp/components/notify/notify.js";
if (!Math) {
  (_easycom_nut_toast + _easycom_nut_notify)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.mapCenter.lat,
    b: $data.mapCenter.lng,
    c: $options.mapMarkers,
    d: common_vendor.t($options.currentCityName),
    e: $options.weatherText
  }, $options.weatherText ? {
    f: common_vendor.t($options.weatherText)
  } : {}, {
    g: common_vendor.o((...args) => $options.goToSelectSchool && $options.goToSelectSchool(...args), "94"),
    h: common_vendor.o((...args) => $options.locateCurrentPosition && $options.locateCurrentPosition(...args), "61"),
    i: common_vendor.t($options.pickupEtaText),
    j: common_vendor.t($options.nearbyRiderText),
    k: common_vendor.o((...args) => $options.choosePickupAddress && $options.choosePickupAddress(...args), "6b"),
    l: common_vendor.f($data.serviceTabs, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.label),
        b: item.value,
        c: common_vendor.n($data.selectedService === item.value ? "active" : ""),
        d: common_vendor.o(($event) => $data.selectedService = item.value, item.value)
      };
    }),
    m: common_vendor.t($options.pickupTitle),
    n: common_vendor.t($options.pickupSubTitle),
    o: common_vendor.o((...args) => $options.choosePickupAddress && $options.choosePickupAddress(...args), "da"),
    p: common_vendor.t($options.dropTitle),
    q: common_vendor.t($options.dropSubTitle),
    r: common_vendor.o((...args) => $options.chooseDropAddress && $options.chooseDropAddress(...args), "95"),
    s: common_vendor.t($options.nearbyRiderText),
    t: common_vendor.t($options.pickupEtaText),
    v: common_vendor.n($data.nearbyRiderCount === 0 ? "warning" : ""),
    w: common_vendor.o((...args) => $options.goNextOrder && $options.goNextOrder(...args), "31")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/tabBar/index/index.js.map
