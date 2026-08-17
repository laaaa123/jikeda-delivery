"use strict";
const common_vendor = require("../common/vendor.js");
const utils_utils = require("../utils/utils.js");
const request_apis_login = require("./apis/login.js");
const domain = "localhost";
const base_url = "http://" + domain + ":8081";
const upload_url = base_url + "/system/oss/upload";
const ws_url = "ws://" + domain + ":4400/ws";
function request1(params) {
  let url = params.url;
  let method = params.method || "get";
  let data = params.data || {};
  let param = params.params;
  if (method === "get" && param) {
    url = url + "?" + utils_utils.tansParams(param);
  }
  let header = {
    "Content-Type": "application/json",
    ...params.header
  };
  if (common_vendor.index.getStorageSync("token")) {
    header["Authorization"] = "Bearer " + common_vendor.index.getStorageSync("token");
  }
  return new Promise((resolve, reject) => {
    if (params.showLoading == true) {
      common_vendor.index.showLoading({
        title: "加载中..."
      });
    }
    common_vendor.index.request({
      url: base_url + url,
      method,
      header,
      data,
      success(response) {
        common_vendor.index.__f__("log", "at request/request.js:112", response);
        const res = response.data;
        if (res.code == 200) {
          common_vendor.index.__f__("log", "at request/request.js:116", 222);
          resolve(res);
        } else {
          switch (res.code) {
            case 401:
              common_vendor.index.__f__("log", "at request/request.js:121", 666);
              request_apis_login.login.call(this);
              break;
            case 404:
              common_vendor.index.showToast({
                title: "请求地址不存在...",
                duration: 2e3
              });
              break;
            case 500:
              common_vendor.index.__f__("log", "at request/request.js:134", 111);
              reject(res.msg);
              break;
          }
        }
      },
      fail(err) {
        common_vendor.index.__f__("log", "at request/request.js:148", err);
        reject(err);
      },
      complete() {
      }
    });
  });
}
const request = request1;
exports.request = request;
exports.upload_url = upload_url;
exports.ws_url = ws_url;
//# sourceMappingURL=../../.sourcemap/mp-weixin/request/request.js.map
