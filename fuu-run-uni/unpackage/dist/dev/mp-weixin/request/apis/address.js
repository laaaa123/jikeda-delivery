"use strict";
const common_vendor = require("../../common/vendor.js");
const request_request = require("../request.js");
const postAddAddress = (params) => {
  return request_request.request({
    url: "/address/address/add",
    method: "post",
    data: params
  });
};
const getListAddress = (params) => {
  return request_request.request({
    url: "/address/address/list/curr",
    method: "get",
    params: common_vendor.toRaw(params)
  });
};
const delAddress = (params) => {
  return request_request.request({
    url: "/address/address/curr/" + params,
    method: "delete"
  });
};
const getAddressById = (params) => {
  return request_request.request({
    url: "/address/address/curr/" + params,
    method: "get"
  });
};
const putEditAddress = (params) => {
  return request_request.request({
    url: "/address/address/edit",
    method: "put",
    data: params
  });
};
exports.delAddress = delAddress;
exports.getAddressById = getAddressById;
exports.getListAddress = getListAddress;
exports.postAddAddress = postAddAddress;
exports.putEditAddress = putEditAddress;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/request/apis/address.js.map
