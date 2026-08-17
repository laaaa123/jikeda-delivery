"use strict";
const common_vendor = require("../../../../common/vendor.js");
if (!Math) {
  (NutButton + NutIcon + NutProgress)();
}
const NutButton = () => "../button/button.js";
const NutIcon = () => "../icon/icon.js";
const NutProgress = () => "../progress/progress.js";
const componentName = `${common_vendor.PREFIX}-uploader`;
const { translate } = common_vendor.useTranslate(componentName);
const __default__ = common_vendor.defineComponent({
  name: componentName,
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: "shared"
  }
});
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  ...__default__,
  props: common_vendor.uploaderProps,
  emits: common_vendor.uploaderEmits,
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    __expose({ submit, chooseImage, clearUploadQueue });
    const fileList = common_vendor.ref(props.fileList);
    const uploadQueue = common_vendor.ref([]);
    const disabled = common_vendor.useFormDisabled(common_vendor.toRef(props, "disabled"));
    common_vendor.watch(
      () => props.fileList,
      () => {
        fileList.value = props.fileList;
      }
    );
    function fileItemClick(fileItem) {
      emit("fileItemClick", { fileItem });
    }
    function executeUpload(fileItem, index) {
      const { type, url, formData } = fileItem;
      const uploadOption = {
        url: props.url ? props.url : "",
        filePath: url,
        name: props.name,
        fileType: type,
        header: props.headers,
        timeout: +(props == null ? void 0 : props.timeout),
        xhrState: +props.xhrState,
        formData,
        file: fileItem
      };
      uploadOption.onStart = (option) => {
        fileItem.status = "ready";
        fileItem.message = translate("readyUpload");
        clearUploadQueue(index);
        emit("start", option);
      };
      uploadOption.onProgress = (event, option) => {
        if (fileItem.status === "success" || fileItem.status === "error")
          return;
        fileItem.status = "uploading";
        fileItem.message = translate("uploading");
        fileItem.percentage = event == null ? void 0 : event.progress;
        emit("progress", { event, option, percentage: fileItem.percentage });
      };
      uploadOption.onSuccess = (data, option) => {
        fileItem.status = "success";
        fileItem.message = translate("success");
        emit("success", {
          data,
          responseText: data,
          option,
          fileItem
        });
        emit("update:fileList", fileList.value);
      };
      uploadOption.onFailure = (data, option) => {
        fileItem.status = "error";
        fileItem.message = translate("error");
        emit("failure", {
          data,
          responseText: data,
          option,
          fileItem
        });
      };
      const task = common_vendor.createUploader(uploadOption);
      if (props.beforeUpload) {
        props.beforeUpload(common_vendor.index.uploadFile, uploadOption);
      } else if (props.autoUpload) {
        task.upload();
      } else {
        uploadQueue.value.push(
          new Promise((resolve, reject) => {
            resolve(task);
          })
        );
      }
    }
    function clearUploadQueue(index = -1) {
      if (index > -1) {
        uploadQueue.value.splice(index, 1);
      } else {
        uploadQueue.value = [];
        fileList.value.splice(0, fileList.value.length);
      }
    }
    function submit() {
      Promise.all(uploadQueue.value).then((res) => {
        res.forEach((i) => i.upload());
      });
    }
    function readFile(files) {
      files.forEach((file, index) => {
        let fileType = file.type;
        const filepath = file.tempFilePath || file.path || file.url;
        const fileItem = common_vendor.reactive({});
        if (file.fileType) {
          fileType = file.fileType;
        } else {
          const imgReg = /\.(png|jpeg|jpg|webp|gif)$/i;
          if (!fileType && (imgReg.test(filepath) || filepath.includes("data:image")))
            fileType = "image";
        }
        fileItem.uid = (/* @__PURE__ */ new Date()).getTime().toString() + Math.random().toString(36).substring(2, 9);
        fileItem.path = filepath;
        fileItem.name = file.name || filepath;
        fileItem.status = "ready";
        fileItem.message = translate("waitingUpload");
        fileItem.type = fileType;
        fileItem.formData = props.data;
        if (props.isPreview)
          fileItem.url = fileType === "video" ? file.url : filepath;
        fileList.value.push(fileItem);
        executeUpload(fileItem, index);
      });
    }
    function filterFiles(files) {
      const maximum = props.maximum * 1;
      const maximize = props.maximize * 1;
      const oversizes = new Array();
      files = files.filter((file) => {
        if (file.size > maximize) {
          oversizes.push(file);
          return false;
        }
        return true;
      });
      if (oversizes.length)
        emit("oversize", oversizes);
      const currentFileLength = files.length + fileList.value.length;
      if (currentFileLength > maximum)
        files.splice(files.length - (currentFileLength - maximum));
      return files;
    }
    async function onDelete(file, index) {
      clearUploadQueue(index);
      if (props.beforeDelete == null || await props.beforeDelete(file, fileList)) {
        fileList.value.splice(index, 1);
        emit("delete", {
          file,
          fileList: fileList.value,
          index
        });
      }
    }
    function chooseImage(event) {
      if (disabled.value)
        return;
      const maximum = props.maximum * 1;
      common_vendor.chooseFile({
        accept: props.accept,
        multiple: props.multiple,
        capture: props.capture,
        maxDuration: +props.maxDuration,
        sizeType: props.sizeType,
        camera: props.camera,
        maxCount: maximum - fileList.value.length
      }, props, fileList.value).then((files) => {
        const filteredFiles = filterFiles(
          new Array().slice.call(files)
        );
        readFile(filteredFiles);
        emit("change", { fileList: fileList.value, event });
      });
    }
    const classes = common_vendor.computed(() => {
      return common_vendor.getMainClass(props, componentName);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.$slots.default
      }, _ctx.$slots.default ? common_vendor.e({
        b: Number(_ctx.maximum) - fileList.value.length
      }, Number(_ctx.maximum) - fileList.value.length ? {
        c: common_vendor.o(chooseImage, "09"),
        d: common_vendor.p({
          ["custom-class"]: "nut-uploader__input"
        })
      } : {}) : {}, {
        e: common_vendor.f(fileList.value, (item, index, i0) => {
          var _a, _b, _c, _d;
          return common_vendor.e(_ctx.listType === "picture" && !_ctx.$slots.default ? common_vendor.e({
            a: item.status !== "success"
          }, item.status !== "success" ? common_vendor.e({
            b: item.status !== "ready"
          }, item.status !== "ready" ? common_vendor.e({
            c: item.status === "error"
          }, item.status === "error" ? {
            d: "7081a6d2-1-" + i0,
            e: common_vendor.p({
              name: "failure",
              ["custom-color"]: "#fff"
            })
          } : {
            f: "7081a6d2-2-" + i0,
            g: common_vendor.p({
              name: "loading",
              ["custom-color"]: "#fff"
            })
          }) : {}, {
            h: common_vendor.t(item.message)
          }) : {}, {
            i: _ctx.isDeletable && !common_vendor.unref(disabled)
          }, _ctx.isDeletable && !common_vendor.unref(disabled) ? {
            j: "7081a6d2-3-" + i0,
            k: common_vendor.p({
              name: "failure"
            }),
            l: common_vendor.o(($event) => onDelete(item, index), item.uid)
          } : {}, {
            m: (((_a = item == null ? void 0 : item.type) == null ? void 0 : _a.includes("image")) || ((_b = item == null ? void 0 : item.type) == null ? void 0 : _b.includes("video"))) && item.url
          }, (((_c = item == null ? void 0 : item.type) == null ? void 0 : _c.includes("image")) || ((_d = item == null ? void 0 : item.type) == null ? void 0 : _d.includes("video"))) && item.url ? {
            n: _ctx.mode,
            o: item.url,
            p: common_vendor.o(($event) => fileItemClick(item), item.uid)
          } : {
            q: common_vendor.t(item.name),
            r: common_vendor.o(($event) => fileItemClick(item), item.uid)
          }, {
            s: common_vendor.t(item.name)
          }) : _ctx.listType === "list" ? common_vendor.e({
            t: "7081a6d2-4-" + i0,
            v: common_vendor.p({
              name: "link",
              ["custom-class"]: "nut-uploader__preview-img__file__link"
            }),
            w: common_vendor.t(item.name),
            x: _ctx.isDeletable && !common_vendor.unref(disabled)
          }, _ctx.isDeletable && !common_vendor.unref(disabled) ? {
            y: common_vendor.o(($event) => onDelete(item, index), item.uid),
            z: "7081a6d2-5-" + i0,
            A: common_vendor.p({
              name: "del",
              ["custom-color"]: "#808080",
              ["custom-class"]: "nut-uploader__preview-img__file__del"
            })
          } : {}, {
            B: common_vendor.n(item.status),
            C: common_vendor.o(($event) => fileItemClick(item), item.uid),
            D: item.status === "uploading"
          }, item.status === "uploading" ? {
            E: "7081a6d2-6-" + i0,
            F: common_vendor.p({
              size: "small",
              percentage: item.percentage,
              ["stroke-color"]: "linear-gradient(270deg, rgba(18,126,255,1) 0%,rgba(32,147,255,1) 32.815625%,rgba(13,242,204,1) 100%)",
              ["show-text"]: false
            })
          } : {}) : {}, {
            G: item.uid
          });
        }),
        f: _ctx.listType === "picture" && !_ctx.$slots.default,
        g: _ctx.listType === "list",
        h: common_vendor.n(_ctx.listType),
        i: _ctx.listType === "picture" && !_ctx.$slots.default && Number(_ctx.maximum) - fileList.value.length
      }, _ctx.listType === "picture" && !_ctx.$slots.default && Number(_ctx.maximum) - fileList.value.length ? {
        j: common_vendor.p({
          name: "photograph",
          ["custom-color"]: "#808080"
        }),
        k: common_vendor.unref(disabled) ? 1 : "",
        l: common_vendor.o(chooseImage, "f4"),
        m: common_vendor.p({
          ["custom-class"]: "nut-uploader__input"
        }),
        n: common_vendor.n(_ctx.listType)
      } : {}, {
        o: common_vendor.n(classes.value),
        p: common_vendor.s(_ctx.customStyle)
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/node-modules/nutui-uniapp/components/uploader/uploader.js.map
