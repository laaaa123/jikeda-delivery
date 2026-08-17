"use strict";
const common_vendor = require("../../common/vendor.js");
const request_request = require("../request.js");
const request_apis_amap = require("./amap.js");
const request_apis_school = require("./school.js");
const FALLBACK_CITY = {
  name: "哈尔滨市",
  cityName: "哈尔滨市",
  cityCode: "230100",
  adcode: "230100",
  centerLng: 126.642464,
  centerLat: 45.756967,
  manualSelected: false
};
const login = async function() {
  {
    common_vendor.index.showLoading({
      title: "登陆中...",
      duration: 2e3
    });
    let code = await getCode();
    let loginRes = await xcxLogin({ xcxCode: code });
    let token = loginRes.data.token;
    common_vendor.index.setStorageSync("token", token);
  }
  let info = await getInfo();
  common_vendor.index.__f__("log", "at request/apis/login.js:27", info);
  this.$store.commit("login", info.data.user);
  this.$store.commit("setConfig", info.data.config);
  await initCity.call(this);
  await checkSchool.call(this);
};
async function getCode() {
  const code = await getLoginCode();
  return code;
}
async function initCity() {
  const openedCities = await getOpenedCities();
  const locatedCity = await locateCity.call(this, openedCities);
  const storedCity = common_vendor.index.getStorageSync("currentCity");
  let currentCity = storedCity || (locatedCity && locatedCity.opened ? locatedCity : null) || openedCities[0] || FALLBACK_CITY;
  if (storedCity && !storedCity.manualSelected && locatedCity && locatedCity.opened) {
    currentCity = locatedCity;
  }
  if (storedCity && storedCity.manualSelected && locatedCity && locatedCity.opened && storedCity.adcode != locatedCity.adcode) {
    const shouldSwitch = await confirmUseLocatedCity(storedCity, locatedCity);
    if (shouldSwitch) {
      currentCity = locatedCity;
    }
  }
  currentCity = normalizeCity(currentCity, currentCity.manualSelected === true);
  common_vendor.index.setStorageSync("currentCity", currentCity);
  this.$store.commit("setCity", currentCity);
}
async function getOpenedCities() {
  try {
    const res = await request_apis_school.listOpenedCity();
    return (res.data || []).map((item) => normalizeCity(item, false));
  } catch (e) {
    common_vendor.index.__f__("log", "at request/apis/login.js:65", e);
    return [FALLBACK_CITY];
  }
}
async function locateCity(openedCities) {
  try {
    const location = await getCurrentLocation();
    common_vendor.index.setStorageSync("currentLocation", location);
    this.$store.commit("setCurrentLocation", location);
    const regeo = await request_apis_amap.regeoLocation({
      lng: location.longitude,
      lat: location.latitude
    });
    const located = regeo.data || {};
    const openedCity = openedCities.find((item) => item.adcode == located.cityAdcode);
    const locatedCity = openedCity ? normalizeCity({
      ...openedCity,
      locatedAdcode: located.adcode,
      locatedDistrict: located.district,
      opened: true
    }, false) : {
      name: located.city,
      cityName: located.city,
      cityCode: located.cityAdcode,
      adcode: located.cityAdcode,
      locatedAdcode: located.adcode,
      locatedDistrict: located.district,
      opened: false
    };
    common_vendor.index.setStorageSync("locatedCity", locatedCity);
    this.$store.commit("setLocatedCity", locatedCity);
    return locatedCity;
  } catch (e) {
    common_vendor.index.__f__("log", "at request/apis/login.js:102", e);
    return null;
  }
}
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    common_vendor.index.getLocation({
      type: "gcj02",
      isHighAccuracy: true,
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail: reject
    });
  });
}
function confirmUseLocatedCity(currentCity, locatedCity) {
  return new Promise((resolve) => {
    common_vendor.index.showModal({
      title: "定位城市",
      content: `当前定位到${locatedCity.name}，是否切换？`,
      confirmText: "切换",
      cancelText: "保留",
      success: (res) => {
        resolve(res.confirm === true);
      },
      fail: () => {
        resolve(false);
      }
    });
  });
}
async function checkSchool() {
  let school = common_vendor.index.getStorageSync("currentSchool");
  const city = common_vendor.index.getStorageSync("currentCity");
  if (school == null || school == void 0 || school == "") {
    school = buildCompatSchool(city);
    if (school && school.id) {
      this.$store.commit("setSchool", school);
      common_vendor.index.setStorageSync("currentSchool", school);
      this.$store.commit("setAppLaunch", true);
      return;
    }
    this.$store.commit("setAppLaunch", true);
    common_vendor.index.navigateTo({
      url: "/pages/API/school/select/select"
    });
    return;
  }
  if (!school.id) {
    this.$store.commit("setAppLaunch", true);
    return;
  }
  request_apis_school.getSchool(school.id).then(async (res) => {
    common_vendor.index.__f__("log", "at request/apis/login.js:164", res);
    const compatSchool = {
      ...res.data,
      legacySchoolId: school.legacySchoolId
    };
    this.$store.commit("setSchool", compatSchool);
    common_vendor.index.setStorageSync("currentSchool", compatSchool);
    this.$store.commit("setAppLaunch", true);
  });
}
function normalizeCity(city, manualSelected) {
  if (!city) {
    return FALLBACK_CITY;
  }
  return {
    ...city,
    id: city.id,
    name: city.name || city.cityName,
    cityName: city.cityName || city.name,
    cityCode: city.cityCode,
    adcode: city.adcode,
    centerLng: city.centerLng,
    centerLat: city.centerLat,
    defaultLegacySchoolId: city.defaultLegacySchoolId || null,
    opened: city.opened !== false,
    manualSelected
  };
}
function buildCompatSchool(city) {
  if (!city) {
    return null;
  }
  return {
    id: city.defaultLegacySchoolId || city.id,
    name: city.cityName || city.name,
    adcode: city.adcode,
    legacySchoolId: city.defaultLegacySchoolId || city.id || null
  };
}
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
const checkLogin = () => {
  return request_request.request({
    url: "/xcxCheckLogin",
    method: "get"
  });
};
const xcxLogin = (params) => {
  return request_request.request({
    url: "/xcxLogin",
    method: "post",
    data: params,
    header: { "Content-Type": "application/x-www-form-urlencoded" }
  });
};
const getInfo = () => {
  return request_request.request({
    url: "/getInfo",
    method: "get"
  });
};
const getAgreement = () => {
  return request_request.request({
    url: "/agreement",
    method: "get"
  });
};
exports.checkLogin = checkLogin;
exports.getAgreement = getAgreement;
exports.getInfo = getInfo;
exports.login = login;
exports.xcxLogin = xcxLogin;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/request/apis/login.js.map
