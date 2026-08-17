"use strict";
const common_vendor = require("../../common/vendor.js");
const request_request = require("../request.js");
const getWeatherByAdcode = (params) => {
  return request_request.request({
    url: "/amap/weather/" + params,
    method: "get"
  });
};
const regeoLocation = (params) => {
  return request_request.request({
    url: "/amap/regeo",
    method: "get",
    params: common_vendor.toRaw(params)
  });
};
exports.getWeatherByAdcode = getWeatherByAdcode;
exports.regeoLocation = regeoLocation;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/request/apis/amap.js.map
