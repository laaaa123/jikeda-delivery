"use strict";
const common_vendor = require("../../../common/vendor.js");
const request_websocket = require("../../../request/websocket.js");
const request_apis_order = require("../../../request/apis/order.js");
common_vendor.dayjs.extend(common_vendor.relativeTime);
common_vendor.dayjs.locale("zh-cn");
const _sfc_main = {
  data() {
    return {
      skeletonLoading: true,
      userInfo: {},
      //键盘高度
      keyboardHeight: 0,
      //底部消息发送高度
      bottomHeight: 0,
      //滚动距离
      scrollTop: 0,
      userId: "",
      //发送的消息
      chatText: "",
      chatInitData: {},
      msgData: {
        "orderId": "",
        "isBroadcast": 1,
        "recipientIds": [],
        "msgType": 1,
        "message": "",
        "senderId": "",
        "senderType": "",
        "createTime": "1999-02-02 12:12:12"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20
      },
      // 总条数
      total: 0,
      rows: [],
      hasMore: true
    };
  },
  updated() {
  },
  computed: {
    windowHeight() {
      return this.rpxTopx(common_vendor.index.getSystemInfoSync().windowHeight);
    },
    // 键盘弹起来的高度+发送框高度
    inputHeight() {
      return this.bottomHeight + this.keyboardHeight;
    }
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/API/chat/chat.vue:167", "chat onLoad");
    this.skeletonLoading = true;
    const checkOperationStatus = setInterval(() => {
      if (this.$store.state.appLaunch) {
        this.initData(options.orderId);
        this.pageQuery();
        request_websocket.ws.init();
        common_vendor.index.onKeyboardHeightChange((res) => {
          this.keyboardHeight = this.rpxTopx(res.height);
          if (this.keyboardHeight < 0)
            this.keyboardHeight = 0;
        });
        this.scrollToBottom();
        clearInterval(checkOperationStatus);
        common_vendor.index.__f__("log", "at pages/API/chat/chat.vue:183", "首页的js文件中的代码执行");
      }
    }, 100);
  },
  onReady() {
    common_vendor.index.$on("ws-message", (message) => {
      common_vendor.index.__f__("log", "at pages/API/chat/chat.vue:190", "收到 WebSocket 消息:", message);
      this.rows.push(message);
      this.scrollToBottom();
    });
  },
  onHide() {
    request_websocket.ws.completeClose();
  },
  onUnload() {
    request_websocket.ws.completeClose();
  },
  methods: {
    handleScroll(e) {
      if (e.target.scrollTop === 0 && this.hasMore) {
        this.pageQuery();
      }
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    // 发送消息
    handleSend() {
      if (!/^\s*$/.test(this.chatText.message)) {
        this.msgData.message = this.chatText;
        this.msgData.createTime = common_vendor.dayjs().format("YYYY-MM-DD HH:mm:ss");
        request_websocket.ws.send(JSON.stringify(this.msgData));
        this.rows.push(JSON.parse(JSON.stringify(this.msgData)));
        this.chatText = "";
        this.scrollToBottom();
      } else {
        this.$modal.showToast("不能发送空白消息");
      }
    },
    initData(orderId) {
      this.msgData.orderId = orderId;
      this.userInfo = this.$store.state.userInfo;
      this.msgData.senderType = this.userInfo.userType;
      this.msgData.senderId = this.userInfo.uid;
      request_apis_order.getInitChat(orderId).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/chat/chat.vue:236", res);
        this.chatInitData = res.data;
        this.msgData.recipientIds.push(res.data.adminId);
        this.msgData.recipientIds.push(res.data.agentId);
        if (this.userInfo.uid == res.data.userId) {
          this.msgData.recipientIds.push(res.data.runnerId);
        }
        if (this.userInfo.uid == res.data.runnerId) {
          this.msgData.recipientIds.push(res.data.userId);
        }
      });
    },
    pageQuery() {
      request_apis_order.getPageOrderChat(this.msgData.orderId, this.queryParams).then((res) => {
        common_vendor.index.__f__("log", "at pages/API/chat/chat.vue:251", res);
        this.total = res.total;
        let data = res.rows;
        data.reverse();
        this.rows.unshift(...data);
        this.queryParams.pageNum += 1;
        this.hasMore = data.length > 0;
        this.skeletonLoading = false;
      });
    },
    focus() {
      this.scrollToBottom();
    },
    blur() {
      this.scrollToBottom();
    },
    // px转换成rpx
    rpxTopx(px) {
      let deviceWidth = common_vendor.index.getSystemInfoSync().windowWidth;
      let rpx = 750 / deviceWidth * Number(px);
      return Math.floor(rpx);
    },
    // 监视聊天发送栏高度
    sendHeight() {
      setTimeout(() => {
        let query = common_vendor.index.createSelectorQuery();
        query.select(".send-msg").boundingClientRect();
        query.exec((res) => {
          this.bottomHeight = this.rpxTopx(res[0].height);
        });
      }, 10);
    },
    // 滚动至聊天底部
    scrollToBottom(e) {
      setTimeout(() => {
        let query = common_vendor.index.createSelectorQuery().in(this);
        query.select("#scrollview").boundingClientRect();
        query.select("#msglistview").boundingClientRect();
        query.exec((res) => {
          if (res[1].height > res[0].height) {
            this.scrollTop = this.rpxTopx(res[1].height - res[0].height);
          }
        });
      }, 15);
    }
  }
};
if (!Array) {
  const _easycom_nut_icon2 = common_vendor.resolveComponent("nut-icon");
  const _easycom_nut_skeleton2 = common_vendor.resolveComponent("nut-skeleton");
  const _easycom_nut_tag2 = common_vendor.resolveComponent("nut-tag");
  (_easycom_nut_icon2 + _easycom_nut_skeleton2 + _easycom_nut_tag2)();
}
const _easycom_nut_icon = () => "../../../node-modules/nutui-uniapp/components/icon/icon.js";
const _easycom_nut_skeleton = () => "../../../node-modules/nutui-uniapp/components/skeleton/skeleton.js";
const _easycom_nut_tag = () => "../../../node-modules/nutui-uniapp/components/tag/tag.js";
if (!Math) {
  (_easycom_nut_icon + _easycom_nut_skeleton + _easycom_nut_tag)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.goBack(), "3e"),
    b: common_vendor.p({
      name: "rect-left"
    }),
    c: common_vendor.p({
      width: "240px",
      height: "15px",
      title: true,
      animated: true,
      avatar: true,
      avatarSize: "60px",
      row: "3"
    }),
    d: common_vendor.p({
      width: "240px",
      height: "15px",
      title: true,
      animated: true,
      avatar: true,
      avatarSize: "60px",
      row: "3"
    }),
    e: common_vendor.p({
      width: "240px",
      height: "15px",
      title: true,
      animated: true,
      avatar: true,
      avatarSize: "60px",
      row: "3"
    }),
    f: common_vendor.p({
      width: "240px",
      height: "15px",
      title: true,
      animated: true,
      avatar: true,
      avatarSize: "60px",
      row: "3"
    }),
    g: common_vendor.p({
      width: "240px",
      height: "15px",
      title: true,
      animated: true,
      avatar: true,
      avatarSize: "60px",
      row: "3"
    }),
    h: common_vendor.p({
      width: "240px",
      height: "15px",
      title: true,
      animated: true,
      avatar: true,
      avatarSize: "60px",
      row: "3"
    }),
    i: $data.skeletonLoading,
    j: common_vendor.f($data.rows, (item, index, i0) => {
      return common_vendor.e({
        a: item.senderId == $data.userInfo.uid
      }, item.senderId == $data.userInfo.uid ? common_vendor.e({
        b: $data.userInfo.userType == 0
      }, $data.userInfo.userType == 0 ? {
        c: "8be9377f-7-" + i0,
        d: common_vendor.p({
          ["custom-color"]: "#ff0000",
          type: "primary"
        })
      } : {}, {
        e: $data.userInfo.userType == 1
      }, $data.userInfo.userType == 1 ? {
        f: "8be9377f-8-" + i0,
        g: common_vendor.p({
          ["custom-color"]: "#aa55ff",
          type: "primary"
        })
      } : {}, {
        h: $data.chatInitData.userId == $data.userInfo.uid
      }, $data.chatInitData.userId == $data.userInfo.uid ? {
        i: "8be9377f-9-" + i0,
        j: common_vendor.p({
          ["custom-color"]: "#cccccc",
          type: "primary"
        })
      } : {}, {
        k: $data.chatInitData.runnerId == $data.userInfo.uid
      }, $data.chatInitData.runnerId == $data.userInfo.uid ? {
        l: "8be9377f-10-" + i0,
        m: common_vendor.p({
          ["custom-color"]: "#cccccc",
          type: "primary"
        })
      } : {}, {
        n: $data.userInfo.userType == 5
      }, $data.userInfo.userType == 5 ? {
        o: "8be9377f-11-" + i0,
        p: common_vendor.p({
          type: "primary"
        })
      } : {}, {
        q: common_vendor.t($data.userInfo.userWx.nickname),
        r: common_vendor.t(item.message),
        s: common_vendor.t(item.createTime),
        t: $data.userInfo.userWx.avatar
      }) : {}, {
        v: item.senderId != $data.userInfo.uid
      }, item.senderId != $data.userInfo.uid ? common_vendor.e({
        w: item.senderType == 0
      }, item.senderType == 0 ? {
        x: $data.chatInitData.adminAvatar
      } : {}, {
        y: item.senderType == 1
      }, item.senderType == 1 ? {
        z: $data.chatInitData.agentAvatar
      } : {}, {
        A: item.senderId == $data.chatInitData.userId
      }, item.senderId == $data.chatInitData.userId ? {
        B: $data.chatInitData.userAvatar
      } : {}, {
        C: item.senderId == $data.chatInitData.runnerId
      }, item.senderId == $data.chatInitData.runnerId ? {
        D: $data.chatInitData.runnerAvatar
      } : {}, {
        E: item.senderType == 0
      }, item.senderType == 0 ? {
        F: "8be9377f-12-" + i0,
        G: common_vendor.p({
          ["custom-color"]: "#ff0000",
          type: "primary"
        })
      } : {}, {
        H: item.senderType == 1
      }, item.senderType == 1 ? {
        I: "8be9377f-13-" + i0,
        J: common_vendor.p({
          ["custom-color"]: "#aa55ff",
          type: "primary"
        })
      } : {}, {
        K: item.senderId == $data.chatInitData.userId
      }, item.senderId == $data.chatInitData.userId ? {
        L: "8be9377f-14-" + i0,
        M: common_vendor.p({
          ["custom-color"]: "#cccccc",
          type: "primary"
        })
      } : {}, {
        N: item.senderId == $data.chatInitData.runnerId
      }, item.senderId == $data.chatInitData.runnerId ? {
        O: "8be9377f-15-" + i0,
        P: common_vendor.p({
          ["custom-color"]: "#0055ff",
          type: "primary"
        })
      } : {}, {
        Q: item.senderType == 0
      }, item.senderType == 0 ? {
        R: common_vendor.t($data.chatInitData.adminName)
      } : {}, {
        S: item.senderType == 1
      }, item.senderType == 1 ? {
        T: common_vendor.t($data.chatInitData.agentName)
      } : {}, {
        U: item.senderId == $data.chatInitData.userId
      }, item.senderId == $data.chatInitData.userId ? {
        V: common_vendor.t($data.chatInitData.userName)
      } : {}, {
        W: item.senderId == $data.chatInitData.runnerId
      }, item.senderId == $data.chatInitData.runnerId ? {
        X: common_vendor.t($data.chatInitData.runnerName)
      } : {}, {
        Y: common_vendor.t(item.message),
        Z: common_vendor.t(item.createTime)
      }) : {}, {
        aa: index
      });
    }),
    k: !$data.skeletonLoading,
    l: `${$options.windowHeight - $options.inputHeight - 180}rpx`,
    m: $data.scrollTop,
    n: common_vendor.o((...args) => $options.handleScroll && $options.handleScroll(...args), "77"),
    o: common_vendor.o((...args) => $options.handleSend && $options.handleSend(...args), "e8"),
    p: common_vendor.o((...args) => $options.sendHeight && $options.sendHeight(...args), "61"),
    q: common_vendor.o((...args) => $options.focus && $options.focus(...args), "7e"),
    r: common_vendor.o((...args) => $options.blur && $options.blur(...args), "85"),
    s: $data.chatText,
    t: common_vendor.o(($event) => $data.chatText = $event.detail.value, "91"),
    v: $data.skeletonLoading,
    w: common_vendor.o((...args) => $options.handleSend && $options.handleSend(...args), "be"),
    x: `${$data.keyboardHeight - 60}rpx`,
    y: `${$options.inputHeight}rpx`
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8be9377f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/API/chat/chat.js.map
