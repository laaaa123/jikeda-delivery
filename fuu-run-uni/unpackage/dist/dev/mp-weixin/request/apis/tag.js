"use strict";
const common_vendor = require("../../common/vendor.js");
const request_request = require("../request.js");
const getListTag = (params) => {
  return request_request.request({
    url: "/order/tag/list/user",
    method: "get",
    params: common_vendor.toRaw(params)
  });
};
exports.getListTag = getListTag;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/request/apis/tag.js.map
