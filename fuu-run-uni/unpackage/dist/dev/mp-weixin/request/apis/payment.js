"use strict";
const common_vendor = require("../../common/vendor.js");
const request_request = require("../request.js");
const getListCapital = (params) => {
  return request_request.request({
    url: "/payment/capital/list",
    method: "get",
    params: common_vendor.toRaw(params)
  });
};
const getWallet = (params) => {
  return request_request.request({
    url: "/payment/wallet/curr",
    method: "get",
    params: common_vendor.toRaw(params)
  });
};
const postRecodeSubmit = (params) => {
  return request_request.request({
    url: "/payment/recode",
    method: "post",
    data: params
  });
};
const getRecodeLast = (params) => {
  return request_request.request({
    url: "/payment/recode/last",
    method: "get",
    params: common_vendor.toRaw(params)
  });
};
exports.getListCapital = getListCapital;
exports.getRecodeLast = getRecodeLast;
exports.getWallet = getWallet;
exports.postRecodeSubmit = postRecodeSubmit;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/request/apis/payment.js.map
