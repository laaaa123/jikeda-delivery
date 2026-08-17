"use strict";
const common_vendor = require("../../common/vendor.js");
const request_request = require("../request.js");
const getCancelBefore = (params) => {
  return request_request.request({
    url: "/order/order/cancelbefore/" + params,
    method: "get"
  });
};
const getDetailOrderUser = (params) => {
  return request_request.request({
    url: "/order/order/detail/" + params,
    method: "get"
  });
};
const getListOrderUser = (params) => {
  return request_request.request({
    url: "/order/order/list/user",
    method: "get",
    params: common_vendor.toRaw(params)
  });
};
const getNearbyOrderHall = (params) => {
  return request_request.request({
    url: "/runner/location/nearby-orders",
    method: "get",
    params: common_vendor.toRaw(params)
  });
};
const postSubmitOrder = (params) => {
  return request_request.request({
    url: "/order/order/add",
    method: "post",
    data: params
  });
};
const postCancelOrder = (params) => {
  return request_request.request({
    url: "/order/order/cancel",
    method: "post",
    data: params
  });
};
const getPayAgain = (params) => {
  return request_request.request({
    url: "/order/order/payAgain/" + params,
    method: "get"
  });
};
const getAccept = (params) => {
  return request_request.request({
    url: "/order/order/accept/" + params,
    method: "get"
  });
};
const getBeginDelivery = (params) => {
  return request_request.request({
    url: "/order/order/delivery/" + params,
    method: "get"
  });
};
const postCompleteOrder = (params) => {
  return request_request.request({
    url: "/order/order/complete",
    method: "post",
    data: params
  });
};
const postUpdateImages = (params) => {
  return request_request.request({
    url: "/order/order/updateImages",
    method: "post",
    data: params
  });
};
const getConfirmOrder = (params) => {
  return request_request.request({
    url: "/order/order/confirm/" + params,
    method: "get"
  });
};
const getPhoneOrder = (params) => {
  return request_request.request({
    url: "/order/order/phone/" + params,
    method: "get"
  });
};
const getAppealOrder = (params) => {
  return request_request.request({
    url: "/order/appeal/" + params,
    method: "get"
  });
};
const postAppealOrder = (params) => {
  return request_request.request({
    url: "/order/appeal",
    method: "post",
    data: params
  });
};
const getInitChat = (params) => {
  return request_request.request({
    url: "/order/chat/initchat/" + params,
    method: "get"
  });
};
const getPageOrderChat = (orderId, params) => {
  return request_request.request({
    url: "/order/chat/list/" + orderId,
    method: "get",
    params: common_vendor.toRaw(params)
  });
};
const postRouteEstimate = (params) => {
  return request_request.request({
    url: "/address/route/estimate",
    method: "post",
    data: params
  });
};
const postPricingEstimate = (params) => {
  return request_request.request({
    url: "/order/pricing/estimate",
    method: "post",
    data: params
  });
};
const getNearbyRiderCount = (params) => {
  return request_request.request({
    url: "/runner/location/nearby-count",
    method: "get",
    params: common_vendor.toRaw(params)
  });
};
exports.getAccept = getAccept;
exports.getAppealOrder = getAppealOrder;
exports.getBeginDelivery = getBeginDelivery;
exports.getCancelBefore = getCancelBefore;
exports.getConfirmOrder = getConfirmOrder;
exports.getDetailOrderUser = getDetailOrderUser;
exports.getInitChat = getInitChat;
exports.getListOrderUser = getListOrderUser;
exports.getNearbyOrderHall = getNearbyOrderHall;
exports.getNearbyRiderCount = getNearbyRiderCount;
exports.getPageOrderChat = getPageOrderChat;
exports.getPayAgain = getPayAgain;
exports.getPhoneOrder = getPhoneOrder;
exports.postAppealOrder = postAppealOrder;
exports.postCancelOrder = postCancelOrder;
exports.postCompleteOrder = postCompleteOrder;
exports.postPricingEstimate = postPricingEstimate;
exports.postRouteEstimate = postRouteEstimate;
exports.postSubmitOrder = postSubmitOrder;
exports.postUpdateImages = postUpdateImages;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/request/apis/order.js.map
