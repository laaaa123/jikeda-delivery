"use strict";
require("../../common/vendor.js");
const request_request = require("../request.js");
const getSchool = (id) => {
  return request_request.request({
    url: "/address/school/" + id,
    method: "get"
  });
};
const listOpenedCity = () => {
  return request_request.request({
    url: "/address/city/opened",
    method: "get"
  });
};
exports.getSchool = getSchool;
exports.listOpenedCity = listOpenedCity;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/request/apis/school.js.map
