"use strict";
const tansParams = (params) => {
  let str = "";
  for (let key in params) {
    if (params[key] !== void 0 && params[key] !== null) {
      str += `${key}=${encodeURIComponent(params[key])}&`;
    }
  }
  return str.slice(0, -1);
};
exports.tansParams = tansParams;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/utils.js.map
