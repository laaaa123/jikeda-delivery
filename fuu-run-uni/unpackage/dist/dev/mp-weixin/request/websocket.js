"use strict";
const common_vendor = require("../common/vendor.js");
const request_request = require("./request.js");
let isOpenSocket = false;
let heartBeatDelay = 3e3;
let heartBeatInterval = null;
let reconnectInterval = null;
let socketTask = null;
let ws = {
  socketTask: null,
  init,
  completeClose,
  send
};
function init() {
  if (isOpenSocket && socketTask) {
    return socketTask;
  }
  socketTask = common_vendor.index.connectSocket({
    url: request_request.ws_url,
    header: {
      "Authorization": "Bearer " + common_vendor.index.getStorageSync("token")
    },
    complete: (res) => {
      common_vendor.index.__f__("log", "at request/websocket.js:40", "WebSocket连接成功", res);
    }
  });
  socketTask.onOpen((res) => {
    common_vendor.index.__f__("log", "at request/websocket.js:43", "WebSocket连接已打开", res);
    clearInterval(heartBeatInterval);
    clearInterval(reconnectInterval);
    isOpenSocket = true;
    heartBeat();
  });
  socketTask.onMessage((res) => {
    common_vendor.index.__f__("log", "at request/websocket.js:53", "收到服务器内容", JSON.parse(res.data));
    let result = JSON.parse(res.data);
    common_vendor.index.$emit("ws-message", result);
  });
  socketTask.onClose(() => {
    if (isOpenSocket) {
      common_vendor.index.__f__("log", "at request/websocket.js:79", "ws与服务器断开");
    } else {
      common_vendor.index.__f__("log", "at request/websocket.js:81", "连接失败");
    }
    isOpenSocket = false;
    socketTask = null;
  });
  ws.socketTask = socketTask;
}
function heartBeat() {
  heartBeatInterval = setInterval(() => {
  }, heartBeatDelay);
}
function send(value) {
  ws.socketTask.send({
    data: value,
    async success(res) {
      common_vendor.index.__f__("log", "at request/websocket.js:116", "消息发送成功", res);
    }
  });
}
function completeClose() {
  clearInterval(heartBeatInterval);
  clearInterval(reconnectInterval);
  if (ws.socketTask) {
    ws.socketTask.close();
  }
  isOpenSocket = false;
  socketTask = null;
}
exports.ws = ws;
//# sourceMappingURL=../../.sourcemap/mp-weixin/request/websocket.js.map
