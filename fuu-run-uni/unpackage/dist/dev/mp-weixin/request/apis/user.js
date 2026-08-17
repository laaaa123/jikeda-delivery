"use strict";
require("../../common/vendor.js");
const request_request = require("../request.js");
const putUpdateProfile = (params) => {
  return request_request.request({
    url: "/system/profile",
    method: "put",
    data: params
  });
};
const getBindPhone = (params) => {
  return request_request.request({
    url: "/system/profile/bindPhone",
    method: "get",
    params
  });
};
const getCanReqPhone = (params) => {
  return request_request.request({
    url: "/system/profile/canReqPhone",
    method: "get",
    data: params
  });
};
exports.getBindPhone = getBindPhone;
exports.getCanReqPhone = getCanReqPhone;
exports.putUpdateProfile = putUpdateProfile;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/request/apis/user.js.map
