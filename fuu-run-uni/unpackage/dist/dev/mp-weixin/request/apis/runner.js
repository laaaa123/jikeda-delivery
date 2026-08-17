"use strict";
require("../../common/vendor.js");
const request_request = require("../request.js");
const runnerSubmit = (params) => {
  return request_request.request({
    url: "/system/runnerApply/submit",
    method: "post",
    data: params
  });
};
const getApplyProcess = () => {
  return request_request.request({
    url: "/system/runnerApply/process",
    method: "get"
  });
};
const reportRiderLocation = (params) => {
  return request_request.request({
    url: "/runner/location/report",
    method: "post",
    data: params
  });
};
exports.getApplyProcess = getApplyProcess;
exports.reportRiderLocation = reportRiderLocation;
exports.runnerSubmit = runnerSubmit;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/request/apis/runner.js.map
