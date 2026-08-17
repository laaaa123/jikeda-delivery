"use strict";
/**
* @vue/shared v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function makeMap(str, expectsLowerCase) {
  const set2 = new Set(str.split(","));
  return expectsLowerCase ? (val) => set2.has(val.toLowerCase()) : (val) => set2.has(val);
}
const EMPTY_OBJ = Object.freeze({});
const EMPTY_ARR = Object.freeze([]);
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$2 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$2.call(val, key);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction$1 = (val) => typeof val === "function";
const isString$1 = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$2 = (val) => val !== null && typeof val === "object";
const isPromise$2 = (val) => {
  return (isObject$2(val) || isFunction$1(val)) && isFunction$1(val.then) && isFunction$1(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString$1(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const isBuiltInDirective = /* @__PURE__ */ makeMap(
  "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
);
const cacheStringFunction$1 = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction$1((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE$1 = /\B([A-Z])/g;
const hyphenate$1 = cacheStringFunction$1(
  (str) => str.replace(hyphenateRE$1, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction$1((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction$1((str) => {
  const s2 = str ? `on${capitalize(str)}` : ``;
  return s2;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns$1 = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const looseToNumber = (val) => {
  const n2 = parseFloat(val);
  return isNaN(n2) ? val : n2;
};
function normalizeStyle$1(value) {
  if (isArray$1(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString$1(item) ? parseStringStyle$1(item) : normalizeStyle$1(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString$1(value) || isObject$2(value)) {
    return value;
  }
}
const listDelimiterRE$1 = /;(?![^(]*\))/g;
const propertyDelimiterRE$1 = /:([^]+)/;
const styleCommentRE$1 = /\/\*[^]*?\*\//g;
function parseStringStyle$1(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE$1, "").split(listDelimiterRE$1).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE$1);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass$1(value) {
  let res = "";
  if (isString$1(value)) {
    res = value;
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass$1(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$2(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const toDisplayString = (val) => {
  return isString$1(val) ? val : val == null ? "" : isArray$1(val) || isObject$2(val) && (val.toString === objectToString || !isFunction$1(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject$2(val) && !isArray$1(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
};
const LOCALE_ZH_HANS = "zh-Hans";
const LOCALE_ZH_HANT = "zh-Hant";
const LOCALE_EN = "en";
const LOCALE_FR = "fr";
const LOCALE_ES = "es";
function include(str, parts) {
  return !!parts.find((part) => str.indexOf(part) !== -1);
}
function startsWith(str, parts) {
  return parts.find((part) => str.indexOf(part) === 0);
}
function normalizeLocale(locale, messages) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, "-");
  if (messages && messages[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale === "chinese") {
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf("zh") === 0) {
    if (locale.indexOf("-hans") > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("-hant") > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  let locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
  if (messages && Object.keys(messages).length > 0) {
    locales = Object.keys(messages);
  }
  const lang = startsWith(locale, locales);
  if (lang) {
    return lang;
  }
}
const SLOT_DEFAULT_NAME = "d";
const ON_SHOW = "onShow";
const ON_HIDE = "onHide";
const ON_LAUNCH = "onLaunch";
const ON_ERROR = "onError";
const ON_THEME_CHANGE = "onThemeChange";
const ON_PAGE_NOT_FOUND = "onPageNotFound";
const ON_UNHANDLE_REJECTION = "onUnhandledRejection";
const ON_LAST_PAGE_BACK_PRESS = "onLastPageBackPress";
const ON_EXIT = "onExit";
const ON_LOAD = "onLoad";
const ON_READY = "onReady";
const ON_UNLOAD = "onUnload";
const ON_INIT = "onInit";
const ON_SAVE_EXIT_STATE = "onSaveExitState";
const ON_UPLOAD_DOUYIN_VIDEO = "onUploadDouyinVideo";
const ON_LIVE_MOUNT = "onLiveMount";
const ON_TITLE_CLICK = "onTitleClick";
const ON_RESIZE = "onResize";
const ON_BACK_PRESS = "onBackPress";
const ON_PAGE_SCROLL = "onPageScroll";
const ON_TAB_ITEM_TAP = "onTabItemTap";
const ON_REACH_BOTTOM = "onReachBottom";
const ON_PULL_DOWN_REFRESH = "onPullDownRefresh";
const ON_SHARE_TIMELINE = "onShareTimeline";
const ON_SHARE_CHAT = "onShareChat";
const ON_COPY_URL = "onCopyUrl";
const ON_ADD_TO_FAVORITES = "onAddToFavorites";
const ON_SHARE_APP_MESSAGE = "onShareAppMessage";
const ON_NAVIGATION_BAR_BUTTON_TAP = "onNavigationBarButtonTap";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED = "onNavigationBarSearchInputClicked";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED = "onNavigationBarSearchInputChanged";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED = "onNavigationBarSearchInputConfirmed";
const ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED = "onNavigationBarSearchInputFocusChanged";
const VIRTUAL_HOST_STYLE = "virtualHostStyle";
const VIRTUAL_HOST_CLASS = "virtualHostClass";
const VIRTUAL_HOST_HIDDEN = "virtualHostHidden";
const VIRTUAL_HOST_ID = "virtualHostId";
const customizeRE = /:/g;
function customizeEvent(str) {
  return camelize(str.replace(customizeRE, "-"));
}
function hasLeadingSlash(str) {
  return str.indexOf("/") === 0;
}
function addLeadingSlash(str) {
  return hasLeadingSlash(str) ? str : "/" + str;
}
const invokeArrayFns = (fns, arg) => {
  let ret;
  for (let i = 0; i < fns.length; i++) {
    ret = fns[i](arg);
  }
  return ret;
};
function once(fn, ctx = null) {
  let res;
  return (...args) => {
    if (fn) {
      res = fn.apply(ctx, args);
      fn = null;
    }
    return res;
  };
}
function getValueByDataPath(obj, path) {
  if (!isString$1(path)) {
    return;
  }
  path = path.replace(/\[(\d+)\]/g, ".$1");
  const parts = path.split(".");
  let key = parts[0];
  if (!obj) {
    obj = {};
  }
  if (parts.length === 1) {
    return obj[key];
  }
  return getValueByDataPath(obj[key], parts.slice(1).join("."));
}
const encode = encodeURIComponent;
function stringifyQuery(obj, encodeStr = encode) {
  const res = obj ? Object.keys(obj).map((key) => {
    let val = obj[key];
    if (typeof val === void 0 || val === null) {
      val = "";
    } else if (isPlainObject(val)) {
      val = JSON.stringify(val);
    }
    return encodeStr(key) + "=" + encodeStr(val);
  }).filter((x) => x.length > 0).join("&") : null;
  return res ? `?${res}` : "";
}
const PAGE_HOOKS = [
  ON_INIT,
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_RESIZE,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_COPY_URL,
  ON_UPLOAD_DOUYIN_VIDEO,
  ON_LIVE_MOUNT,
  ON_TITLE_CLICK,
  ON_ADD_TO_FAVORITES,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED
];
function isRootHook(name) {
  return PAGE_HOOKS.indexOf(name) > -1;
}
const UniLifecycleHooks = [
  ON_SHOW,
  ON_HIDE,
  ON_LAUNCH,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION,
  ON_EXIT,
  ON_INIT,
  ON_LOAD,
  ON_READY,
  ON_UNLOAD,
  ON_RESIZE,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_ADD_TO_FAVORITES,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_COPY_URL,
  ON_UPLOAD_DOUYIN_VIDEO,
  ON_LIVE_MOUNT,
  ON_TITLE_CLICK,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED,
  ON_LAST_PAGE_BACK_PRESS
];
const MINI_PROGRAM_PAGE_RUNTIME_HOOKS = /* @__PURE__ */ (() => {
  return {
    onPageScroll: 1,
    onShareAppMessage: 1 << 1,
    onShareTimeline: 1 << 2,
    onShareChat: 1 << 3,
    onCopyUrl: 1 << 4,
    onUploadDouyinVideo: 1 << 5,
    onLiveMount: 1 << 6,
    onTitleClick: 1 << 7
  };
})();
function isUniLifecycleHook(name, value, checkType = true) {
  if (checkType && !isFunction$1(value)) {
    return false;
  }
  if (UniLifecycleHooks.indexOf(name) > -1) {
    return true;
  } else if (name.indexOf("on") === 0) {
    return true;
  }
  return false;
}
let vueApp;
const createVueAppHooks = [];
function onCreateVueApp(hook) {
  if (vueApp) {
    return hook(vueApp);
  }
  createVueAppHooks.push(hook);
}
function invokeCreateVueAppHook(app) {
  vueApp = app;
  createVueAppHooks.forEach((hook) => hook(app));
}
const invokeCreateErrorHandler = once((app, createErrorHandler2) => {
  return createErrorHandler2(app);
});
const E = function() {
};
E.prototype = {
  _id: 1,
  on: function(name, callback, ctx) {
    var e2 = this.e || (this.e = {});
    (e2[name] || (e2[name] = [])).push({
      fn: callback,
      ctx,
      _id: this._id
    });
    return this._id++;
  },
  once: function(name, callback, ctx) {
    var self2 = this;
    function listener() {
      self2.off(name, listener);
      callback.apply(ctx, arguments);
    }
    listener._ = callback;
    return this.on(name, listener, ctx);
  },
  emit: function(name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;
    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }
    return this;
  },
  off: function(name, event) {
    var e2 = this.e || (this.e = {});
    var evts = e2[name];
    var liveEvents = [];
    if (evts && event) {
      for (var i = evts.length - 1; i >= 0; i--) {
        if (evts[i].fn === event || evts[i].fn._ === event || evts[i]._id === event) {
          evts.splice(i, 1);
          break;
        }
      }
      liveEvents = evts;
    }
    liveEvents.length ? e2[name] = liveEvents : delete e2[name];
    return this;
  }
};
var E$1 = E;
/**
* @dcloudio/uni-mp-vue v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function warn$2(msg, ...args) {
  console.warn(`[Vue warn] ${msg}`, ...args);
}
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    } else {
      warn$2(`cannot run an inactive effect scope.`);
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect2, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect2);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
let activeEffect;
class ReactiveEffect {
  constructor(fn, trigger2, scheduler, scope) {
    this.fn = fn;
    this.trigger = trigger2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this._dirtyLevel = 4;
    this._trackId = 0;
    this._runnings = 0;
    this._shouldSchedule = false;
    this._depsLength = 0;
    recordEffectScope(this, scope);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1;
      pauseTracking();
      for (let i = 0; i < this._depsLength; i++) {
        const dep = this.deps[i];
        if (dep.computed) {
          triggerComputed(dep.computed);
          if (this._dirtyLevel >= 4) {
            break;
          }
        }
      }
      if (this._dirtyLevel === 1) {
        this._dirtyLevel = 0;
      }
      resetTracking();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(v) {
    this._dirtyLevel = v ? 4 : 0;
  }
  run() {
    this._dirtyLevel = 0;
    if (!this.active) {
      return this.fn();
    }
    let lastShouldTrack = shouldTrack;
    let lastEffect = activeEffect;
    try {
      shouldTrack = true;
      activeEffect = this;
      this._runnings++;
      preCleanupEffect(this);
      return this.fn();
    } finally {
      postCleanupEffect(this);
      this._runnings--;
      activeEffect = lastEffect;
      shouldTrack = lastShouldTrack;
    }
  }
  stop() {
    var _a;
    if (this.active) {
      preCleanupEffect(this);
      postCleanupEffect(this);
      (_a = this.onStop) == null ? void 0 : _a.call(this);
      this.active = false;
    }
  }
}
function triggerComputed(computed2) {
  return computed2.value;
}
function preCleanupEffect(effect2) {
  effect2._trackId++;
  effect2._depsLength = 0;
}
function postCleanupEffect(effect2) {
  if (effect2.deps.length > effect2._depsLength) {
    for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
      cleanupDepEffect(effect2.deps[i], effect2);
    }
    effect2.deps.length = effect2._depsLength;
  }
}
function cleanupDepEffect(dep, effect2) {
  const trackId = dep.get(effect2);
  if (trackId !== void 0 && effect2._trackId !== trackId) {
    dep.delete(effect2);
    if (dep.size === 0) {
      dep.cleanup();
    }
  }
}
let shouldTrack = true;
let pauseScheduleStack = 0;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function pauseScheduling() {
  pauseScheduleStack++;
}
function resetScheduling() {
  pauseScheduleStack--;
  while (!pauseScheduleStack && queueEffectSchedulers.length) {
    queueEffectSchedulers.shift()();
  }
}
function trackEffect(effect2, dep, debuggerEventExtraInfo) {
  var _a;
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    const oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
    {
      (_a = effect2.onTrack) == null ? void 0 : _a.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
    }
  }
}
const queueEffectSchedulers = [];
function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
  var _a;
  pauseScheduling();
  for (const effect2 of dep.keys()) {
    let tracking;
    if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
      effect2._dirtyLevel = dirtyLevel;
    }
    if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      {
        (_a = effect2.onTrigger) == null ? void 0 : _a.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
      }
      effect2.trigger();
      if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
        effect2._shouldSchedule = false;
        if (effect2.scheduler) {
          queueEffectSchedulers.push(effect2.scheduler);
        }
      }
    }
  }
  resetScheduling();
}
const createDep = (cleanup, computed2) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.computed = computed2;
  return dep;
};
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol("iterate");
const MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
    }
    trackEffect(
      activeEffect,
      dep,
      {
        target,
        type,
        key
      }
    );
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray$1(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  pauseScheduling();
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        4,
        {
          target,
          type,
          key,
          newValue,
          oldValue,
          oldTarget
        }
      );
    }
  }
  resetScheduling();
}
function getDepFromReactive(object, key) {
  var _a;
  return (_a = targetMap.get(object)) == null ? void 0 : _a.get(key);
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      pauseScheduling();
      const res = toRaw(this)[key].apply(this, args);
      resetScheduling();
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty$1(key) {
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray$1(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty$1;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject$2(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray$1(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    {
      warn$2(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
  deleteProperty(target, key) {
    {
      warn$2(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
  true
);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get22 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get22.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get22 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get22 ? get22.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget = isMap(target) ? new Map(target) : new Set(target);
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      warn$2(
        `${capitalize(type)} operation ${key}failed: target is readonly.`,
        toRaw(this)
      );
    }
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
function checkIdentityKeys(target, has2, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has2.call(target, rawKey)) {
    const type = toRawType(target);
    warn$2(
      `Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$2(target)) {
    {
      warn$2(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject$2(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$2(value) ? readonly(value) : value;
const COMPUTED_SIDE_EFFECT_WARN = `Computed is still dirty after getter evaluation, likely because a computed is mutating its own dependency in its getter. State mutations in computed getters should be avoided.  Check the docs for more details: https://vuejs.org/guide/essentials/computed.html#getters-should-be-side-effect-free`;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this.getter = getter;
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => triggerRefValue(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    );
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    if ((!self2._cacheable || self2.effect.dirty) && hasChanged(self2._value, self2._value = self2.effect.run())) {
      triggerRefValue(self2, 4);
    }
    trackRefValue(self2);
    if (self2.effect._dirtyLevel >= 2) {
      if (this._warnRecursive) {
        warn$2(COMPUTED_SIDE_EFFECT_WARN, `

getter: `, this.getter);
      }
      triggerRefValue(self2, 2);
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(v) {
    this.effect.dirty = v;
  }
  // #endregion
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction$1(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {
      warn$2("Write operation failed: computed value is readonly");
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  if (debugOptions && !isSSR) {
    cRef.effect.onTrack = debugOptions.onTrack;
    cRef.effect.onTrigger = debugOptions.onTrigger;
  }
  return cRef;
}
function trackRefValue(ref2) {
  var _a;
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    trackEffect(
      activeEffect,
      (_a = ref2.dep) != null ? _a : ref2.dep = createDep(
        () => ref2.dep = void 0,
        ref2 instanceof ComputedRefImpl ? ref2 : void 0
      ),
      {
        target: ref2,
        type: "get",
        key: "value"
      }
    );
  }
}
function triggerRefValue(ref2, dirtyLevel = 4, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    triggerEffects(
      dep,
      dirtyLevel,
      {
        target: ref2,
        type: "set",
        key: "value",
        newValue: newVal
      }
    );
  }
}
function isRef(r2) {
  return !!(r2 && r2.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, 4, newVal);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
function toRefs(object) {
  if (!isProxy(object)) {
    warn$2(`toRefs() expects a reactive object but received a plain one.`);
  }
  const ret = isArray$1(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = propertyToRef(object, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this.__v_isRef = true;
  }
  get value() {
    const val = this._object[this._key];
    return val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
  get dep() {
    return getDepFromReactive(toRaw(this._object), this._key);
  }
}
class GetterRefImpl {
  constructor(_getter) {
    this._getter = _getter;
    this.__v_isRef = true;
    this.__v_isReadonly = true;
  }
  get value() {
    return this._getter();
  }
}
function toRef(source, key, defaultValue) {
  if (isRef(source)) {
    return source;
  } else if (isFunction$1(source)) {
    return new GetterRefImpl(source);
  } else if (isObject$2(source) && arguments.length > 1) {
    return propertyToRef(source, key, defaultValue);
  } else {
    return ref(source);
  }
}
function propertyToRef(source, key, defaultValue) {
  const val = source[key];
  return isRef(val) ? val : new ObjectRefImpl(source, key, defaultValue);
}
const stack = [];
function pushWarningContext(vnode) {
  stack.push(vnode);
}
function popWarningContext() {
  stack.pop();
}
function warn$1(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString$1(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction$1(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
const ErrorTypeStrings = {
  ["sp"]: "serverPrefetch hook",
  ["bc"]: "beforeCreate hook",
  ["c"]: "created hook",
  ["bm"]: "beforeMount hook",
  ["m"]: "mounted hook",
  ["bu"]: "beforeUpdate hook",
  ["u"]: "updated",
  ["bum"]: "beforeUnmount hook",
  ["um"]: "unmounted hook",
  ["a"]: "activated hook",
  ["da"]: "deactivated hook",
  ["ec"]: "errorCaptured hook",
  ["rtc"]: "renderTracked hook",
  ["rtg"]: "renderTriggered hook",
  [0]: "setup function",
  [1]: "render function",
  [2]: "watcher getter",
  [3]: "watcher callback",
  [4]: "watcher cleanup function",
  [5]: "native event handler",
  [6]: "component event handler",
  [7]: "vnode hook",
  [8]: "directive hook",
  [9]: "transition hook",
  [10]: "app errorHandler",
  [11]: "app warnHandler",
  [12]: "ref function",
  [13]: "async component loader",
  [14]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://github.com/vuejs/core ."
};
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction$1(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise$2(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = ErrorTypeStrings[type] || type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    const info = ErrorTypeStrings[type] || type;
    if (contextVNode) {
      pushWarningContext(contextVNode);
    }
    warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
    if (contextVNode) {
      popWarningContext();
    }
    if (throwInDev) {
      console.error(err);
    } else {
      console.error(err);
    }
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue$1 = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
const RECURSION_LIMIT = 100;
function nextTick$1(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue$1.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue$1[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!queue$1.length || !queue$1.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue$1.push(job);
    } else {
      queue$1.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function hasQueueJob(job) {
  return queue$1.indexOf(job) > -1;
}
function invalidateJob(job) {
  const i = queue$1.indexOf(job);
  if (i > flushIndex) {
    queue$1.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray$1(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = isFlushing ? flushIndex + 1 : 0) {
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  for (; i < queue$1.length; i++) {
    const cb = queue$1[i];
    if (cb && cb.pre) {
      if (checkRecursiveUpdates(seen, cb)) {
        continue;
      }
      queue$1.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      if (checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) {
        continue;
      }
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff2 = getId(a) - getId(b);
  if (diff2 === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff2;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  queue$1.sort(comparator);
  const check = (job) => checkRecursiveUpdates(seen, job);
  try {
    for (flushIndex = 0; flushIndex < queue$1.length; flushIndex++) {
      const job = queue$1[flushIndex];
      if (job && job.active !== false) {
        if (check(job)) {
          continue;
        }
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue$1.length = 0;
    flushPostFlushCbs(seen);
    isFlushing = false;
    currentFlushPromise = null;
    if (queue$1.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function checkRecursiveUpdates(seen, fn) {
  if (!seen.has(fn)) {
    seen.set(fn, 1);
  } else {
    const count = seen.get(fn);
    if (count > RECURSION_LIMIT) {
      const instance = fn.ownerInstance;
      const componentName2 = instance && getComponentName(instance.type);
      handleError(
        `Maximum recursive updates exceeded${componentName2 ? ` in component <${componentName2}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
        null,
        10
      );
      return true;
    } else {
      seen.set(fn, count + 1);
    }
  }
}
let devtools;
let buffer = [];
let devtoolsNotInstalled = false;
function emit$1(event, ...args) {
  if (devtools) {
    devtools.emit(event, ...args);
  } else if (!devtoolsNotInstalled) {
    buffer.push({ event, args });
  }
}
function setDevtoolsHook(hook, target) {
  var _a, _b;
  devtools = hook;
  if (devtools) {
    devtools.enabled = true;
    buffer.forEach(({ event, args }) => devtools.emit(event, ...args));
    buffer = [];
  } else if (
    // handle late devtools injection - only do this if we are in an actual
    // browser environment to avoid the timer handle stalling test runner exit
    // (#4815)
    typeof window !== "undefined" && // some envs mock window but not fully
    window.HTMLElement && // also exclude jsdom
    !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
  ) {
    const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
    replay.push((newHook) => {
      setDevtoolsHook(newHook, target);
    });
    setTimeout(() => {
      if (!devtools) {
        target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
        devtoolsNotInstalled = true;
        buffer = [];
      }
    }, 3e3);
  } else {
    devtoolsNotInstalled = true;
    buffer = [];
  }
}
function devtoolsInitApp(app, version2) {
  emit$1("app:init", app, version2, {
    Fragment,
    Text,
    Comment,
    Static
  });
}
const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:added"
  /* COMPONENT_ADDED */
);
const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:updated"
  /* COMPONENT_UPDATED */
);
const _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:removed"
  /* COMPONENT_REMOVED */
);
const devtoolsComponentRemoved = (component) => {
  if (devtools && typeof devtools.cleanupBuffer === "function" && // remove the component if it wasn't buffered
  !devtools.cleanupBuffer(component)) {
    _devtoolsComponentRemoved(component);
  }
};
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function createDevtoolsComponentHook(hook) {
  return (component) => {
    emit$1(
      hook,
      component.appContext.app,
      component.uid,
      // fixed by xxxxxx
      // 为 0 是 App，无 parent 是 Page 指向 App
      component.uid === 0 ? void 0 : component.parent ? component.parent.uid : 0,
      component
    );
  };
}
const devtoolsPerfStart = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:start"
  /* PERFORMANCE_START */
);
const devtoolsPerfEnd = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:end"
  /* PERFORMANCE_END */
);
function createDevtoolsPerformanceHook(hook) {
  return (component, type, time) => {
    emit$1(hook, component.appContext.app, component.uid, component, type, time);
  };
}
function devtoolsComponentEmit(component, event, params) {
  emit$1(
    "component:emit",
    component.appContext.app,
    component,
    event,
    params
  );
}
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  {
    const {
      emitsOptions,
      propsOptions: [propsOptions]
    } = instance;
    if (emitsOptions) {
      if (!(event in emitsOptions) && true) {
        if (!propsOptions || !(toHandlerKey(event) in propsOptions)) {
          warn$1(
            `Component emitted event "${event}" but it is neither declared in the emits option nor as an "${toHandlerKey(event)}" prop.`
          );
        }
      } else {
        const validator = emitsOptions[event];
        if (isFunction$1(validator)) {
          const isValid = validator(...rawArgs);
          if (!isValid) {
            warn$1(
              `Invalid event arguments: event validation failed for event "${event}".`
            );
          }
        }
      }
    }
  }
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => isString$1(a) ? a.trim() : a);
    }
    if (number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  {
    devtoolsComponentEmit(instance, event, args);
  }
  {
    const lowerCaseEvent = event.toLowerCase();
    if (lowerCaseEvent !== event && props[toHandlerKey(lowerCaseEvent)]) {
      warn$1(
        `Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(
          instance,
          instance.type
        )} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${hyphenate$1(
          event
        )}" instead of "${event}".`
      );
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate$1(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$2(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray$1(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject$2(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate$1(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  instance && instance.type.__scopeId || null;
  return prev;
}
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component2 = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(
        Component2,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component2;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component2[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component2;
    }
    if (warnMissing && !res) {
      const extra = type === COMPONENTS ? `
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.` : ``;
      warn$1(`Failed to resolve ${type.slice(0, -1)}: ${name}${extra}`);
    }
    return res;
  } else {
    warn$1(
      `resolve${capitalize(type.slice(0, -1))} can only be used in render() or setup().`
    );
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  if (!isFunction$1(cb)) {
    warn$1(
      `\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`
    );
  }
  return doWatch(source, cb, options);
}
function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  once: once2,
  onTrack,
  onTrigger
} = EMPTY_OBJ) {
  if (cb && once2) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      unwatch();
    };
  }
  if (deep !== void 0 && typeof deep === "number") {
    warn$1(
      `watch() "deep" option with number value will be used as watch depth in future versions. Please use a boolean instead to avoid potential breakage.`
    );
  }
  if (!cb) {
    if (immediate !== void 0) {
      warn$1(
        `watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (deep !== void 0) {
      warn$1(
        `watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (once2 !== void 0) {
      warn$1(
        `watch() "once" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
  }
  const warnInvalidSource = (s2) => {
    warn$1(
      `Invalid watch source: `,
      s2,
      `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`
    );
  };
  const instance = currentInstance;
  const reactiveGetter = (source2) => deep === true ? source2 : (
    // for deep: false, only traverse root-level properties
    traverse(source2, deep === false ? 1 : void 0)
  );
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray$1(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s2) => isReactive(s2) || isShallow(s2));
    getter = () => source.map((s2) => {
      if (isRef(s2)) {
        return s2.value;
      } else if (isReactive(s2)) {
        return reactiveGetter(s2);
      } else if (isFunction$1(s2)) {
        return callWithErrorHandling(s2, instance, 2);
      } else {
        warnInvalidSource(s2);
      }
    });
  } else if (isFunction$1(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
    warnInvalidSource(source);
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect2.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
      cleanup = effect2.onStop = void 0;
    };
  };
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect2.active || !effect2.dirty) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect2.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect$1(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect2 = new ReactiveEffect(getter, NOOP, scheduler);
  const scope = getCurrentScope();
  const unwatch = () => {
    effect2.stop();
    if (scope) {
      remove(scope.effects, effect2);
    }
  };
  {
    effect2.onTrack = onTrack;
    effect2.onTrigger = onTrigger;
  }
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect$1(
      effect2.run.bind(effect2),
      instance && instance.suspense
    );
  } else {
    effect2.run();
  }
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString$1(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction$1(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, depth, currentDepth = 0, seen) {
  if (!isObject$2(value) || value["__v_skip"]) {
    return value;
  }
  if (depth && depth > 0) {
    if (currentDepth >= depth) {
      return value;
    }
    currentDepth++;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, depth, currentDepth, seen);
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, currentDepth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, currentDepth, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, currentDepth, seen);
    }
  }
  return value;
}
function validateDirectiveName(name) {
  if (isBuiltInDirective(name)) {
    warn$1("Do not use built-in directive ids as custom directive id: " + name);
  }
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction$1(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject$2(rootProps)) {
      warn$1(`root props passed to app.mount() must be an object.`);
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
        {
          warn$1(
            `app.config cannot be replaced. Modify individual options instead.`
          );
        }
      },
      use(plugin2, ...options) {
        if (installedPlugins.has(plugin2)) {
          warn$1(`Plugin has already been applied to target app.`);
        } else if (plugin2 && isFunction$1(plugin2.install)) {
          installedPlugins.add(plugin2);
          plugin2.install(app, ...options);
        } else if (isFunction$1(plugin2)) {
          installedPlugins.add(plugin2);
          plugin2(app, ...options);
        } else {
          warn$1(
            `A plugin must either be a function or an object with an "install" function.`
          );
        }
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          } else {
            warn$1(
              "Mixin has already been applied to target app" + (mixin.name ? `: ${mixin.name}` : "")
            );
          }
        }
        return app;
      },
      component(name, component) {
        {
          validateComponentName(name, context.config);
        }
        if (!component) {
          return context.components[name];
        }
        if (context.components[name]) {
          warn$1(`Component "${name}" has already been registered in target app.`);
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        {
          validateDirectiveName(name);
        }
        if (!directive) {
          return context.directives[name];
        }
        if (context.directives[name]) {
          warn$1(`Directive "${name}" has already been registered in target app.`);
        }
        context.directives[name] = directive;
        return app;
      },
      // fixed by xxxxxx
      mount() {
      },
      // fixed by xxxxxx
      unmount() {
      },
      provide(key, value) {
        if (key in context.provides) {
          warn$1(
            `App already provides property with key "${String(key)}". It will be overwritten with the new value.`
          );
        }
        context.provides[key] = value;
        return app;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance) {
    {
      warn$1(`provide() can only be used inside setup().`);
    }
  } else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
    if (currentInstance.type.mpType === "app") {
      currentInstance.appContext.app.provide(key, value);
    }
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction$1(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else {
      warn$1(`injection "${String(key)}" not found.`);
    }
  } else {
    warn$1(`inject() can only be used inside setup() or functional components.`);
  }
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
  return isFunction$1(options) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    if (isRootHook(type)) {
      target = target.root;
    }
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  } else {
    const apiName = toHandlerKey(
      (ErrorTypeStrings[type] || type.replace(/^on/, "")).replace(/ hook$/, "")
    );
    warn$1(
      `${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup().`
    );
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
function getComponentInternalInstance(i) {
  return i;
}
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    // fixed by xxxxxx
    $: getComponentInternalInstance,
    // fixed by xxxxxx vue-i18n 在 dev 模式，访问了 $el，故模拟一个假的
    // $el: i => i.vnode.el,
    $el: (i) => i.__$el || (i.__$el = {}),
    $data: (i) => i.data,
    $props: (i) => shallowReadonly(i.props),
    $attrs: (i) => shallowReadonly(i.attrs),
    $slots: (i) => shallowReadonly(i.slots),
    $refs: (i) => shallowReadonly(i.refs),
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      i.effect.dirty = true;
      queueJob(i.update);
    }),
    // $nextTick: i => i.n || (i.n = nextTick.bind(i.proxy!)),// fixed by xxxxxx
    $watch: (i) => instanceWatch.bind(i)
  })
);
const isReservedPrefix = (key) => key === "_" || key === "$";
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    if (key === "__isVue") {
      return true;
    }
    let normalizedProps;
    if (key[0] !== "$") {
      const n2 = accessCache[key];
      if (n2 !== void 0) {
        switch (n2) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      } else if (key === "$slots") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (instance.exposed && hasOwn(instance.exposed, key)) {
      return instance.exposed[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else if (currentRenderingInstance && (!isString$1(key) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    key.indexOf("__v") !== 0)) {
      if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn(data, key)) {
        warn$1(
          `Property ${JSON.stringify(
            key
          )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
        );
      } else if (instance === currentRenderingInstance) {
        warn$1(
          `Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`
        );
      }
    }
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (setupState.__isScriptSetup && hasOwn(setupState, key)) {
      warn$1(`Cannot mutate <script setup> binding "${key}" from Options API.`);
      return false;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      warn$1(`Attempting to mutate prop "${key}". Props are readonly.`);
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      warn$1(
        `Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`
      );
      return false;
    } else {
      if (key in instance.appContext.config.globalProperties) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          value
        });
      } else {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
{
  PublicInstanceProxyHandlers.ownKeys = (target) => {
    warn$1(
      `Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`
    );
    return Reflect.ownKeys(target);
  };
}
function createDevRenderContext(instance) {
  const target = {};
  Object.defineProperty(target, `_`, {
    configurable: true,
    enumerable: false,
    get: () => instance
  });
  Object.keys(publicPropertiesMap).forEach((key) => {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: false,
      get: () => publicPropertiesMap[key](instance),
      // intercepted by the proxy so no need for implementation,
      // but needed to prevent set errors
      set: NOOP
    });
  });
  return target;
}
function exposePropsOnRenderContext(instance) {
  const {
    ctx,
    propsOptions: [propsOptions]
  } = instance;
  if (propsOptions) {
    Object.keys(propsOptions).forEach((key) => {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => instance.props[key],
        set: NOOP
      });
    });
  }
}
function exposeSetupStateOnRenderContext(instance) {
  const { ctx, setupState } = instance;
  Object.keys(toRaw(setupState)).forEach((key) => {
    if (!setupState.__isScriptSetup) {
      if (isReservedPrefix(key[0])) {
        warn$1(
          `setup() return property ${JSON.stringify(
            key
          )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
        );
        return;
      }
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => setupState[key],
        set: NOOP
      });
    }
  });
}
function useSlots() {
  return getContext().slots;
}
function getContext() {
  const i = getCurrentInstance();
  if (!i) {
    warn$1(`useContext() called without active instance.`);
  }
  return i.setupContext || (i.setupContext = createSetupContext(i));
}
function normalizePropsOrEmits(props) {
  return isArray$1(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
function createDuplicateChecker() {
  const cache = /* @__PURE__ */ Object.create(null);
  return (type, key) => {
    if (cache[key]) {
      warn$1(`${type} property "${key}" is already defined in ${cache[key]}.`);
    } else {
      cache[key] = type;
    }
  };
}
let shouldCacheAccess = true;
function applyOptions$1(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = createDuplicateChecker();
  {
    const [propsOptions] = instance.propsOptions;
    if (propsOptions) {
      for (const key in propsOptions) {
        checkDuplicateProperties("Props", key);
      }
    }
  }
  function initInjections() {
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
  }
  {
    initInjections();
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction$1(methodHandler)) {
        {
          Object.defineProperty(ctx, key, {
            value: methodHandler.bind(publicThis),
            configurable: true,
            enumerable: true,
            writable: true
          });
        }
        {
          checkDuplicateProperties("Methods", key);
        }
      } else {
        warn$1(
          `Method "${key}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`
        );
      }
    }
  }
  if (dataOptions) {
    if (!isFunction$1(dataOptions)) {
      warn$1(
        `The data option must be a function. Plain object usage is no longer supported.`
      );
    }
    const data = dataOptions.call(publicThis, publicThis);
    if (isPromise$2(data)) {
      warn$1(
        `data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`
      );
    }
    if (!isObject$2(data)) {
      warn$1(`data() should return an object.`);
    } else {
      instance.data = reactive(data);
      {
        for (const key in data) {
          checkDuplicateProperties("Data", key);
          if (!isReservedPrefix(key[0])) {
            Object.defineProperty(ctx, key, {
              configurable: true,
              enumerable: true,
              get: () => data[key],
              set: NOOP
            });
          }
        }
      }
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get22 = isFunction$1(opt) ? opt.bind(publicThis, publicThis) : isFunction$1(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      if (get22 === NOOP) {
        warn$1(`Computed property "${key}" has no getter.`);
      }
      const set2 = !isFunction$1(opt) && isFunction$1(opt.set) ? opt.set.bind(publicThis) : () => {
        warn$1(
          `Write operation failed: computed property "${key}" is readonly.`
        );
      };
      const c2 = computed({
        get: get22,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c2.value,
        set: (v) => c2.value = v
      });
      {
        checkDuplicateProperties("Computed", key);
      }
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  function initProvides() {
    if (provideOptions) {
      const provides = isFunction$1(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
  }
  {
    initProvides();
  }
  {
    if (created) {
      callHook$1(created, instance, "c");
    }
  }
  function registerLifecycleHook(register2, hook) {
    if (isArray$1(hook)) {
      hook.forEach((_hook) => register2(_hook.bind(publicThis)));
    } else if (hook) {
      register2(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray$1(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
  if (instance.ctx.$onApplyOptions) {
    instance.ctx.$onApplyOptions(options, instance, publicThis);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$2(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
    {
      checkDuplicateProperties("Inject", key);
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString$1(raw)) {
    const handler = ctx[raw];
    if (isFunction$1(handler)) {
      watch(getter, handler);
    } else {
      warn$1(`Invalid watch handler specified by key "${raw}"`, handler);
    }
  } else if (isFunction$1(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$2(raw)) {
    if (isArray$1(raw)) {
      raw.forEach((r2) => createWatcher(r2, ctx, publicThis, key));
    } else {
      const handler = isFunction$1(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction$1(handler)) {
        watch(getter, handler, raw);
      } else {
        warn$1(`Invalid watch handler specified by key "${raw.handler}"`, handler);
      }
    }
  } else {
    warn$1(`Invalid watch option: "${key}"`, raw);
  }
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m2) => mergeOptions(resolved, m2, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject$2(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m2) => mergeOptions(to, m2, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") {
      warn$1(
        `"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`
      );
    } else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray$1,
  created: mergeAsArray$1,
  beforeMount: mergeAsArray$1,
  mounted: mergeAsArray$1,
  beforeUpdate: mergeAsArray$1,
  updated: mergeAsArray$1,
  beforeDestroy: mergeAsArray$1,
  beforeUnmount: mergeAsArray$1,
  destroyed: mergeAsArray$1,
  unmounted: mergeAsArray$1,
  activated: mergeAsArray$1,
  deactivated: mergeAsArray$1,
  errorCaptured: mergeAsArray$1,
  serverPrefetch: mergeAsArray$1,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction$1(to) ? to.call(this, this) : to,
      isFunction$1(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray$1(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray$1(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray$1(to) && isArray$1(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray$1(to[key], from[key]);
  }
  return merged;
}
function initProps$1(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  {
    validateProps(rawProps || {}, props, instance);
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function isInHmrContext(instance) {
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    !isInHmrContext() && (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = normalizeInheritAttrsValue(instance, key, value);
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue$1(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = normalizeInheritAttrsValue(instance, key, value);
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate$1(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue$1(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
  {
    validateProps(rawProps || {}, props, instance);
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          {
            props[camelKey] = value;
          }
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = normalizeInheritAttrsValue(instance, key, value);
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue$1(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function normalizeInheritAttrsValue(instance, key, value) {
  return value;
}
function resolvePropValue$1(options, props, key, value, instance, isAbsent) {
  const result = _resolvePropValue(
    options,
    props,
    key,
    value,
    instance,
    isAbsent
  );
  return result;
}
function _resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction$1(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate$1(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction$1(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$2(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray$1(raw)) {
    for (let i = 0; i < raw.length; i++) {
      if (!isString$1(raw[i])) {
        warn$1(`props must be strings when using array syntax.`, raw[i]);
      }
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    if (!isObject$2(raw)) {
      warn$1(`invalid props options`, raw);
    }
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction$1(opt) ? { type: opt } : extend({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject$2(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  } else {
    warn$1(`Invalid prop name: "${key}" is a reserved property.`);
  }
  return false;
}
function getType$1(ctor) {
  if (ctor === null) {
    return "null";
  }
  if (typeof ctor === "function") {
    return ctor.name || "";
  } else if (typeof ctor === "object") {
    const name = ctor.constructor && ctor.constructor.name;
    return name || "";
  }
  return "";
}
function isSameType(a, b) {
  return getType$1(a) === getType$1(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray$1(expectedTypes)) {
    return expectedTypes.findIndex((t2) => isSameType(t2, type));
  } else if (isFunction$1(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
function validateProps(rawProps, props, instance) {
  const resolvedValues = toRaw(props);
  const options = instance.propsOptions[0];
  for (const key in options) {
    let opt = options[key];
    if (opt == null)
      continue;
    validateProp$1(
      key,
      resolvedValues[key],
      opt,
      shallowReadonly(resolvedValues),
      !hasOwn(rawProps, key) && !hasOwn(rawProps, hyphenate$1(key))
    );
  }
}
function validateProp$1(name, value, prop, props, isAbsent) {
  const { type, required, validator, skipCheck } = prop;
  if (required && isAbsent) {
    warn$1('Missing required prop: "' + name + '"');
    return;
  }
  if (value == null && !required) {
    return;
  }
  if (type != null && type !== true && !skipCheck) {
    let isValid = false;
    const types = isArray$1(type) ? type : [type];
    const expectedTypes = [];
    for (let i = 0; i < types.length && !isValid; i++) {
      const { valid, expectedType } = assertType$1(value, types[i]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      warn$1(getInvalidTypeMessage$1(name, value, expectedTypes));
      return;
    }
  }
  if (validator && !validator(value, props)) {
    warn$1('Invalid prop: custom validator check failed for prop "' + name + '".');
  }
}
const isSimpleType$1 = /* @__PURE__ */ makeMap(
  "String,Number,Boolean,Function,Symbol,BigInt"
);
function assertType$1(value, type) {
  let valid;
  const expectedType = getType$1(type);
  if (isSimpleType$1(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject$2(value);
  } else if (expectedType === "Array") {
    valid = isArray$1(value);
  } else if (expectedType === "null") {
    valid = value === null;
  } else {
    valid = value instanceof type;
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage$1(name, value, expectedTypes) {
  if (expectedTypes.length === 0) {
    return `Prop type [] for prop "${name}" won't match anything. Did you mean to use type Array instead?`;
  }
  let message = `Invalid prop: type check failed for prop "${name}". Expected ${expectedTypes.map(capitalize).join(" | ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue$1(value, expectedType);
  const receivedValue = styleValue$1(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable$1(expectedType) && !isBoolean$2(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable$1(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function styleValue$1(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable$1(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean$2(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
let supported;
let perf;
function startMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    perf.mark(`vue-${type}-${instance.uid}`);
  }
  {
    devtoolsPerfStart(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function endMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    const startTag = `vue-${type}-${instance.uid}`;
    const endTag = startTag + `:end`;
    perf.mark(endTag);
    perf.measure(
      `<${formatComponentName(instance, instance.type)}> ${type}`,
      startTag,
      endTag
    );
    perf.clearMarks(startTag);
    perf.clearMarks(endTag);
  }
  {
    devtoolsPerfEnd(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function isSupported() {
  if (supported !== void 0) {
    return supported;
  }
  if (typeof window !== "undefined" && window.performance) {
    supported = true;
    perf = window.performance;
  } else {
    supported = false;
  }
  return supported;
}
const queuePostRenderEffect$1 = queuePostFlushCb;
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
function isVNode$1(value) {
  return value ? value.__v_isVNode === true : false;
}
const InternalObjectKey = `__vInternal`;
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null,
    // fixed by xxxxxx 用于存储uni-app的元素缓存
    $uniElements: /* @__PURE__ */ new Map(),
    $templateUniElementRefs: [],
    $templateUniElementStyles: {},
    $eS: {},
    $eA: {}
  };
  {
    instance.ctx = createDevRenderContext(instance);
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  internalSetCurrentInstance = (i) => {
    currentInstance = i;
  };
  setInSSRSetupState = (v) => {
    isInSSRComponentSetup = v;
  };
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
const isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
function validateComponentName(name, { isNativeTag }) {
  if (isBuiltInTag(name) || isNativeTag(name)) {
    warn$1(
      "Do not use built-in or reserved HTML elements as component id: " + name
    );
  }
}
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isSSR && setInSSRSetupState(isSSR);
  const {
    props
    /*, children*/
  } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps$1(instance, props, isStateful, isSSR);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component2 = instance.type;
  {
    if (Component2.name) {
      validateComponentName(Component2.name, instance.appContext.config);
    }
    if (Component2.components) {
      const names = Object.keys(Component2.components);
      for (let i = 0; i < names.length; i++) {
        validateComponentName(names[i], instance.appContext.config);
      }
    }
    if (Component2.directives) {
      const names = Object.keys(Component2.directives);
      for (let i = 0; i < names.length; i++) {
        validateDirectiveName(names[i]);
      }
    }
    if (Component2.compilerOptions && isRuntimeOnly()) {
      warn$1(
        `"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.`
      );
    }
  }
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  {
    exposePropsOnRenderContext(instance);
  }
  const { setup } = Component2;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        shallowReadonly(instance.props),
        setupContext
      ]
    );
    resetTracking();
    reset();
    if (isPromise$2(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      {
        warn$1(
          `setup() returned a Promise, but the version of Vue you are using does not support it yet.`
        );
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction$1(setupResult)) {
    {
      instance.render = setupResult;
    }
  } else if (isObject$2(setupResult)) {
    if (isVNode$1(setupResult)) {
      warn$1(
        `setup() should not return VNodes directly - return a render function instead.`
      );
    }
    {
      instance.devtoolsRawSetupState = setupResult;
    }
    instance.setupState = proxyRefs(setupResult);
    {
      exposeSetupStateOnRenderContext(instance);
    }
  } else if (setupResult !== void 0) {
    warn$1(
      `setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`
    );
  }
  finishComponentSetup(instance, isSSR);
}
let compile;
const isRuntimeOnly = () => !compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component2 = instance.type;
  if (!instance.render) {
    instance.render = Component2.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions$1(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
  if (!Component2.render && instance.render === NOOP && !isSSR) {
    if (Component2.template) {
      warn$1(
        `Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
      );
    } else {
      warn$1(`Component is missing template or render function.`);
    }
  }
}
function getAttrsProxy(instance) {
  return instance.attrsProxy || (instance.attrsProxy = new Proxy(
    instance.attrs,
    {
      get(target, key) {
        track(instance, "get", "$attrs");
        return target[key];
      },
      set() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      },
      deleteProperty() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      }
    }
  ));
}
function getSlotsProxy(instance) {
  return instance.slotsProxy || (instance.slotsProxy = new Proxy(instance.slots, {
    get(target, key) {
      track(instance, "get", "$slots");
      return target[key];
    }
  }));
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    {
      if (instance.exposed) {
        warn$1(`expose() should be called only once per setup().`);
      }
      if (exposed != null) {
        let exposedType = typeof exposed;
        if (exposedType === "object") {
          if (isArray$1(exposed)) {
            exposedType = "array";
          } else if (isRef(exposed)) {
            exposedType = "ref";
          }
        }
        if (exposedType !== "object") {
          warn$1(
            `expose() should be passed a plain object, received ${exposedType}.`
          );
        }
      }
    }
    instance.exposed = exposed || {};
  };
  {
    return Object.freeze({
      get attrs() {
        return getAttrsProxy(instance);
      },
      get slots() {
        return getSlotsProxy(instance);
      },
      get emit() {
        return (event, ...args) => instance.emit(event, ...args);
      },
      expose
    });
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        }
        return instance.proxy[key];
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c2) => c2.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component2, includeInferred = true) {
  return isFunction$1(Component2) ? Component2.displayName || Component2.name : Component2.name || includeInferred && Component2.__name;
}
function formatComponentName(instance, Component2, isRoot = false) {
  let name = getComponentName(Component2);
  if (!name && Component2.__file) {
    const match = Component2.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component2) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
const computed = (getterOrOptions, debugOptions) => {
  const c2 = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  {
    const i = getCurrentInstance();
    if (i && i.appContext.config.warnRecursiveComputed) {
      c2._warnRecursive = true;
    }
  }
  return c2;
};
const version = "3.4.21";
const warn = warn$1;
function unwrapper(target) {
  return unref(target);
}
const ARRAYTYPE = "[object Array]";
const OBJECTTYPE = "[object Object]";
function diff(current, pre) {
  const result = {};
  syncKeys(current, pre);
  _diff(current, pre, "", result);
  return result;
}
function syncKeys(current, pre) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
    for (let key in pre) {
      const currentValue = current[key];
      if (currentValue === void 0) {
        current[key] = null;
      } else {
        syncKeys(currentValue, pre[key]);
      }
    }
  } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
    if (current.length >= pre.length) {
      pre.forEach((item, index2) => {
        syncKeys(current[index2], item);
      });
    }
  }
}
function _diff(current, pre, path, result) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE) {
    if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
      setResult(result, path, current);
    } else {
      for (let key in current) {
        const currentValue = unwrapper(current[key]);
        const preValue = pre[key];
        const currentType = toTypeString(currentValue);
        const preType = toTypeString(preValue);
        if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
          if (currentValue != preValue) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          }
        } else if (currentType == ARRAYTYPE) {
          if (preType != ARRAYTYPE) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            if (currentValue.length < preValue.length) {
              setResult(
                result,
                (path == "" ? "" : path + ".") + key,
                currentValue
              );
            } else {
              currentValue.forEach((item, index2) => {
                _diff(
                  item,
                  preValue[index2],
                  (path == "" ? "" : path + ".") + key + "[" + index2 + "]",
                  result
                );
              });
            }
          }
        } else if (currentType == OBJECTTYPE) {
          if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            for (let subKey in currentValue) {
              _diff(
                currentValue[subKey],
                preValue[subKey],
                (path == "" ? "" : path + ".") + key + "." + subKey,
                result
              );
            }
          }
        }
      }
    }
  } else if (rootCurrentType == ARRAYTYPE) {
    if (rootPreType != ARRAYTYPE) {
      setResult(result, path, current);
    } else {
      if (current.length < pre.length) {
        setResult(result, path, current);
      } else {
        current.forEach((item, index2) => {
          _diff(item, pre[index2], path + "[" + index2 + "]", result);
        });
      }
    }
  } else {
    setResult(result, path, current);
  }
}
function setResult(result, k, v) {
  result[k] = v;
}
function hasComponentEffect(instance) {
  return queue$1.includes(instance.update);
}
function flushCallbacks(instance) {
  const ctx = instance.ctx;
  const callbacks = ctx.__next_tick_callbacks;
  if (callbacks && callbacks.length) {
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }
}
function nextTick(instance, fn) {
  const ctx = instance.ctx;
  if (!ctx.__next_tick_pending && !hasComponentEffect(instance)) {
    return nextTick$1(fn && fn.bind(instance.proxy));
  }
  let _resolve;
  if (!ctx.__next_tick_callbacks) {
    ctx.__next_tick_callbacks = [];
  }
  ctx.__next_tick_callbacks.push(() => {
    if (fn) {
      callWithErrorHandling(
        fn.bind(instance.proxy),
        instance,
        14
      );
    } else if (_resolve) {
      _resolve(instance.proxy);
    }
  });
  return new Promise((resolve2) => {
    _resolve = resolve2;
  });
}
function clone(src, seen) {
  src = unwrapper(src);
  const type = typeof src;
  if (type === "object" && src !== null) {
    let copy = seen.get(src);
    if (typeof copy !== "undefined") {
      return copy;
    }
    if (isArray$1(src)) {
      const len = src.length;
      copy = new Array(len);
      seen.set(src, copy);
      for (let i = 0; i < len; i++) {
        copy[i] = clone(src[i], seen);
      }
    } else {
      copy = {};
      seen.set(src, copy);
      for (const name in src) {
        if (hasOwn(src, name)) {
          copy[name] = clone(src[name], seen);
        }
      }
    }
    return copy;
  }
  if (type !== "symbol") {
    return src;
  }
}
function deepCopy(src) {
  return clone(src, typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : /* @__PURE__ */ new Map());
}
function getMPInstanceData(instance, keys) {
  const data = instance.data;
  const ret = /* @__PURE__ */ Object.create(null);
  keys.forEach((key) => {
    ret[key] = data[key];
  });
  return ret;
}
function patch(instance, data, oldData) {
  if (!data) {
    return;
  }
  data = deepCopy(data);
  data.$eS = instance.$eS || {};
  data.$eA = instance.$eA || {};
  const ctx = instance.ctx;
  const mpType = ctx.mpType;
  if (mpType === "page" || mpType === "component") {
    data.r0 = 1;
    const mpInstance = ctx.$scope;
    const keys = Object.keys(data);
    const diffData = diff(data, oldData || getMPInstanceData(mpInstance, keys));
    if (Object.keys(diffData).length) {
      ctx.__next_tick_pending = true;
      mpInstance.setData(diffData, () => {
        ctx.__next_tick_pending = false;
        flushCallbacks(instance);
      });
      flushPreFlushCbs();
    } else {
      flushCallbacks(instance);
    }
  }
}
function initAppConfig(appConfig) {
  appConfig.globalProperties.$nextTick = function $nextTick(fn) {
    return nextTick(this.$, fn);
  };
}
function onApplyOptions(options, instance, publicThis) {
  instance.appContext.config.globalProperties.$applyOptions(
    options,
    instance,
    publicThis
  );
  const computedOptions = options.computed;
  if (computedOptions) {
    const keys = Object.keys(computedOptions);
    if (keys.length) {
      const ctx = instance.ctx;
      if (!ctx.$computedKeys) {
        ctx.$computedKeys = [];
      }
      ctx.$computedKeys.push(...keys);
    }
  }
  delete instance.ctx.$onApplyOptions;
}
function setRef$1(instance, isUnmount = false) {
  const {
    setupState,
    $templateRefs,
    $templateUniElementRefs,
    ctx: { $scope, $mpPlatform }
  } = instance;
  if (!$scope || !$templateRefs && !$templateUniElementRefs) {
    return;
  }
  if (isUnmount) {
    if ($mpPlatform !== "mp-alipay") {
      $templateRefs && $templateRefs.forEach(
        (templateRef) => setTemplateRef(templateRef, null, setupState)
      );
    }
    $templateUniElementRefs && $templateUniElementRefs.forEach(
      (templateRef) => setTemplateRef(templateRef, null, setupState)
    );
    return;
  }
  const check = $mpPlatform === "mp-baidu" || $mpPlatform === "mp-toutiao";
  const doSetByRefs = (refs) => {
    if (refs.length === 0) {
      return [];
    }
    const mpComponents = (
      // 字节小程序 selectAllComponents 可能返回 null
      // https://github.com/dcloudio/uni-app/issues/3954
      ($scope.selectAllComponents(".r") || []).concat(
        $scope.selectAllComponents(".r-i-f") || []
      )
    );
    return refs.filter((templateRef) => {
      const refValue = findComponentPublicInstance(mpComponents, templateRef.i);
      if (check && refValue === null) {
        return true;
      }
      setTemplateRef(templateRef, refValue, setupState);
      return false;
    });
  };
  const doSet = () => {
    if ($templateRefs) {
      const refs = doSetByRefs($templateRefs);
      if (refs.length && instance.proxy && instance.proxy.$scope) {
        instance.proxy.$scope.setData({ r1: 1 }, () => {
          doSetByRefs(refs);
        });
      }
    }
  };
  if ($mpPlatform !== "mp-alipay") {
    if ($scope._$setRef) {
      $scope._$setRef(doSet);
    } else {
      nextTick(instance, doSet);
    }
  }
  if ($templateUniElementRefs && $templateUniElementRefs.length) {
    nextTick(instance, () => {
      $templateUniElementRefs.forEach((templateRef) => {
        if (isArray$1(templateRef.v)) {
          templateRef.v.forEach((v) => {
            setTemplateRef(templateRef, v, setupState);
          });
        } else {
          setTemplateRef(templateRef, templateRef.v, setupState);
        }
      });
    });
  }
}
function toSkip(value) {
  if (isObject$2(value)) {
    markRaw(value);
  }
  return value;
}
function findComponentPublicInstance(mpComponents, id) {
  const mpInstance = mpComponents.find(
    (com) => com && (com.properties || com.props).uI === id
  );
  if (mpInstance) {
    const vm = mpInstance.$vm;
    if (vm) {
      return getExposeProxy(vm.$) || vm;
    }
    return toSkip(mpInstance);
  }
  return null;
}
function setTemplateRef({ r: r2, f: f2 }, refValue, setupState) {
  if (isFunction$1(r2)) {
    r2(refValue, {});
  } else {
    const _isString = isString$1(r2);
    const _isRef = isRef(r2);
    if (_isString || _isRef) {
      if (f2) {
        if (!_isRef) {
          return;
        }
        if (!isArray$1(r2.value)) {
          r2.value = [];
        }
        const existing = r2.value;
        if (existing.indexOf(refValue) === -1) {
          existing.push(refValue);
          if (!refValue) {
            return;
          }
          if (refValue.$) {
            onBeforeUnmount(() => remove(existing, refValue), refValue.$);
          }
        }
      } else if (_isString) {
        if (hasOwn(setupState, r2)) {
          setupState[r2] = refValue;
        }
      } else if (isRef(r2)) {
        r2.value = refValue;
      } else {
        warnRef(r2);
      }
    } else {
      warnRef(r2);
    }
  }
}
function warnRef(ref2) {
  warn("Invalid template ref type:", ref2, `(${typeof ref2})`);
}
const queuePostRenderEffect = queuePostFlushCb;
function mountComponent(initialVNode, options) {
  const instance = initialVNode.component = createComponentInstance(initialVNode, options.parentComponent, null);
  instance.renderer = options.mpType ? options.mpType : "component";
  {
    instance.ctx.$onApplyOptions = onApplyOptions;
    instance.ctx.$children = [];
  }
  if (options.mpType === "app") {
    instance.render = NOOP;
  }
  if (options.onBeforeSetup) {
    options.onBeforeSetup(instance, options);
  }
  {
    pushWarningContext(initialVNode);
    startMeasure(instance, `mount`);
  }
  {
    startMeasure(instance, `init`);
  }
  setupComponent(instance);
  {
    endMeasure(instance, `init`);
  }
  {
    if (options.parentComponent && instance.proxy) {
      options.parentComponent.ctx.$children.push(getExposeProxy(instance) || instance.proxy);
    }
  }
  setupRenderEffect(instance);
  {
    popWarningContext();
    endMeasure(instance, `mount`);
  }
  return instance.proxy;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
function clearTemplateRefs(templateRefs) {
  if (!templateRefs) {
    return [];
  }
  return templateRefs.filter((templateRef) => {
    const v = templateRef.v;
    if (v && typeof v === "object" && ["UNI-LOADING-ELEMENT", "UNI-CLOUD-DB-ELEMENT"].includes(v.nodeName)) {
      return true;
    }
    return false;
  });
}
function renderComponentRoot(instance) {
  const {
    type: Component2,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    data,
    setupState,
    ctx,
    uid: uid2,
    appContext: {
      app: {
        config: {
          globalProperties: { pruneComponentPropsCache: pruneComponentPropsCache2 }
        }
      }
    },
    inheritAttrs
  } = instance;
  instance.$uniElementIds = /* @__PURE__ */ new Map();
  instance.$templateRefs = clearTemplateRefs(
    instance.$templateRefs || []
  );
  instance.$templateUniElementRefs = clearTemplateRefs(
    instance.$templateUniElementRefs || []
  );
  instance.$templateUniElementStyles = {};
  instance.$ei = 0;
  pruneComponentPropsCache2(uid2);
  instance.__counter = instance.__counter === 0 ? 1 : 0;
  let result;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      fallthroughAttrs(inheritAttrs, props, propsOptions, attrs);
      const proxyToUse = withProxy || proxy;
      result = render.call(
        proxyToUse,
        proxyToUse,
        renderCache,
        props,
        setupState,
        data,
        ctx
      );
    } else {
      fallthroughAttrs(
        inheritAttrs,
        props,
        propsOptions,
        Component2.props ? attrs : getFunctionalFallthrough(attrs)
      );
      const render2 = Component2;
      result = render2.length > 1 ? render2(props, { attrs, slots, emit: emit2 }) : render2(
        props,
        null
        /* we know it doesn't need it */
      );
    }
  } catch (err) {
    handleError(err, instance, 1);
    result = false;
  }
  setRef$1(instance);
  setCurrentRenderingInstance(prev);
  return result;
}
function fallthroughAttrs(inheritAttrs, props, propsOptions, fallthroughAttrs2) {
  if (props && fallthroughAttrs2 && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs2).filter(
      (key) => key !== "class" && key !== "style"
    );
    if (!keys.length) {
      return;
    }
    if (propsOptions && keys.some(isModelListener)) {
      keys.forEach((key) => {
        if (!isModelListener(key) || !(key.slice(9) in propsOptions)) {
          props[key] = fallthroughAttrs2[key];
        }
      });
    } else {
      keys.forEach((key) => props[key] = fallthroughAttrs2[key]);
    }
  }
}
const updateComponentPreRender = (instance) => {
  pauseTracking();
  flushPreFlushCbs();
  resetTracking();
};
function componentUpdateScopedSlotsFn() {
  const scopedSlotsData = this.$scopedSlotsData;
  if (!scopedSlotsData || scopedSlotsData.length === 0) {
    return;
  }
  const mpInstance = this.ctx.$scope;
  const oldData = mpInstance.data;
  const diffData = /* @__PURE__ */ Object.create(null);
  scopedSlotsData.forEach(({ path, index: index2, data }) => {
    const oldScopedSlotData = getValueByDataPath(oldData, path);
    const diffPath = isString$1(index2) ? `${path}.${index2}` : `${path}[${index2}]`;
    if (typeof oldScopedSlotData === "undefined" || typeof oldScopedSlotData[index2] === "undefined") {
      diffData[diffPath] = data;
    } else {
      const diffScopedSlotData = diff(
        data,
        oldScopedSlotData[index2]
      );
      Object.keys(diffScopedSlotData).forEach((name) => {
        diffData[diffPath + "." + name] = diffScopedSlotData[name];
      });
    }
  });
  scopedSlotsData.length = 0;
  if (Object.keys(diffData).length) {
    mpInstance.setData(diffData);
  }
}
function toggleRecurse({ effect: effect2, update: update3 }, allowed) {
  effect2.allowRecurse = update3.allowRecurse = allowed;
}
function setupRenderEffect(instance) {
  const updateScopedSlots = componentUpdateScopedSlotsFn.bind(
    instance
  );
  instance.$updateScopedSlots = () => nextTick$1(() => queueJob(updateScopedSlots));
  const componentUpdateFn = () => {
    if (!instance.isMounted) {
      onBeforeUnmount(() => {
        setRef$1(instance, true);
      }, instance);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      {
        devtoolsComponentAdded(instance);
      }
    } else {
      const { next, bu, u } = instance;
      {
        pushWarningContext(next || instance.vnode);
      }
      toggleRecurse(instance, false);
      updateComponentPreRender();
      if (bu) {
        invokeArrayFns$1(bu);
      }
      toggleRecurse(instance, true);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      if (u) {
        queuePostRenderEffect(u);
      }
      {
        devtoolsComponentUpdated(instance);
      }
      {
        popWarningContext();
      }
    }
  };
  const effect2 = instance.effect = new ReactiveEffect(
    componentUpdateFn,
    NOOP,
    () => queueJob(update3),
    instance.scope
    // track it in component's effect scope
  );
  const update3 = instance.update = () => {
    if (effect2.dirty) {
      effect2.run();
    }
  };
  update3.id = instance.uid;
  toggleRecurse(instance, true);
  {
    effect2.onTrack = instance.rtc ? (e2) => invokeArrayFns$1(instance.rtc, e2) : void 0;
    effect2.onTrigger = instance.rtg ? (e2) => invokeArrayFns$1(instance.rtg, e2) : void 0;
    update3.ownerInstance = instance;
  }
  {
    update3();
  }
}
function unmountComponent(instance) {
  const { bum, scope, update: update3, um } = instance;
  if (bum) {
    invokeArrayFns$1(bum);
  }
  {
    const parentInstance = instance.parent;
    if (parentInstance) {
      const $children = parentInstance.ctx.$children;
      const target = getExposeProxy(instance) || instance.proxy;
      const index2 = $children.indexOf(target);
      if (index2 > -1) {
        $children.splice(index2, 1);
      }
    }
  }
  scope.stop();
  if (update3) {
    update3.active = false;
  }
  if (um) {
    queuePostRenderEffect(um);
  }
  queuePostRenderEffect(() => {
    instance.isUnmounted = true;
  });
  {
    devtoolsComponentRemoved(instance);
  }
}
const oldCreateApp = createAppAPI();
function getTarget() {
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  if (typeof my !== "undefined") {
    return my;
  }
}
function createVueApp(rootComponent, rootProps = null) {
  const target = getTarget();
  target.__VUE__ = true;
  {
    setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
  }
  const app = oldCreateApp(rootComponent, rootProps);
  const appContext = app._context;
  initAppConfig(appContext.config);
  const createVNode2 = (initialVNode) => {
    initialVNode.appContext = appContext;
    initialVNode.shapeFlag = 6;
    return initialVNode;
  };
  const createComponent2 = function createComponent22(initialVNode, options) {
    return mountComponent(createVNode2(initialVNode), options);
  };
  const destroyComponent = function destroyComponent2(component) {
    return component && unmountComponent(component.$);
  };
  app.mount = function mount() {
    rootComponent.render = NOOP;
    const instance = mountComponent(
      createVNode2({ type: rootComponent }),
      {
        mpType: "app",
        mpInstance: null,
        parentComponent: null,
        slots: [],
        props: null
      }
    );
    app._instance = instance.$;
    {
      devtoolsInitApp(app, version);
    }
    instance.$app = app;
    instance.$createComponent = createComponent2;
    instance.$destroyComponent = destroyComponent;
    appContext.$appInstance = instance;
    return instance;
  };
  app.unmount = function unmount() {
    warn(`Cannot unmount an app.`);
  };
  return app;
}
function injectLifecycleHook(name, hook, publicThis, instance) {
  if (isFunction$1(hook)) {
    injectHook(name, hook.bind(publicThis), instance);
  }
}
function initHooks$1(options, instance, publicThis) {
  const mpType = options.mpType || publicThis.$mpType;
  if (!mpType || mpType === "component" || // instance.renderer 标识页面是否作为组件渲染
  mpType === "page" && instance.renderer === "component") {
    return;
  }
  Object.keys(options).forEach((name) => {
    if (isUniLifecycleHook(name, options[name], false)) {
      const hooks = options[name];
      if (isArray$1(hooks)) {
        hooks.forEach((hook) => injectLifecycleHook(name, hook, publicThis, instance));
      } else {
        injectLifecycleHook(name, hooks, publicThis, instance);
      }
    }
  });
}
function applyOptions$2(options, instance, publicThis) {
  initHooks$1(options, instance, publicThis);
}
function set(target, key, val) {
  return target[key] = val;
}
function $callMethod(method, ...args) {
  const fn = this[method];
  if (fn) {
    return fn(...args);
  }
  console.error(`method ${method} not found`);
  return null;
}
function createErrorHandler(app) {
  const userErrorHandler = app.config.errorHandler;
  return function errorHandler(err, instance, info) {
    if (userErrorHandler) {
      userErrorHandler(err, instance, info);
    }
    const appInstance = app._instance;
    if (!appInstance || !appInstance.proxy) {
      throw err;
    }
    if (appInstance[ON_ERROR]) {
      {
        appInstance.proxy.$callHook(ON_ERROR, err);
      }
    } else {
      logError(err, info, instance ? instance.$.vnode : null, false);
    }
  };
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function initOptionMergeStrategies(optionMergeStrategies) {
  UniLifecycleHooks.forEach((name) => {
    optionMergeStrategies[name] = mergeAsArray;
  });
}
let realAtob;
const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const b64re = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
if (typeof atob !== "function") {
  realAtob = function(str) {
    str = String(str).replace(/[\t\n\f\r ]+/g, "");
    if (!b64re.test(str)) {
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }
    str += "==".slice(2 - (str.length & 3));
    var bitmap;
    var result = "";
    var r1;
    var r2;
    var i = 0;
    for (; i < str.length; ) {
      bitmap = b64.indexOf(str.charAt(i++)) << 18 | b64.indexOf(str.charAt(i++)) << 12 | (r1 = b64.indexOf(str.charAt(i++))) << 6 | (r2 = b64.indexOf(str.charAt(i++)));
      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
  };
} else {
  realAtob = atob;
}
function b64DecodeUnicode(str) {
  return decodeURIComponent(realAtob(str).split("").map(function(c2) {
    return "%" + ("00" + c2.charCodeAt(0).toString(16)).slice(-2);
  }).join(""));
}
function getCurrentUserInfo() {
  const token = index.getStorageSync("uni_id_token") || "";
  const tokenArr = token.split(".");
  if (!token || tokenArr.length !== 3) {
    return {
      uid: null,
      role: [],
      permission: [],
      tokenExpired: 0
    };
  }
  let userInfo;
  try {
    userInfo = JSON.parse(b64DecodeUnicode(tokenArr[1]));
  } catch (error) {
    throw new Error("获取当前用户信息出错，详细错误信息为：" + error.message);
  }
  userInfo.tokenExpired = userInfo.exp * 1e3;
  delete userInfo.exp;
  delete userInfo.iat;
  return userInfo;
}
function uniIdMixin(globalProperties) {
  globalProperties.uniIDHasRole = function(roleId) {
    const { role } = getCurrentUserInfo();
    return role.indexOf(roleId) > -1;
  };
  globalProperties.uniIDHasPermission = function(permissionId) {
    const { permission } = getCurrentUserInfo();
    return this.uniIDHasRole("admin") || permission.indexOf(permissionId) > -1;
  };
  globalProperties.uniIDTokenValid = function() {
    const { tokenExpired } = getCurrentUserInfo();
    return tokenExpired > Date.now();
  };
}
function initApp(app) {
  const appConfig = app.config;
  appConfig.errorHandler = invokeCreateErrorHandler(app, createErrorHandler);
  initOptionMergeStrategies(appConfig.optionMergeStrategies);
  const globalProperties = appConfig.globalProperties;
  {
    uniIdMixin(globalProperties);
  }
  {
    globalProperties.$set = set;
    globalProperties.$applyOptions = applyOptions$2;
    globalProperties.$callMethod = $callMethod;
  }
  {
    index.invokeCreateVueAppHook(app);
  }
}
const propsCaches = /* @__PURE__ */ Object.create(null);
function renderProps(props) {
  const { uid: uid2, __counter } = getCurrentInstance();
  const propsId = (propsCaches[uid2] || (propsCaches[uid2] = [])).push(guardReactiveProps(props)) - 1;
  return uid2 + "," + propsId + "," + __counter;
}
function pruneComponentPropsCache(uid2) {
  delete propsCaches[uid2];
}
function findComponentPropsData(up) {
  if (!up) {
    return;
  }
  const [uid2, propsId] = up.split(",");
  if (!propsCaches[uid2]) {
    return;
  }
  return propsCaches[uid2][parseInt(propsId)];
}
var plugin = {
  install(app) {
    initApp(app);
    app.config.globalProperties.pruneComponentPropsCache = pruneComponentPropsCache;
    const oldMount = app.mount;
    app.mount = function mount(rootContainer) {
      const instance = oldMount.call(app, rootContainer);
      const createApp2 = getCreateApp();
      if (createApp2) {
        createApp2(instance);
      } else {
        if (typeof createMiniProgramApp !== "undefined") {
          createMiniProgramApp(instance);
        }
      }
      return instance;
    };
  }
};
function getCreateApp() {
  const method = "createApp";
  if (typeof global !== "undefined" && typeof global[method] !== "undefined") {
    return global[method];
  } else if (typeof my !== "undefined") {
    return my[method];
  }
}
function stringifyStyle$1(value) {
  if (isString$1(value)) {
    return value;
  }
  return stringify(normalizeStyle$1(value));
}
function stringify(styles) {
  let ret = "";
  if (!styles || isString$1(styles)) {
    return ret;
  }
  for (const key in styles) {
    ret += `${key.startsWith(`--`) ? key : hyphenate$1(key)}:${styles[key]};`;
  }
  return ret;
}
function vOn(value, key) {
  const instance = getCurrentInstance();
  const ctx = instance.ctx;
  const extraKey = typeof key !== "undefined" && (ctx.$mpPlatform === "mp-weixin" || ctx.$mpPlatform === "mp-qq" || ctx.$mpPlatform === "mp-xhs") && (isString$1(key) || typeof key === "number") ? "_" + key : "";
  const name = "e" + instance.$ei++ + extraKey;
  const mpInstance = ctx.$scope;
  if (!value) {
    delete mpInstance[name];
    return name;
  }
  const existingInvoker = mpInstance[name];
  if (existingInvoker) {
    existingInvoker.value = value;
  } else {
    mpInstance[name] = createInvoker(value, instance);
  }
  return name;
}
function createInvoker(initialValue, instance) {
  const invoker = (e2) => {
    patchMPEvent(e2);
    let args = [e2];
    if (instance && instance.ctx.$getTriggerEventDetail) {
      if (typeof e2.detail === "number") {
        e2.detail = instance.ctx.$getTriggerEventDetail(e2.detail);
      }
    }
    if (e2.detail && e2.detail.__args__) {
      args = e2.detail.__args__;
    }
    const eventValue = invoker.value;
    const invoke = () => callWithAsyncErrorHandling(patchStopImmediatePropagation(e2, eventValue), instance, 5, args);
    const eventTarget = e2.target;
    const eventSync = eventTarget ? eventTarget.dataset ? String(eventTarget.dataset.eventsync) === "true" : false : false;
    if (bubbles.includes(e2.type) && !eventSync) {
      setTimeout(invoke);
    } else {
      const res = invoke();
      if (e2.type === "input" && (isArray$1(res) || isPromise$2(res))) {
        return;
      }
      return res;
    }
  };
  invoker.value = initialValue;
  return invoker;
}
const bubbles = [
  // touch事件暂不做延迟，否则在 Android 上会影响性能，比如一些拖拽跟手手势等
  // 'touchstart',
  // 'touchmove',
  // 'touchcancel',
  // 'touchend',
  "tap",
  "longpress",
  "longtap",
  "transitionend",
  "animationstart",
  "animationiteration",
  "animationend",
  "touchforcechange"
];
function patchMPEvent(event, instance) {
  if (event.type && event.target) {
    event.preventDefault = NOOP;
    event.stopPropagation = NOOP;
    event.stopImmediatePropagation = NOOP;
    if (!hasOwn(event, "detail")) {
      event.detail = {};
    }
    if (hasOwn(event, "markerId")) {
      event.detail = typeof event.detail === "object" ? event.detail : {};
      event.detail.markerId = event.markerId;
    }
    if (isPlainObject(event.detail) && hasOwn(event.detail, "checked") && !hasOwn(event.detail, "value")) {
      event.detail.value = event.detail.checked;
    }
    if (isPlainObject(event.detail)) {
      event.target = extend({}, event.target, event.detail);
    }
  }
}
function patchStopImmediatePropagation(e2, value) {
  if (isArray$1(value)) {
    const originalStop = e2.stopImmediatePropagation;
    e2.stopImmediatePropagation = () => {
      originalStop && originalStop.call(e2);
      e2._stopped = true;
    };
    return value.map((fn) => (e3) => !e3._stopped && fn(e3));
  } else {
    return value;
  }
}
function vFor(source, renderItem) {
  let ret;
  if (isArray$1(source) || isString$1(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, i);
    }
  } else if (typeof source === "number") {
    if (!Number.isInteger(source)) {
      warn(`The v-for range expect an integer value but got ${source}.`);
      return [];
    }
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, i);
    }
  } else if (isObject$2(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i) => renderItem(item, i, i));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
function renderSlot(name, props = {}, key) {
  const instance = getCurrentInstance();
  const { parent, isMounted, ctx: { $scope } } = instance;
  const vueIds = ($scope.properties || $scope.props).uI;
  if (!vueIds) {
    return;
  }
  if (!parent && !isMounted) {
    onMounted(() => {
      renderSlot(name, props, key);
    }, instance);
    return;
  }
  const invoker = findScopedSlotInvoker(vueIds, instance);
  if (invoker) {
    invoker(name, props, key);
  }
}
function findScopedSlotInvoker(vueId, instance) {
  let parent = instance.parent;
  while (parent) {
    const invokers = parent.$ssi;
    if (invokers && invokers[vueId]) {
      return invokers[vueId];
    }
    parent = parent.parent;
  }
}
function withScopedSlot(fn, { name, path, vueId }) {
  const instance = getCurrentInstance();
  fn.path = path;
  const scopedSlots = instance.$ssi || (instance.$ssi = {});
  const invoker = scopedSlots[vueId] || (scopedSlots[vueId] = createScopedSlotInvoker(instance));
  if (!invoker.slots[name]) {
    invoker.slots[name] = {
      fn
    };
  } else {
    invoker.slots[name].fn = fn;
  }
  return getValueByDataPath(instance.ctx.$scope.data, path);
}
function createScopedSlotInvoker(instance) {
  const invoker = (slotName, args, index2) => {
    const slot = invoker.slots[slotName];
    if (!slot) {
      return;
    }
    const hasIndex = typeof index2 !== "undefined";
    index2 = index2 || 0;
    const prevInstance = setCurrentRenderingInstance(instance);
    const data = slot.fn(args, slotName + (hasIndex ? "-" + index2 : ""), index2);
    const path = slot.fn.path;
    setCurrentRenderingInstance(prevInstance);
    (instance.$scopedSlotsData || (instance.$scopedSlotsData = [])).push({
      path,
      index: index2,
      data
    });
    instance.$updateScopedSlots();
  };
  invoker.slots = {};
  return invoker;
}
function setRef(ref2, id, opts = {}) {
  const { $templateRefs } = getCurrentInstance();
  $templateRefs.push({ i: id, r: ref2, k: opts.k, f: opts.f });
}
const o = (value, key) => vOn(value, key);
const f = (source, renderItem) => vFor(source, renderItem);
const r = (name, props, key) => renderSlot(name, props, key);
const w = (fn, options) => withScopedSlot(fn, options);
const s = (value) => stringifyStyle$1(value);
const e = (target, ...sources) => extend(target, ...sources);
const n = (value) => normalizeClass$1(value);
const t = (val) => toDisplayString(val);
const p = (props) => renderProps(props);
const sr = (ref2, id, opts) => setRef(ref2, id, opts);
function createApp$1(rootComponent, rootProps = null) {
  rootComponent && (rootComponent.mpType = "app");
  return createVueApp(rootComponent, rootProps).use(plugin);
}
const createSSRApp = createApp$1;
function getLocaleLanguage$1() {
  var _a;
  let localeLanguage = "";
  {
    const appBaseInfo = ((_a = wx.getAppBaseInfo) === null || _a === void 0 ? void 0 : _a.call(wx)) || wx.getSystemInfoSync();
    const language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale(language) || LOCALE_EN;
  }
  return localeLanguage;
}
function validateProtocolFail(name, msg) {
  console.warn(`${name}: ${msg}`);
}
function validateProtocol(name, data, protocol, onFail) {
  if (!onFail) {
    onFail = validateProtocolFail;
  }
  for (const key in protocol) {
    const errMsg = validateProp(key, data[key], protocol[key], !hasOwn(data, key));
    if (isString$1(errMsg)) {
      onFail(name, errMsg);
    }
  }
}
function validateProtocols(name, args, protocol, onFail) {
  if (!protocol) {
    return;
  }
  if (!isArray$1(protocol)) {
    return validateProtocol(name, args[0] || /* @__PURE__ */ Object.create(null), protocol, onFail);
  }
  const len = protocol.length;
  const argsLen = args.length;
  for (let i = 0; i < len; i++) {
    const opts = protocol[i];
    const data = /* @__PURE__ */ Object.create(null);
    if (argsLen > i) {
      data[opts.name] = args[i];
    }
    validateProtocol(name, data, { [opts.name]: opts }, onFail);
  }
}
function validateProp(name, value, prop, isAbsent) {
  if (!isPlainObject(prop)) {
    prop = { type: prop };
  }
  const { type, required, validator } = prop;
  if (required && isAbsent) {
    return 'Missing required args: "' + name + '"';
  }
  if (value == null && !required) {
    return;
  }
  if (type != null) {
    let isValid = false;
    const types = isArray$1(type) ? type : [type];
    const expectedTypes = [];
    for (let i = 0; i < types.length && !isValid; i++) {
      const { valid, expectedType } = assertType(value, types[i]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      return getInvalidTypeMessage(name, value, expectedTypes);
    }
  }
  if (validator) {
    return validator(value);
  }
}
const isSimpleType = /* @__PURE__ */ makeMap("String,Number,Boolean,Function,Symbol");
function assertType(value, type) {
  let valid;
  const expectedType = getType(type);
  if (isSimpleType(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject$2(value);
  } else if (expectedType === "Array") {
    valid = isArray$1(value);
  } else {
    {
      valid = value instanceof type;
    }
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage(name, value, expectedTypes) {
  let message = `Invalid args: type check failed for args "${name}". Expected ${expectedTypes.map(capitalize).join(", ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue(value, expectedType);
  const receivedValue = styleValue(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean$1(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : "";
}
function styleValue(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean$1(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
function tryCatch(fn) {
  return function() {
    try {
      return fn.apply(fn, arguments);
    } catch (e2) {
      console.error(e2);
    }
  };
}
let invokeCallbackId = 1;
const invokeCallbacks = {};
function addInvokeCallback(id, name, callback, keepAlive = false) {
  invokeCallbacks[id] = {
    name,
    keepAlive,
    callback
  };
  return id;
}
function invokeCallback(id, res, extras) {
  if (typeof id === "number") {
    const opts = invokeCallbacks[id];
    if (opts) {
      if (!opts.keepAlive) {
        delete invokeCallbacks[id];
      }
      return opts.callback(res, extras);
    }
  }
  return res;
}
const API_SUCCESS = "success";
const API_FAIL = "fail";
const API_COMPLETE = "complete";
function getApiCallbacks(args) {
  const apiCallbacks = {};
  for (const name in args) {
    const fn = args[name];
    if (isFunction$1(fn)) {
      apiCallbacks[name] = tryCatch(fn);
      delete args[name];
    }
  }
  return apiCallbacks;
}
function normalizeErrMsg(errMsg, name) {
  if (!errMsg || errMsg.indexOf(":fail") === -1) {
    return name + ":ok";
  }
  return name + errMsg.substring(errMsg.indexOf(":fail"));
}
function createAsyncApiCallback(name, args = {}, { beforeAll, beforeSuccess } = {}) {
  if (!isPlainObject(args)) {
    args = {};
  }
  const { success, fail, complete } = getApiCallbacks(args);
  const hasSuccess = isFunction$1(success);
  const hasFail = isFunction$1(fail);
  const hasComplete = isFunction$1(complete);
  const callbackId = invokeCallbackId++;
  addInvokeCallback(callbackId, name, (res) => {
    res = res || {};
    res.errMsg = normalizeErrMsg(res.errMsg, name);
    isFunction$1(beforeAll) && beforeAll(res);
    if (res.errMsg === name + ":ok") {
      isFunction$1(beforeSuccess) && beforeSuccess(res, args);
      hasSuccess && success(res);
    } else {
      hasFail && fail(res);
    }
    hasComplete && complete(res);
  });
  return callbackId;
}
const HOOK_SUCCESS = "success";
const HOOK_FAIL = "fail";
const HOOK_COMPLETE = "complete";
const globalInterceptors = {};
const scopedInterceptors = {};
function wrapperHook(hook, params) {
  return function(data) {
    return hook(data, params) || data;
  };
}
function queue(hooks, data, params) {
  let promise = false;
  for (let i = 0; i < hooks.length; i++) {
    const hook = hooks[i];
    if (promise) {
      promise = Promise.resolve(wrapperHook(hook, params));
    } else {
      const res = hook(data, params);
      if (isPromise$2(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then() {
          },
          catch() {
          }
        };
      }
    }
  }
  return promise || {
    then(callback) {
      return callback(data);
    },
    catch() {
    }
  };
}
function wrapperOptions(interceptors2, options = {}) {
  [HOOK_SUCCESS, HOOK_FAIL, HOOK_COMPLETE].forEach((name) => {
    const hooks = interceptors2[name];
    if (!isArray$1(hooks)) {
      return;
    }
    const oldCallback = options[name];
    options[name] = function callbackInterceptor(res) {
      queue(hooks, res, options).then((res2) => {
        return isFunction$1(oldCallback) && oldCallback(res2) || res2;
      });
    };
  });
  return options;
}
function wrapperReturnValue(method, returnValue) {
  const returnValueHooks = [];
  if (isArray$1(globalInterceptors.returnValue)) {
    returnValueHooks.push(...globalInterceptors.returnValue);
  }
  const interceptor = scopedInterceptors[method];
  if (interceptor && isArray$1(interceptor.returnValue)) {
    returnValueHooks.push(...interceptor.returnValue);
  }
  returnValueHooks.forEach((hook) => {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}
function getApiInterceptorHooks(method) {
  const interceptor = /* @__PURE__ */ Object.create(null);
  Object.keys(globalInterceptors).forEach((hook) => {
    if (hook !== "returnValue") {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  const scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach((hook) => {
      if (hook !== "returnValue") {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}
function invokeApi(method, api, options, params) {
  const interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (isArray$1(interceptor.invoke)) {
      const res = queue(interceptor.invoke, options);
      return res.then((options2) => {
        return api(wrapperOptions(getApiInterceptorHooks(method), options2), ...params);
      });
    } else {
      return api(wrapperOptions(interceptor, options), ...params);
    }
  }
  return api(options, ...params);
}
function hasCallback(args) {
  if (isPlainObject(args) && [API_SUCCESS, API_FAIL, API_COMPLETE].find((cb) => isFunction$1(args[cb]))) {
    return true;
  }
  return false;
}
function handlePromise(promise) {
  return promise;
}
function promisify$1(name, fn) {
  return (args = {}, ...rest) => {
    if (hasCallback(args)) {
      return wrapperReturnValue(name, invokeApi(name, fn, extend({}, args), rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve2, reject) => {
      invokeApi(name, fn, extend({}, args, { success: resolve2, fail: reject }), rest);
    })));
  };
}
function formatApiArgs(args, options) {
  args[0];
  {
    return;
  }
}
function invokeSuccess(id, name, res) {
  const result = {
    errMsg: name + ":ok"
  };
  return invokeCallback(id, extend(res || {}, result));
}
function invokeFail(id, name, errMsg, errRes = {}) {
  const errMsgPrefix = name + ":fail";
  let apiErrMsg = "";
  if (!errMsg) {
    apiErrMsg = errMsgPrefix;
  } else if (errMsg.indexOf(errMsgPrefix) === 0) {
    apiErrMsg = errMsg;
  } else {
    apiErrMsg = errMsgPrefix + " " + errMsg;
  }
  {
    delete errRes.errCode;
  }
  let res = extend({ errMsg: apiErrMsg }, errRes);
  return invokeCallback(id, res);
}
function beforeInvokeApi(name, args, protocol, options) {
  {
    validateProtocols(name, args, protocol);
  }
  const errMsg = formatApiArgs(args);
  if (errMsg) {
    return errMsg;
  }
}
function parseErrMsg(errMsg) {
  if (!errMsg || isString$1(errMsg)) {
    return errMsg;
  }
  if (errMsg.stack) {
    if (typeof globalThis === "undefined" || !globalThis.harmonyChannel) {
      console.error(errMsg.message + "\n" + errMsg.stack);
    }
    return errMsg.message;
  }
  return errMsg;
}
function wrapperTaskApi(name, fn, protocol, options) {
  return (args) => {
    const id = createAsyncApiCallback(name, args, options);
    const errMsg = beforeInvokeApi(name, [args], protocol);
    if (errMsg) {
      return invokeFail(id, name, errMsg);
    }
    return fn(args, {
      resolve: (res) => invokeSuccess(id, name, res),
      reject: (errMsg2, errRes) => invokeFail(id, name, parseErrMsg(errMsg2), errRes)
    });
  };
}
function wrapperSyncApi(name, fn, protocol, options) {
  return (...args) => {
    const errMsg = beforeInvokeApi(name, args, protocol);
    if (errMsg) {
      throw new Error(errMsg);
    }
    return fn.apply(null, args);
  };
}
function wrapperAsyncApi(name, fn, protocol, options) {
  return wrapperTaskApi(name, fn, protocol, options);
}
function defineSyncApi(name, fn, protocol, options) {
  return wrapperSyncApi(name, fn, protocol);
}
function defineAsyncApi(name, fn, protocol, options) {
  return promisify$1(name, wrapperAsyncApi(name, fn, protocol, options));
}
const API_UPX2PX = "upx2px";
const Upx2pxProtocol = [
  {
    name: "upx",
    type: [Number, String],
    required: true
  }
];
const EPS = 1e-4;
const BASE_DEVICE_WIDTH = 750;
let isIOS = false;
let deviceWidth = 0;
let deviceDPR = 0;
function checkDeviceWidth() {
  var _a, _b;
  let windowWidth, pixelRatio, platform2;
  {
    const windowInfo = ((_a = wx.getWindowInfo) === null || _a === void 0 ? void 0 : _a.call(wx)) || wx.getSystemInfoSync();
    const deviceInfo = ((_b = wx.getDeviceInfo) === null || _b === void 0 ? void 0 : _b.call(wx)) || wx.getSystemInfoSync();
    windowWidth = windowInfo.windowWidth;
    pixelRatio = windowInfo.pixelRatio;
    platform2 = deviceInfo.platform;
  }
  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform2 === "ios";
}
const upx2px = defineSyncApi(API_UPX2PX, (number, newDeviceWidth) => {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }
  number = Number(number);
  if (number === 0) {
    return 0;
  }
  let width = newDeviceWidth || deviceWidth;
  let result = number / BASE_DEVICE_WIDTH * width;
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      result = 1;
    } else {
      result = 0.5;
    }
  }
  return number < 0 ? -result : result;
}, Upx2pxProtocol);
function __f__(type, filename, ...args) {
  if (filename) {
    args.push(filename);
  }
  console[type].apply(console, args);
}
const API_ADD_INTERCEPTOR = "addInterceptor";
const API_REMOVE_INTERCEPTOR = "removeInterceptor";
const AddInterceptorProtocol = [
  {
    name: "method",
    type: [String, Object],
    required: true
  }
];
const RemoveInterceptorProtocol = AddInterceptorProtocol;
function mergeInterceptorHook(interceptors2, interceptor) {
  Object.keys(interceptor).forEach((hook) => {
    if (isFunction$1(interceptor[hook])) {
      interceptors2[hook] = mergeHook(interceptors2[hook], interceptor[hook]);
    }
  });
}
function removeInterceptorHook(interceptors2, interceptor) {
  if (!interceptors2 || !interceptor) {
    return;
  }
  Object.keys(interceptor).forEach((name) => {
    const hooks = interceptors2[name];
    const hook = interceptor[name];
    if (isArray$1(hooks) && isFunction$1(hook)) {
      remove(hooks, hook);
    }
  });
}
function mergeHook(parentVal, childVal) {
  const res = childVal ? parentVal ? parentVal.concat(childVal) : isArray$1(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks) {
  const res = [];
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}
const addInterceptor = defineSyncApi(API_ADD_INTERCEPTOR, (method, interceptor) => {
  if (isString$1(method) && isPlainObject(interceptor)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), interceptor);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}, AddInterceptorProtocol);
const removeInterceptor = defineSyncApi(API_REMOVE_INTERCEPTOR, (method, interceptor) => {
  if (isString$1(method)) {
    if (isPlainObject(interceptor)) {
      removeInterceptorHook(scopedInterceptors[method], interceptor);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}, RemoveInterceptorProtocol);
const interceptors = {};
const API_ON = "$on";
const OnProtocol = [
  {
    name: "event",
    type: String,
    required: true
  },
  {
    name: "callback",
    type: Function,
    required: true
  }
];
const API_ONCE = "$once";
const OnceProtocol = OnProtocol;
const API_OFF = "$off";
const OffProtocol = [
  {
    name: "event",
    type: [String, Array]
  },
  {
    name: "callback",
    type: [Function, Number]
  }
];
const API_EMIT = "$emit";
const EmitProtocol = [
  {
    name: "event",
    type: String,
    required: true
  }
];
class EventBus {
  constructor() {
    this.$emitter = new E$1();
  }
  on(name, callback) {
    return this.$emitter.on(name, callback);
  }
  once(name, callback) {
    return this.$emitter.once(name, callback);
  }
  off(name, callback) {
    if (!name) {
      this.$emitter.e = {};
      return;
    }
    this.$emitter.off(name, callback);
  }
  emit(name, ...args) {
    this.$emitter.emit(name, ...args);
  }
}
const eventBus = new EventBus();
const $on = defineSyncApi(API_ON, (name, callback) => {
  eventBus.on(name, callback);
  return () => eventBus.off(name, callback);
}, OnProtocol);
const $once = defineSyncApi(API_ONCE, (name, callback) => {
  eventBus.once(name, callback);
  return () => eventBus.off(name, callback);
}, OnceProtocol);
const $off = defineSyncApi(API_OFF, (name, callback) => {
  if (!isArray$1(name))
    name = name ? [name] : [];
  name.forEach((n2) => {
    eventBus.off(n2, callback);
  });
}, OffProtocol);
const $emit = defineSyncApi(API_EMIT, (name, ...args) => {
  eventBus.emit(name, ...args);
}, EmitProtocol);
let cid;
let cidErrMsg;
let enabled;
function normalizePushMessage(message) {
  try {
    return JSON.parse(message);
  } catch (e2) {
  }
  return message;
}
function invokePushCallback(args) {
  if (args.type === "enabled") {
    enabled = true;
  } else if (args.type === "clientId") {
    cid = args.cid;
    cidErrMsg = args.errMsg;
    invokeGetPushCidCallbacks(cid, args.errMsg);
  } else if (args.type === "pushMsg") {
    const message = {
      type: "receive",
      data: normalizePushMessage(args.message)
    };
    for (let i = 0; i < onPushMessageCallbacks.length; i++) {
      const callback = onPushMessageCallbacks[i];
      callback(message);
      if (message.stopped) {
        break;
      }
    }
  } else if (args.type === "click") {
    onPushMessageCallbacks.forEach((callback) => {
      callback({
        type: "click",
        data: normalizePushMessage(args.message)
      });
    });
  }
}
const getPushCidCallbacks = [];
function invokeGetPushCidCallbacks(cid2, errMsg) {
  getPushCidCallbacks.forEach((callback) => {
    callback(cid2, errMsg);
  });
  getPushCidCallbacks.length = 0;
}
const API_GET_PUSH_CLIENT_ID = "getPushClientId";
const getPushClientId = defineAsyncApi(API_GET_PUSH_CLIENT_ID, (_, { resolve: resolve2, reject }) => {
  Promise.resolve().then(() => {
    if (typeof enabled === "undefined") {
      enabled = false;
      cid = "";
      cidErrMsg = "uniPush is not enabled";
    }
    getPushCidCallbacks.push((cid2, errMsg) => {
      if (cid2) {
        resolve2({ cid: cid2 });
      } else {
        reject(errMsg);
      }
    });
    if (typeof cid !== "undefined") {
      invokeGetPushCidCallbacks(cid, cidErrMsg);
    }
  });
});
const onPushMessageCallbacks = [];
const onPushMessage = (fn) => {
  if (onPushMessageCallbacks.indexOf(fn) === -1) {
    onPushMessageCallbacks.push(fn);
  }
};
const offPushMessage = (fn) => {
  if (!fn) {
    onPushMessageCallbacks.length = 0;
  } else {
    const index2 = onPushMessageCallbacks.indexOf(fn);
    if (index2 > -1) {
      onPushMessageCallbacks.splice(index2, 1);
    }
  }
};
const SYNC_API_RE = /^\$|__f__|getLocale|setLocale|sendNativeEvent|restoreGlobal|requireGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|rpx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64|getDeviceInfo|getAppBaseInfo|getWindowInfo|getSystemSetting|getAppAuthorizeSetting/;
const CONTEXT_API_RE = /^create|Manager$/;
const CONTEXT_API_RE_EXC = ["createBLEConnection"];
const TASK_APIS = ["request", "downloadFile", "uploadFile", "connectSocket"];
const ASYNC_API = ["createBLEConnection"];
const CALLBACK_API_RE = /^on|^off/;
function isContextApi(name) {
  return CONTEXT_API_RE.test(name) && CONTEXT_API_RE_EXC.indexOf(name) === -1;
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name) && ASYNC_API.indexOf(name) === -1;
}
function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== "onPush";
}
function isTaskApi(name) {
  return TASK_APIS.indexOf(name) !== -1;
}
function shouldPromise(name) {
  if (isContextApi(name) || isSyncApi(name) || isCallbackApi(name)) {
    return false;
  }
  return true;
}
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function(onfinally) {
    const promise = this.constructor;
    return this.then((value) => promise.resolve(onfinally && onfinally()).then(() => value), (reason) => promise.resolve(onfinally && onfinally()).then(() => {
      throw reason;
    }));
  };
}
function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  if (!isFunction$1(api)) {
    return api;
  }
  return function promiseApi(options = {}, ...rest) {
    if (isFunction$1(options.success) || isFunction$1(options.fail) || isFunction$1(options.complete)) {
      return wrapperReturnValue(name, invokeApi(name, api, extend({}, options), rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve2, reject) => {
      invokeApi(name, api, extend({}, options, {
        success: resolve2,
        fail: reject
      }), rest);
    })));
  };
}
const CALLBACKS = ["success", "fail", "cancel", "complete"];
function initWrapper(protocols2) {
  function processCallback(methodName, method, returnValue) {
    return function(res) {
      return method(processReturnValue(methodName, res, returnValue));
    };
  }
  function processArgs(methodName, fromArgs, argsOption = {}, returnValue = {}, keepFromArgs = false) {
    if (isPlainObject(fromArgs)) {
      const toArgs = keepFromArgs === true ? fromArgs : {};
      if (isFunction$1(argsOption)) {
        argsOption = argsOption(fromArgs, toArgs) || {};
      }
      for (const key in fromArgs) {
        if (hasOwn(argsOption, key)) {
          let keyOption = argsOption[key];
          if (isFunction$1(keyOption)) {
            keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
          }
          if (!keyOption) {
            console.warn(`微信小程序 ${methodName} 暂不支持 ${key}`);
          } else if (isString$1(keyOption)) {
            toArgs[keyOption] = fromArgs[key];
          } else if (isPlainObject(keyOption)) {
            toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
          }
        } else if (CALLBACKS.indexOf(key) !== -1) {
          const callback = fromArgs[key];
          if (isFunction$1(callback)) {
            toArgs[key] = processCallback(methodName, callback, returnValue);
          }
        } else {
          if (!keepFromArgs && !hasOwn(toArgs, key)) {
            toArgs[key] = fromArgs[key];
          }
        }
      }
      return toArgs;
    } else if (isFunction$1(fromArgs)) {
      if (isFunction$1(argsOption)) {
        argsOption(fromArgs, {});
      }
      fromArgs = processCallback(methodName, fromArgs, returnValue);
    }
    return fromArgs;
  }
  function processReturnValue(methodName, res, returnValue, keepReturnValue = false) {
    if (isFunction$1(protocols2.returnValue)) {
      res = protocols2.returnValue(methodName, res);
    }
    const realKeepReturnValue = keepReturnValue || false;
    return processArgs(methodName, res, returnValue, {}, realKeepReturnValue);
  }
  return function wrapper(methodName, method) {
    const hasProtocol = hasOwn(protocols2, methodName);
    if (!hasProtocol && typeof wx[methodName] !== "function") {
      return method;
    }
    const needWrapper = hasProtocol || isFunction$1(protocols2.returnValue) || isContextApi(methodName) || isTaskApi(methodName);
    const hasMethod = hasProtocol || isFunction$1(method);
    if (!hasProtocol && !method) {
      return function() {
        console.error(`微信小程序 暂不支持${methodName}`);
      };
    }
    if (!needWrapper || !hasMethod) {
      return method;
    }
    const protocol = protocols2[methodName];
    return function(arg1, arg2) {
      let options = protocol || {};
      if (isFunction$1(protocol)) {
        options = protocol(arg1);
      }
      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);
      const args = [arg1];
      if (typeof arg2 !== "undefined") {
        args.push(arg2);
      }
      const returnValue = wx[options.name || methodName].apply(wx, args);
      if (isContextApi(methodName) || isTaskApi(methodName)) {
        if (returnValue && !returnValue.__v_skip) {
          returnValue.__v_skip = true;
        }
      }
      if (isSyncApi(methodName)) {
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  };
}
const getLocale = () => {
  const app = isFunction$1(getApp) && getApp({ allowDefault: true });
  if (app && app.$vm) {
    return app.$vm.$locale;
  }
  return getLocaleLanguage$1();
};
const setLocale = (locale) => {
  const app = isFunction$1(getApp) && getApp();
  if (!app) {
    return false;
  }
  const oldLocale = app.$vm.$locale;
  if (oldLocale !== locale) {
    app.$vm.$locale = locale;
    onLocaleChangeCallbacks.forEach((fn) => fn({ locale }));
    return true;
  }
  return false;
};
const onLocaleChangeCallbacks = [];
const onLocaleChange = (fn) => {
  if (onLocaleChangeCallbacks.indexOf(fn) === -1) {
    onLocaleChangeCallbacks.push(fn);
  }
};
if (typeof global !== "undefined") {
  global.getLocale = getLocale;
}
const UUID_KEY = "__DC_STAT_UUID";
let deviceId;
function useDeviceId(global2 = wx) {
  return function addDeviceId(_, toRes) {
    deviceId = deviceId || global2.getStorageSync(UUID_KEY);
    if (!deviceId) {
      deviceId = Date.now() + "" + Math.floor(Math.random() * 1e7);
      wx.setStorage({
        key: UUID_KEY,
        data: deviceId
      });
    }
    toRes.deviceId = deviceId;
  };
}
function addSafeAreaInsets(fromRes, toRes) {
  if (fromRes.safeArea) {
    const safeArea = fromRes.safeArea;
    toRes.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: fromRes.windowWidth - safeArea.right,
      bottom: fromRes.screenHeight - safeArea.bottom
    };
  }
}
function getOSInfo(system, platform2) {
  let osName = "";
  let osVersion = "";
  if (platform2 && false) {
    osName = platform2;
    osVersion = system;
    system = `${osName} ${osVersion}`;
  } else {
    {
      osName = platform2;
    }
    osVersion = system.split(" ")[1] || "";
  }
  osName = osName.toLowerCase();
  switch (osName) {
    case "harmony":
    case "ohos":
    case "openharmonyos":
    case "openharmony":
      osName = "harmonyos";
      break;
    case "iphone os":
      osName = "ios";
      break;
    case "mac":
    case "darwin":
      osName = "macos";
      break;
    case "windows_nt":
      osName = "windows";
      break;
  }
  return {
    osName,
    osVersion,
    system
  };
}
function getPlatform(platform2) {
  platform2 = platform2.toLowerCase();
  {
    if (platform2 === "ohos") {
      platform2 = "harmonyos";
    }
  }
  return platform2;
}
function populateParameters(fromRes, toRes) {
  const { brand = "", model = "", system = "", language = "", theme, version: version2, platform: platform2, fontSizeSetting, SDKVersion, pixelRatio, deviceOrientation } = fromRes;
  const { osName, osVersion, system: updatedSystem } = getOSInfo(system, platform2);
  let hostVersion = version2;
  let deviceType = getGetDeviceType(fromRes, model);
  let deviceBrand = getDeviceBrand(brand);
  let _hostName = getHostName(fromRes);
  let _deviceOrientation = deviceOrientation;
  let _devicePixelRatio = pixelRatio;
  let _SDKVersion = SDKVersion;
  const hostLanguage = (language || "").replace(/_/g, "-");
  const parameters = {
    appId: "__UNI__E50AF23",
    appName: "fuu-run-uni",
    appVersion: "1.0.0",
    appVersionCode: "100",
    appLanguage: getAppLanguage(hostLanguage),
    uniCompileVersion: "5.15",
    uniCompilerVersion: "5.15",
    uniRuntimeVersion: "5.15",
    uniPlatform: "mp-weixin",
    deviceBrand,
    deviceModel: model,
    deviceType,
    devicePixelRatio: _devicePixelRatio,
    deviceOrientation: _deviceOrientation,
    osName,
    osVersion,
    hostTheme: theme,
    hostVersion,
    hostLanguage,
    hostName: _hostName,
    hostSDKVersion: _SDKVersion,
    hostFontSizeSetting: fontSizeSetting,
    windowTop: 0,
    windowBottom: 0,
    platform: getPlatform(platform2),
    system: updatedSystem,
    // TODO
    osLanguage: void 0,
    osTheme: void 0,
    ua: void 0,
    hostPackageName: void 0,
    browserName: void 0,
    browserVersion: void 0,
    isUniAppX: false
  };
  extend(toRes, parameters);
}
function getGetDeviceType(fromRes, model) {
  const platform2 = fromRes.platform || "";
  let deviceType = fromRes.deviceType || "phone";
  {
    const deviceTypeMaps = {
      ipad: "pad",
      windows: "pc",
      mac: "pc",
      linux: "pc",
      pc: "pc"
    };
    const deviceTypeMapsKeys = Object.keys(deviceTypeMaps);
    const _model = model.toLowerCase();
    for (let index2 = 0; index2 < deviceTypeMapsKeys.length; index2++) {
      const _m = deviceTypeMapsKeys[index2];
      if (_model.indexOf(_m) !== -1) {
        deviceType = deviceTypeMaps[_m];
        break;
      }
    }
  }
  {
    if (platform2 === "ohos_pc") {
      deviceType = "pc";
    }
  }
  return deviceType;
}
function getDeviceBrand(brand) {
  let deviceBrand = brand;
  if (deviceBrand) {
    deviceBrand = deviceBrand.toLowerCase();
  }
  return deviceBrand;
}
function getAppLanguage(defaultLanguage) {
  return getLocale ? getLocale() : defaultLanguage;
}
function getHostName(fromRes) {
  const _platform = "WeChat";
  let _hostName = fromRes.hostName || _platform;
  {
    if (fromRes.environment) {
      _hostName = fromRes.environment;
    } else if (fromRes.host && fromRes.host.env) {
      _hostName = fromRes.host.env;
    }
  }
  return _hostName;
}
const getSystemInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    useDeviceId()(fromRes, toRes);
    populateParameters(fromRes, toRes);
  }
};
const getSystemInfoSync = getSystemInfo;
const redirectTo = {};
const previewImage = {
  args(fromArgs, toArgs) {
    let currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    const urls = fromArgs.urls;
    if (!isArray$1(urls)) {
      return;
    }
    const len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      toArgs.current = urls[currentIndex];
      toArgs.urls = urls.filter((item, index2) => index2 < currentIndex ? item !== urls[currentIndex] : true);
    } else {
      toArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false
    };
  }
};
const showActionSheet = {
  args(fromArgs, toArgs) {
    toArgs.alertText = fromArgs.title;
  }
};
const getDeviceInfo = {
  returnValue: (fromRes, toRes) => {
    const { brand, model, system = "", platform: platform2 = "" } = fromRes;
    let deviceType = getGetDeviceType(fromRes, model);
    let deviceBrand = getDeviceBrand(brand);
    useDeviceId()(fromRes, toRes);
    const { osName, osVersion } = getOSInfo(system, platform2);
    toRes = extend(toRes, {
      deviceType,
      deviceBrand,
      deviceModel: model,
      osName,
      osVersion,
      platform: getPlatform(platform2)
    });
  }
};
const getAppBaseInfo = {
  returnValue: (fromRes, toRes) => {
    const { version: version2, language, SDKVersion, theme } = fromRes;
    let _hostName = getHostName(fromRes);
    let hostLanguage = (language || "").replace(/_/g, "-");
    const parameters = {
      appId: "__UNI__E50AF23",
      appName: "fuu-run-uni",
      appVersion: "1.0.0",
      appVersionCode: "100",
      appLanguage: getAppLanguage(hostLanguage),
      hostVersion: version2,
      hostLanguage,
      hostName: _hostName,
      hostSDKVersion: SDKVersion,
      hostTheme: theme,
      isUniAppX: false,
      uniPlatform: "mp-weixin",
      uniCompileVersion: "5.15",
      uniCompilerVersion: "5.15",
      uniRuntimeVersion: "5.15"
    };
    try {
      if (typeof wx.getAccountInfoSync === "function") {
        parameters.packagename = wx.getAccountInfoSync().miniProgram.appId;
      }
    } catch (error) {
    }
    extend(toRes, parameters);
  }
};
const getWindowInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    toRes = extend(toRes, {
      windowTop: 0,
      windowBottom: 0
    });
  }
};
const getAppAuthorizeSetting = {
  returnValue: function(fromRes, toRes) {
    const { locationReducedAccuracy } = fromRes;
    toRes.locationAccuracy = "unsupported";
    if (locationReducedAccuracy === true) {
      toRes.locationAccuracy = "reduced";
    } else if (locationReducedAccuracy === false) {
      toRes.locationAccuracy = "full";
    }
  }
};
const onError = {
  args(fromArgs) {
    const app = getApp({ allowDefault: true }) || {};
    if (!app.$vm) {
      if (!wx.$onErrorHandlers) {
        wx.$onErrorHandlers = [];
      }
      wx.$onErrorHandlers.push(fromArgs);
    } else {
      injectHook(ON_ERROR, fromArgs, app.$vm.$);
    }
  }
};
const offError = {
  args(fromArgs) {
    const app = getApp({ allowDefault: true }) || {};
    if (!app.$vm) {
      if (!wx.$onErrorHandlers) {
        return;
      }
      const index2 = wx.$onErrorHandlers.findIndex((fn) => fn === fromArgs);
      if (index2 !== -1) {
        wx.$onErrorHandlers.splice(index2, 1);
      }
    } else if (fromArgs.__weh) {
      const onErrors = app.$vm.$[ON_ERROR];
      if (onErrors) {
        const index2 = onErrors.indexOf(fromArgs.__weh);
        if (index2 > -1) {
          onErrors.splice(index2, 1);
        }
      }
    }
  }
};
const onSocketOpen = {
  args() {
    if (wx.__uni_console__) {
      if (wx.__uni_console_warned__) {
        return;
      }
      wx.__uni_console_warned__ = true;
      console.warn(`开发模式下小程序日志回显会使用 socket 连接，为了避免冲突，建议使用 SocketTask 的方式去管理 WebSocket 或手动关闭日志回显功能。[详情](https://uniapp.dcloud.net.cn/tutorial/run/mp-log.html)`);
    }
  }
};
const onSocketMessage = onSocketOpen;
const baseApis = {
  $on,
  $off,
  $once,
  $emit,
  upx2px,
  rpx2px: upx2px,
  interceptors,
  addInterceptor,
  removeInterceptor,
  onCreateVueApp,
  invokeCreateVueAppHook,
  getLocale,
  setLocale,
  onLocaleChange,
  getPushClientId,
  onPushMessage,
  offPushMessage,
  invokePushCallback,
  __f__
};
function initUni(api, protocols2, platform2 = wx) {
  const wrapper = initWrapper(protocols2);
  const UniProxyHandlers = {
    get(target, key) {
      if (hasOwn(target, key)) {
        return target[key];
      }
      if (hasOwn(api, key)) {
        return promisify(key, api[key]);
      }
      if (hasOwn(baseApis, key)) {
        return promisify(key, baseApis[key]);
      }
      return promisify(key, wrapper(key, platform2[key]));
    }
  };
  return new Proxy({}, UniProxyHandlers);
}
function initGetProvider(providers) {
  return function getProvider2({ service, success, fail, complete }) {
    let res;
    if (providers[service]) {
      res = {
        errMsg: "getProvider:ok",
        service,
        provider: providers[service]
      };
      isFunction$1(success) && success(res);
    } else {
      res = {
        errMsg: "getProvider:fail:服务[" + service + "]不存在"
      };
      isFunction$1(fail) && fail(res);
    }
    isFunction$1(complete) && complete(res);
  };
}
const objectKeys = [
  "qy",
  "env",
  "error",
  "version",
  "lanDebug",
  "cloud",
  "serviceMarket",
  "router",
  "worklet",
  "__webpack_require_UNI_MP_PLUGIN__"
];
const singlePageDisableKey = ["lanDebug", "router", "worklet"];
const launchOption = wx.getLaunchOptionsSync ? wx.getLaunchOptionsSync() : null;
function isWxKey(key) {
  if (launchOption && launchOption.scene === 1154 && singlePageDisableKey.includes(key)) {
    return false;
  }
  return objectKeys.indexOf(key) > -1 || typeof wx[key] === "function";
}
function initWx() {
  const newWx = {};
  for (const key in wx) {
    if (isWxKey(key)) {
      newWx[key] = wx[key];
    }
  }
  if (typeof globalThis !== "undefined" && typeof requireMiniProgram === "undefined") {
    globalThis.wx = newWx;
  }
  return newWx;
}
const mocks$1 = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
const getProvider = initGetProvider({
  oauth: ["weixin"],
  share: ["weixin"],
  payment: ["wxpay"],
  push: ["weixin"]
});
function initComponentMocks(component) {
  const res = /* @__PURE__ */ Object.create(null);
  mocks$1.forEach((name) => {
    res[name] = component[name];
  });
  return res;
}
function createSelectorQuery() {
  const query = wx$2.createSelectorQuery();
  const oldIn = query.in;
  query.in = function newIn(component) {
    if (component.$scope) {
      return oldIn.call(this, component.$scope);
    }
    return oldIn.call(this, initComponentMocks(component));
  };
  return query;
}
const wx$2 = initWx();
if (!wx$2.getAppBaseInfo || !wx$2.getAppBaseInfo()) {
  wx$2.getAppBaseInfo = wx$2.getSystemInfoSync;
}
if (!wx$2.getWindowInfo || !wx$2.getWindowInfo()) {
  wx$2.getWindowInfo = wx$2.getSystemInfoSync;
}
if (!wx$2.getDeviceInfo || !wx$2.getDeviceInfo()) {
  wx$2.getDeviceInfo = wx$2.getSystemInfoSync;
}
let baseInfo = wx$2.getAppBaseInfo && wx$2.getAppBaseInfo();
if (!baseInfo) {
  baseInfo = wx$2.getSystemInfoSync();
}
const host = baseInfo ? baseInfo.host : null;
const shareVideoMessage = host && host.env === "SAAASDK" ? wx$2.miniapp.shareVideoMessage : wx$2.shareVideoMessage;
var shims = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  createSelectorQuery,
  getProvider,
  shareVideoMessage
});
const compressImage = {
  args(fromArgs, toArgs) {
    if (fromArgs.compressedHeight && !toArgs.compressHeight) {
      toArgs.compressHeight = fromArgs.compressedHeight;
    }
    if (fromArgs.compressedWidth && !toArgs.compressWidth) {
      toArgs.compressWidth = fromArgs.compressedWidth;
    }
  }
};
var protocols = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  compressImage,
  getAppAuthorizeSetting,
  getAppBaseInfo,
  getDeviceInfo,
  getSystemInfo,
  getSystemInfoSync,
  getWindowInfo,
  offError,
  onError,
  onSocketMessage,
  onSocketOpen,
  previewImage,
  redirectTo,
  showActionSheet
});
const wx$1 = initWx();
var index = initUni(shims, protocols, wx$1);
function currentPageCaptureScreenshot(fullPage, callback) {
  var _a;
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  (_a = currentPage.vm) === null || _a === void 0 ? void 0 : _a.$viewToTempFilePath({
    wholeContent: fullPage,
    overwrite: true,
    success: (res) => {
      const fileManager = index.getFileSystemManager();
      fileManager.readFile({
        encoding: "base64",
        filePath: res.tempFilePath,
        success(readFileRes) {
          callback(readFileRes.data, "");
        },
        fail(err) {
          callback("", `captureScreenshot fail: ${JSON.stringify(err)}`);
        }
      });
    },
    fail: (err) => {
      callback("", `captureScreenshot fail: ${JSON.stringify(err)}`);
    }
  });
}
function initRuntimeSocket(hosts, port, id) {
  if (hosts == "" || port == "" || id == "")
    return Promise.resolve(null);
  return hosts.split(",").reduce((promise, host2) => {
    return promise.then((socket) => {
      if (socket != null)
        return Promise.resolve(socket);
      return tryConnectSocket(host2, port, id);
    });
  }, Promise.resolve(null));
}
const SOCKET_TIMEOUT = 500;
function tryConnectSocket(host2, port, id) {
  return new Promise((resolve2, reject) => {
    const socket = index.connectSocket({
      url: `ws://${host2}:${port}/${id}`,
      multiple: true,
      // 支付宝小程序 是否开启多实例
      fail() {
        resolve2(null);
      }
    });
    const timer = setTimeout(() => {
      socket.close({
        code: 1006,
        reason: "connect timeout"
      });
      resolve2(null);
    }, SOCKET_TIMEOUT);
    socket.onOpen((e2) => {
      clearTimeout(timer);
      resolve2(socket);
    });
    socket.onClose((e2) => {
      clearTimeout(timer);
      resolve2(null);
    });
    socket.onError((e2) => {
      clearTimeout(timer);
      resolve2(null);
    });
    socket.onMessage((result) => {
      const message = JSON.parse(result.data);
      if (message["type"] == "screencap") {
        const id2 = message["id"];
        currentPageCaptureScreenshot(message.fullPage, (base64, error) => {
          socket.send({
            data: JSON.stringify({
              id: id2,
              base64,
              error
            })
          });
        });
      }
      resolve2(null);
    });
  });
}
const CONSOLE_TYPES = ["log", "warn", "error", "info", "debug"];
const originalConsole = /* @__PURE__ */ CONSOLE_TYPES.reduce((methods, type) => {
  methods[type] = console[type].bind(console);
  return methods;
}, {});
let sendError = null;
const errorQueue = /* @__PURE__ */ new Set();
const errorExtra = {};
function sendErrorMessages(errors) {
  if (sendError == null) {
    errors.forEach((error) => {
      errorQueue.add(error);
    });
    return;
  }
  const data = errors.map((err) => {
    if (typeof err === "string") {
      return err;
    }
    const isPromiseRejection = err && "promise" in err && "reason" in err;
    const prefix = isPromiseRejection ? "UnhandledPromiseRejection: " : "";
    if (isPromiseRejection) {
      err = err.reason;
    }
    if (err instanceof Error && err.stack) {
      if (err.message && !err.stack.includes(err.message)) {
        return `${prefix}${err.message}
${err.stack}`;
      }
      return `${prefix}${err.stack}`;
    }
    if (typeof err === "object" && err !== null) {
      try {
        return prefix + JSON.stringify(err);
      } catch (err2) {
        return prefix + String(err2);
      }
    }
    return prefix + String(err);
  }).filter(Boolean);
  if (data.length > 0) {
    sendError(JSON.stringify(Object.assign({
      type: "error",
      data
    }, errorExtra)));
  }
}
function setSendError(value, extra = {}) {
  sendError = value;
  Object.assign(errorExtra, extra);
  if (value != null && errorQueue.size > 0) {
    const errors = Array.from(errorQueue);
    errorQueue.clear();
    sendErrorMessages(errors);
  }
}
function initOnError() {
  function onError2(error) {
    try {
      if (typeof PromiseRejectionEvent !== "undefined" && error instanceof PromiseRejectionEvent && error.reason instanceof Error && error.reason.message && error.reason.message.includes(`Cannot create property 'errMsg' on string 'taskId`)) {
        return;
      }
      if (true) {
        originalConsole.error(error);
      }
      sendErrorMessages([error]);
    } catch (err) {
      originalConsole.error(err);
    }
  }
  if (typeof index !== "undefined") {
    if (typeof index.onError === "function") {
      index.onError(onError2);
    }
    if (typeof index.onUnhandledRejection === "function") {
      index.onUnhandledRejection(onError2);
    }
  }
  return function offError2() {
    if (typeof index !== "undefined") {
      if (typeof index.offError === "function") {
        index.offError(onError2);
      }
      if (typeof index.offUnhandledRejection === "function") {
        index.offUnhandledRejection(onError2);
      }
    }
  };
}
function formatMessage(type, args) {
  try {
    return {
      type,
      args: formatArgs(args)
    };
  } catch (e2) {
  }
  return {
    type,
    args: []
  };
}
function formatArgs(args) {
  return args.map((arg) => formatArg(arg));
}
function formatArg(arg, depth = 0) {
  if (depth >= 7) {
    return {
      type: "object",
      value: "[Maximum depth reached]"
    };
  }
  const type = typeof arg;
  switch (type) {
    case "string":
      return formatString(arg);
    case "number":
      return formatNumber$1(arg);
    case "boolean":
      return formatBoolean(arg);
    case "object":
      try {
        return formatObject(arg, depth);
      } catch (e2) {
        return {
          type: "object",
          value: {
            properties: []
          }
        };
      }
    case "undefined":
      return formatUndefined();
    case "function":
      return formatFunction(arg);
    case "symbol": {
      return formatSymbol(arg);
    }
    case "bigint":
      return formatBigInt(arg);
  }
}
function formatFunction(value) {
  return {
    type: "function",
    value: `function ${value.name}() {}`
  };
}
function formatUndefined() {
  return {
    type: "undefined"
  };
}
function formatBoolean(value) {
  return {
    type: "boolean",
    value: String(value)
  };
}
function formatNumber$1(value) {
  return {
    type: "number",
    value: String(value)
  };
}
function formatBigInt(value) {
  return {
    type: "bigint",
    value: String(value)
  };
}
function formatString(value) {
  return {
    type: "string",
    value
  };
}
function formatSymbol(value) {
  return {
    type: "symbol",
    value: value.description
  };
}
function formatObject(value, depth) {
  if (value === null) {
    return {
      type: "null"
    };
  }
  {
    if (isComponentPublicInstance(value)) {
      return formatComponentPublicInstance(value, depth);
    }
    if (isComponentInternalInstance(value)) {
      return formatComponentInternalInstance(value, depth);
    }
    if (isUniElement(value)) {
      return formatUniElement(value, depth);
    }
    if (isCSSStyleDeclaration(value)) {
      return formatCSSStyleDeclaration(value, depth);
    }
  }
  if (Array.isArray(value)) {
    return {
      type: "object",
      subType: "array",
      value: {
        properties: value.map((v, i) => formatArrayElement(v, i, depth + 1))
      }
    };
  }
  if (value instanceof Set) {
    return {
      type: "object",
      subType: "set",
      className: "Set",
      description: `Set(${value.size})`,
      value: {
        entries: Array.from(value).map((v) => formatSetEntry(v, depth + 1))
      }
    };
  }
  if (value instanceof Map) {
    return {
      type: "object",
      subType: "map",
      className: "Map",
      description: `Map(${value.size})`,
      value: {
        entries: Array.from(value.entries()).map((v) => formatMapEntry(v, depth + 1))
      }
    };
  }
  if (value instanceof Promise) {
    return {
      type: "object",
      subType: "promise",
      value: {
        properties: []
      }
    };
  }
  if (value instanceof RegExp) {
    return {
      type: "object",
      subType: "regexp",
      value: String(value),
      className: "Regexp"
    };
  }
  if (value instanceof Date) {
    return {
      type: "object",
      subType: "date",
      value: String(value),
      className: "Date"
    };
  }
  if (value instanceof Error) {
    return {
      type: "object",
      subType: "error",
      value: value.message || String(value),
      className: value.name || "Error"
    };
  }
  let className = void 0;
  {
    const constructor = value.constructor;
    if (constructor) {
      if (constructor.get$UTSMetadata$) {
        className = constructor.get$UTSMetadata$().name;
      }
    }
  }
  let entries = Object.entries(value);
  if (isHarmonyBuilderParams(value)) {
    entries = entries.filter(([key]) => key !== "modifier" && key !== "nodeContent");
  }
  return {
    type: "object",
    className,
    value: {
      properties: entries.map((entry) => formatObjectProperty(entry[0], entry[1], depth + 1))
    }
  };
}
function isHarmonyBuilderParams(value) {
  return value.modifier && value.modifier._attribute && value.nodeContent;
}
function isComponentPublicInstance(value) {
  return value.$ && isComponentInternalInstance(value.$);
}
function isComponentInternalInstance(value) {
  return value.type && value.uid != null && value.appContext;
}
function formatComponentPublicInstance(value, depth) {
  return {
    type: "object",
    className: "ComponentPublicInstance",
    value: {
      properties: Object.entries(value.$.type).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function formatComponentInternalInstance(value, depth) {
  return {
    type: "object",
    className: "ComponentInternalInstance",
    value: {
      properties: Object.entries(value.type).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function isUniElement(value) {
  return value.style && value.tagName != null && value.nodeName != null;
}
function formatUniElement(value, depth) {
  return {
    type: "object",
    // 非 x 没有 UniElement 的概念
    // className: 'UniElement',
    value: {
      properties: Object.entries(value).filter(([name]) => [
        "id",
        "tagName",
        "nodeName",
        "dataset",
        "offsetTop",
        "offsetLeft",
        "style"
      ].includes(name)).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function isCSSStyleDeclaration(value) {
  return typeof value.getPropertyValue === "function" && typeof value.setProperty === "function" && value.$styles;
}
function formatCSSStyleDeclaration(style, depth) {
  return {
    type: "object",
    value: {
      properties: Object.entries(style.$styles).map(([name, value]) => formatObjectProperty(name, value, depth + 1))
    }
  };
}
function formatObjectProperty(name, value, depth) {
  const result = formatArg(value, depth);
  result.name = name;
  return result;
}
function formatArrayElement(value, index2, depth) {
  const result = formatArg(value, depth);
  result.name = `${index2}`;
  return result;
}
function formatSetEntry(value, depth) {
  return {
    value: formatArg(value, depth)
  };
}
function formatMapEntry(value, depth) {
  return {
    key: formatArg(value[0], depth),
    value: formatArg(value[1], depth)
  };
}
let sendConsole = null;
const messageQueue = [];
const messageExtra = {};
const EXCEPTION_BEGIN_MARK = "---BEGIN:EXCEPTION---";
const EXCEPTION_END_MARK = "---END:EXCEPTION---";
function sendConsoleMessages(messages) {
  if (sendConsole == null) {
    messageQueue.push(...messages);
    return;
  }
  sendConsole(JSON.stringify(Object.assign({
    type: "console",
    data: messages
  }, messageExtra)));
}
function setSendConsole(value, extra = {}) {
  sendConsole = value;
  Object.assign(messageExtra, extra);
  if (value != null && messageQueue.length > 0) {
    const messages = messageQueue.slice();
    messageQueue.length = 0;
    sendConsoleMessages(messages);
  }
}
const atFileRegex = /^\s*at\s+[\w/./-]+:\d+$/;
function rewriteConsole() {
  function wrapConsole(type) {
    return function(...args) {
      {
        const originalArgs = [...args];
        if (originalArgs.length) {
          const maybeAtFile = originalArgs[originalArgs.length - 1];
          if (typeof maybeAtFile === "string" && atFileRegex.test(maybeAtFile)) {
            originalArgs.pop();
          }
        }
        originalConsole[type](...originalArgs);
      }
      if (type === "error" && args.length === 1) {
        const arg = args[0];
        if (typeof arg === "string" && arg.startsWith(EXCEPTION_BEGIN_MARK)) {
          const startIndex = EXCEPTION_BEGIN_MARK.length;
          const endIndex = arg.length - EXCEPTION_END_MARK.length;
          sendErrorMessages([arg.slice(startIndex, endIndex)]);
          return;
        } else if (arg instanceof Error) {
          sendErrorMessages([arg]);
          return;
        }
      }
      sendConsoleMessages([formatMessage(type, args)]);
    };
  }
  if (isConsoleWritable()) {
    CONSOLE_TYPES.forEach((type) => {
      console[type] = wrapConsole(type);
    });
    return function restoreConsole() {
      CONSOLE_TYPES.forEach((type) => {
        console[type] = originalConsole[type];
      });
    };
  } else {
    {
      if (typeof index !== "undefined" && index.__f__) {
        const oldLog = index.__f__;
        if (oldLog) {
          index.__f__ = function(...args) {
            const [type, filename, ...rest] = args;
            oldLog(type, "", ...rest);
            sendConsoleMessages([formatMessage(type, [...rest, filename])]);
          };
          return function restoreConsole() {
            index.__f__ = oldLog;
          };
        }
      }
    }
  }
  return function restoreConsole() {
  };
}
function isConsoleWritable() {
  const value = console.log;
  const sym = Symbol();
  try {
    console.log = sym;
  } catch (ex) {
    return false;
  }
  const isWritable = console.log === sym;
  console.log = value;
  return isWritable;
}
function initRuntimeSocketService() {
  const hosts = "26.251.142.99,172.18.0.1,172.20.10.3,192.168.118.1,192.168.150.1,127.0.0.1";
  const port = "8090";
  const id = "mp-weixin_WdG7Kg";
  const lazy = typeof swan !== "undefined";
  let restoreError = lazy ? () => {
  } : initOnError();
  let restoreConsole = lazy ? () => {
  } : rewriteConsole();
  return Promise.resolve().then(() => {
    if (lazy) {
      restoreError = initOnError();
      restoreConsole = rewriteConsole();
    }
    return initRuntimeSocket(hosts, port, id).then((socket) => {
      if (!socket) {
        restoreError();
        restoreConsole();
        originalConsole.error(wrapError("开发模式下日志通道建立 socket 连接失败。"));
        {
          originalConsole.error(wrapError("小程序平台，请勾选不校验合法域名配置。"));
        }
        originalConsole.error(wrapError("如果是运行到真机，请确认手机与电脑处于同一网络。"));
        return false;
      }
      {
        initMiniProgramGlobalFlag();
      }
      socket.onClose(() => {
        {
          originalConsole.error(wrapError("开发模式下日志通道 socket 连接关闭，请在 HBuilderX 中重新运行。"));
        }
        restoreError();
        restoreConsole();
      });
      setSendConsole((data) => {
        socket.send({
          data
        });
      });
      setSendError((data) => {
        socket.send({
          data
        });
      });
      return true;
    });
  });
}
const ERROR_CHAR = "‌";
function wrapError(error) {
  return `${ERROR_CHAR}${error}${ERROR_CHAR}`;
}
function initMiniProgramGlobalFlag() {
  if (typeof wx$1 !== "undefined") {
    wx$1.__uni_console__ = true;
  } else if (typeof my !== "undefined") {
    my.__uni_console__ = true;
  } else if (typeof tt !== "undefined") {
    tt.__uni_console__ = true;
  } else if (typeof swan !== "undefined") {
    swan.__uni_console__ = true;
  } else if (typeof qq !== "undefined") {
    qq.__uni_console__ = true;
  } else if (typeof ks !== "undefined") {
    ks.__uni_console__ = true;
  } else if (typeof jd !== "undefined") {
    jd.__uni_console__ = true;
  } else if (typeof xhs !== "undefined") {
    xhs.__uni_console__ = true;
  } else if (typeof has !== "undefined") {
    has.__uni_console__ = true;
  } else if (typeof qa !== "undefined") {
    qa.__uni_console__ = true;
  }
}
initRuntimeSocketService();
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
function initVueIds(vueIds, mpInstance) {
  if (!vueIds) {
    return;
  }
  const ids = vueIds.split(",");
  const len = ids.length;
  if (len === 1) {
    mpInstance._$vueId = ids[0];
  } else if (len === 2) {
    mpInstance._$vueId = ids[0];
    mpInstance._$vuePid = ids[1];
  }
}
const EXTRAS = ["externalClasses"];
function initExtraOptions(miniProgramComponentOptions, vueOptions) {
  EXTRAS.forEach((name) => {
    if (hasOwn(vueOptions, name)) {
      miniProgramComponentOptions[name] = vueOptions[name];
    }
  });
}
const WORKLET_RE = /_(.*)_worklet_factory_/;
function initWorkletMethods(mpMethods, vueMethods) {
  if (vueMethods) {
    Object.keys(vueMethods).forEach((name) => {
      const matches = name.match(WORKLET_RE);
      if (matches) {
        const workletName = matches[1];
        mpMethods[name] = vueMethods[name];
        mpMethods[workletName] = vueMethods[workletName];
      }
    });
  }
}
function initWxsCallMethods(methods, wxsCallMethods) {
  if (!isArray$1(wxsCallMethods)) {
    return;
  }
  wxsCallMethods.forEach((callMethod) => {
    methods[callMethod] = function(args) {
      return this.$vm[callMethod](args);
    };
  });
}
function selectAllComponents(mpInstance, selector, $refs) {
  const components = mpInstance.selectAllComponents(selector);
  components.forEach((component) => {
    const ref2 = component.properties.uR;
    $refs[ref2] = component.$vm || component;
  });
}
function initRefs(instance, mpInstance) {
  Object.defineProperty(instance, "refs", {
    get() {
      const $refs = {};
      selectAllComponents(mpInstance, ".r", $refs);
      const forComponents = mpInstance.selectAllComponents(".r-i-f");
      forComponents.forEach((component) => {
        const ref2 = component.properties.uR;
        if (!ref2) {
          return;
        }
        if (!$refs[ref2]) {
          $refs[ref2] = [];
        }
        $refs[ref2].push(component.$vm || component);
      });
      return $refs;
    }
  });
}
function findVmByVueId(instance, vuePid) {
  const $children = instance.$children;
  for (let i = $children.length - 1; i >= 0; i--) {
    const childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  let parentVm;
  for (let i = $children.length - 1; i >= 0; i--) {
    parentVm = findVmByVueId($children[i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}
function getLocaleLanguage() {
  var _a;
  let localeLanguage = "";
  {
    const appBaseInfo = ((_a = wx.getAppBaseInfo) === null || _a === void 0 ? void 0 : _a.call(wx)) || wx.getSystemInfoSync();
    const language = appBaseInfo && appBaseInfo.language ? appBaseInfo.language : LOCALE_EN;
    localeLanguage = normalizeLocale(language) || LOCALE_EN;
  }
  return localeLanguage;
}
const MP_METHODS = [
  "createSelectorQuery",
  "createIntersectionObserver",
  "selectAllComponents",
  "selectComponent"
];
function createEmitFn(oldEmit, ctx) {
  return function emit2(event, ...args) {
    const scope = ctx.$scope;
    if (scope && event) {
      const detail = { __args__: args };
      {
        scope.triggerEvent(event, detail);
      }
    }
    return oldEmit.apply(this, [event, ...args]);
  };
}
function initBaseInstance(instance, options) {
  const ctx = instance.ctx;
  ctx.mpType = options.mpType;
  ctx.$mpType = options.mpType;
  ctx.$mpPlatform = "mp-weixin";
  ctx.$scope = options.mpInstance;
  {
    Object.defineProperties(ctx, {
      // only id
      [VIRTUAL_HOST_ID]: {
        get() {
          const id = this.$scope.data[VIRTUAL_HOST_ID];
          return id === void 0 ? "" : id;
        }
      }
    });
  }
  ctx.$mp = {};
  {
    ctx._self = {};
  }
  instance.slots = {};
  if (isArray$1(options.slots) && options.slots.length) {
    options.slots.forEach((name) => {
      instance.slots[name] = true;
    });
    if (instance.slots[SLOT_DEFAULT_NAME]) {
      instance.slots.default = true;
    }
  }
  ctx.getOpenerEventChannel = function() {
    {
      return options.mpInstance.getOpenerEventChannel();
    }
  };
  ctx.$hasHook = hasHook;
  ctx.$callHook = callHook;
  instance.emit = createEmitFn(instance.emit, ctx);
}
function initComponentInstance(instance, options) {
  initBaseInstance(instance, options);
  const ctx = instance.ctx;
  MP_METHODS.forEach((method) => {
    ctx[method] = function(...args) {
      const mpInstance = ctx.$scope;
      if (mpInstance && mpInstance[method]) {
        return mpInstance[method].apply(mpInstance, args);
      }
    };
  });
}
function initMocks(instance, mpInstance, mocks2) {
  const ctx = instance.ctx;
  mocks2.forEach((mock) => {
    if (hasOwn(mpInstance, mock)) {
      instance[mock] = ctx[mock] = mpInstance[mock];
    }
  });
}
function hasHook(name) {
  const hooks = this.$[name];
  if (hooks && hooks.length) {
    return true;
  }
  return false;
}
function callHook(name, args) {
  if (name === "mounted") {
    callHook.call(this, "bm");
    this.$.isMounted = true;
    name = "m";
  }
  const hooks = this.$[name];
  return hooks && invokeArrayFns(hooks, args);
}
const PAGE_INIT_HOOKS = [
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_RESIZE,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_ADD_TO_FAVORITES
  // 'onReady', // lifetimes.ready
  // 'onPageScroll', // 影响性能，开发者手动注册
  // 'onShareTimeline', // 右上角菜单，开发者手动注册
  // 'onShareAppMessage' // 右上角菜单，开发者手动注册
];
function findHooks(vueOptions, hooks = /* @__PURE__ */ new Set()) {
  if (vueOptions) {
    Object.keys(vueOptions).forEach((name) => {
      if (isUniLifecycleHook(name, vueOptions[name])) {
        hooks.add(name);
      }
    });
    {
      const { extends: extendsOptions, mixins } = vueOptions;
      if (mixins) {
        mixins.forEach((mixin) => findHooks(mixin, hooks));
      }
      if (extendsOptions) {
        findHooks(extendsOptions, hooks);
      }
    }
  }
  return hooks;
}
function initHook(mpOptions, hook, excludes) {
  if (excludes.indexOf(hook) === -1 && !hasOwn(mpOptions, hook)) {
    mpOptions[hook] = function(args) {
      return this.$vm && this.$vm.$callHook(hook, args);
    };
  }
}
const EXCLUDE_HOOKS = [ON_READY];
function initHooks(mpOptions, hooks, excludes = EXCLUDE_HOOKS) {
  hooks.forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initUnknownHooks(mpOptions, vueOptions, excludes = EXCLUDE_HOOKS) {
  findHooks(vueOptions).forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initRuntimeHooks(mpOptions, runtimeHooks) {
  if (!runtimeHooks) {
    return;
  }
  const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
  hooks.forEach((hook) => {
    if (runtimeHooks & MINI_PROGRAM_PAGE_RUNTIME_HOOKS[hook]) {
      initHook(mpOptions, hook, []);
    }
  });
}
const findMixinRuntimeHooks = /* @__PURE__ */ once(() => {
  const runtimeHooks = [];
  const app = isFunction$1(getApp) && getApp({ allowDefault: true });
  if (app && app.$vm && app.$vm.$) {
    const mixins = app.$vm.$.appContext.mixins;
    if (isArray$1(mixins)) {
      const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
      mixins.forEach((mixin) => {
        hooks.forEach((hook) => {
          if (hasOwn(mixin, hook) && !runtimeHooks.includes(hook)) {
            runtimeHooks.push(hook);
          }
        });
      });
    }
  }
  return runtimeHooks;
});
function initMixinRuntimeHooks(mpOptions) {
  initHooks(mpOptions, findMixinRuntimeHooks());
}
const HOOKS = [
  ON_SHOW,
  ON_HIDE,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION
];
function parseApp(instance, parseAppOptions) {
  const internalInstance = instance.$;
  const appOptions = {
    globalData: instance.$options && instance.$options.globalData || {},
    $vm: instance,
    // mp-alipay 组件 data 初始化比 onLaunch 早，提前挂载
    onLaunch(options) {
      this.$vm = instance;
      const ctx = internalInstance.ctx;
      if (this.$vm && ctx.$scope && ctx.$callHook) {
        return;
      }
      initBaseInstance(internalInstance, {
        mpType: "app",
        mpInstance: this,
        slots: []
      });
      ctx.globalData = this.globalData;
      instance.$callHook(ON_LAUNCH, options);
    }
  };
  const onErrorHandlers = wx.$onErrorHandlers;
  if (onErrorHandlers) {
    onErrorHandlers.forEach((fn) => {
      injectHook(ON_ERROR, fn, internalInstance);
    });
    onErrorHandlers.length = 0;
  }
  initLocale(instance);
  const vueOptions = instance.$.type;
  initHooks(appOptions, HOOKS);
  initUnknownHooks(appOptions, vueOptions);
  {
    const methods = vueOptions.methods;
    methods && extend(appOptions, methods);
  }
  return appOptions;
}
function initCreateApp(parseAppOptions) {
  return function createApp2(vm) {
    return App(parseApp(vm));
  };
}
function initCreateSubpackageApp(parseAppOptions) {
  return function createApp2(vm) {
    const appOptions = parseApp(vm);
    const app = isFunction$1(getApp) && getApp({
      allowDefault: true
    });
    if (!app)
      return;
    vm.$.ctx.$scope = app;
    const globalData = app.globalData;
    if (globalData) {
      Object.keys(appOptions.globalData).forEach((name) => {
        if (!hasOwn(globalData, name)) {
          globalData[name] = appOptions.globalData[name];
        }
      });
    }
    Object.keys(appOptions).forEach((name) => {
      if (!hasOwn(app, name)) {
        app[name] = appOptions[name];
      }
    });
    initAppLifecycle(appOptions, vm);
  };
}
function initAppLifecycle(appOptions, vm) {
  if (isFunction$1(appOptions.onLaunch)) {
    const args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    appOptions.onLaunch(args);
  }
  if (isFunction$1(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow((args) => {
      vm.$callHook("onShow", args);
    });
  }
  if (isFunction$1(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide((args) => {
      vm.$callHook("onHide", args);
    });
  }
}
function initLocale(appVm) {
  const locale = ref(getLocaleLanguage());
  Object.defineProperty(appVm, "$locale", {
    get() {
      return locale.value;
    },
    set(v) {
      locale.value = v;
    }
  });
}
const builtInProps = [
  // 百度小程序,快手小程序自定义组件不支持绑定动态事件，动态dataset，故通过props传递事件信息
  // event-opts
  "eO",
  // 组件 ref
  "uR",
  // 组件 ref-in-for
  "uRIF",
  // 组件 id
  "uI",
  // 组件类型 m: 小程序组件
  "uT",
  // 组件 props
  "uP",
  // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
  "uS"
];
function initDefaultProps(options, isBehavior = false) {
  const properties = {};
  if (!isBehavior) {
    let observerSlots = function(newVal) {
      const $slots = /* @__PURE__ */ Object.create(null);
      newVal && newVal.forEach((slotName) => {
        $slots[slotName] = true;
      });
      this.setData({
        $slots
      });
    };
    builtInProps.forEach((name) => {
      properties[name] = {
        type: null,
        value: ""
      };
    });
    properties.uS = {
      type: null,
      value: []
    };
    {
      properties.uS.observer = observerSlots;
    }
  }
  if (options.behaviors) {
    if (options.behaviors.includes("wx://form-field")) {
      if (!options.properties || !options.properties.name) {
        properties.name = {
          type: null,
          value: ""
        };
      }
      if (!options.properties || !options.properties.value) {
        properties.value = {
          type: null,
          value: ""
        };
      }
    }
  }
  return properties;
}
function initVirtualHostProps(options) {
  const properties = {};
  {
    if (options && options.virtualHost) {
      properties[VIRTUAL_HOST_STYLE] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_CLASS] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_HIDDEN] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_ID] = {
        type: null,
        value: ""
      };
    }
  }
  return properties;
}
function initProps(mpComponentOptions) {
  if (!mpComponentOptions.properties) {
    mpComponentOptions.properties = {};
  }
  extend(mpComponentOptions.properties, initDefaultProps(mpComponentOptions), initVirtualHostProps(mpComponentOptions.options));
}
const PROP_TYPES = [String, Number, Boolean, Object, Array, null];
function parsePropType(type, defaultValue) {
  if (isArray$1(type) && type.length === 1) {
    return type[0];
  }
  return type;
}
function normalizePropType(type, defaultValue) {
  const res = parsePropType(type);
  return PROP_TYPES.indexOf(res) !== -1 ? res : null;
}
function initPageProps({ properties }, rawProps) {
  if (isArray$1(rawProps)) {
    rawProps.forEach((key) => {
      properties[key] = {
        type: String,
        value: ""
      };
    });
  } else if (isPlainObject(rawProps)) {
    Object.keys(rawProps).forEach((key) => {
      const opts = rawProps[key];
      if (isPlainObject(opts)) {
        let value = opts.default;
        if (isFunction$1(value)) {
          value = value();
        }
        const type = opts.type;
        opts.type = normalizePropType(type);
        properties[key] = {
          type: opts.type,
          value
        };
      } else {
        properties[key] = {
          type: normalizePropType(opts)
        };
      }
    });
  }
}
function findPropsData(properties, isPage2) {
  return (isPage2 ? findPagePropsData(properties) : findComponentPropsData(resolvePropValue(properties.uP))) || {};
}
function findPagePropsData(properties) {
  const propsData = {};
  if (isPlainObject(properties)) {
    Object.keys(properties).forEach((name) => {
      if (builtInProps.indexOf(name) === -1) {
        propsData[name] = resolvePropValue(properties[name]);
      }
    });
  }
  return propsData;
}
function initFormField(vm) {
  const vueOptions = vm.$options;
  if (isArray$1(vueOptions.behaviors) && vueOptions.behaviors.includes("uni://form-field")) {
    vm.$watch("modelValue", () => {
      vm.$scope && vm.$scope.setData({
        name: vm.name,
        value: vm.modelValue
      });
    }, {
      immediate: true
    });
  }
}
function resolvePropValue(prop) {
  return prop;
}
function initData(_) {
  return {};
}
function initPropsObserver(componentOptions) {
  const observe = function observe2() {
    const up = this.properties.uP;
    if (!up) {
      return;
    }
    if (this.$vm) {
      updateComponentProps(resolvePropValue(up), this.$vm.$);
    } else if (resolvePropValue(this.properties.uT) === "m") {
      updateMiniProgramComponentProperties(resolvePropValue(up), this);
    } else
      ;
  };
  {
    if (!componentOptions.observers) {
      componentOptions.observers = {};
    }
    componentOptions.observers.uP = observe;
  }
}
function updateMiniProgramComponentProperties(up, mpInstance) {
  const prevProps = mpInstance.properties;
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps, false)) {
    mpInstance.setData(nextProps);
  }
}
function updateComponentProps(up, instance) {
  const prevProps = toRaw(instance.props);
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps)) {
    updateProps(instance, nextProps, prevProps, false);
    if (hasQueueJob(instance.update)) {
      invalidateJob(instance.update);
    }
    {
      instance.update();
    }
  }
}
function hasPropsChanged(prevProps, nextProps, checkLen = true) {
  const nextKeys = Object.keys(nextProps);
  if (checkLen && nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }
  return false;
}
function initBehaviors(vueOptions) {
  const vueBehaviors = vueOptions.behaviors;
  let vueProps = vueOptions.props;
  if (!vueProps) {
    vueOptions.props = vueProps = [];
  }
  const behaviors = [];
  if (isArray$1(vueBehaviors)) {
    vueBehaviors.forEach((behavior) => {
      behaviors.push(behavior.replace("uni://", "wx://"));
      if (behavior === "uni://form-field") {
        if (isArray$1(vueProps)) {
          vueProps.push("name");
          vueProps.push("modelValue");
        } else {
          vueProps.name = {
            type: String,
            default: ""
          };
          vueProps.modelValue = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: ""
          };
        }
      }
    });
  }
  return behaviors;
}
function applyOptions(componentOptions, vueOptions) {
  componentOptions.data = initData();
  componentOptions.behaviors = initBehaviors(vueOptions);
}
function parseComponent(vueOptions, { parse, mocks: mocks2, isPage: isPage2, isPageInProject, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 }) {
  vueOptions = vueOptions.default || vueOptions;
  const options = {
    multipleSlots: true,
    // styleIsolation: 'apply-shared',
    addGlobalClass: true,
    pureDataPattern: /^uP$/
  };
  if (isArray$1(vueOptions.mixins)) {
    vueOptions.mixins.forEach((item) => {
      if (isObject$2(item.options)) {
        extend(options, item.options);
      }
    });
  }
  if (vueOptions.options) {
    extend(options, vueOptions.options);
  }
  const mpComponentOptions = {
    options,
    lifetimes: initLifetimes2({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }),
    pageLifetimes: {
      show() {
        this.$vm && this.$vm.$callHook("onPageShow");
      },
      hide() {
        this.$vm && this.$vm.$callHook("onPageHide");
      },
      resize(size2) {
        this.$vm && this.$vm.$callHook("onPageResize", size2);
      }
    },
    methods: {
      __l: handleLink2
    }
  };
  {
    applyOptions(mpComponentOptions, vueOptions);
  }
  initProps(mpComponentOptions);
  initPropsObserver(mpComponentOptions);
  initExtraOptions(mpComponentOptions, vueOptions);
  initWxsCallMethods(mpComponentOptions.methods, vueOptions.wxsCallMethods);
  {
    initWorkletMethods(mpComponentOptions.methods, vueOptions.methods);
  }
  if (parse) {
    parse(mpComponentOptions, { handleLink: handleLink2 });
  }
  return mpComponentOptions;
}
function initCreateComponent(parseOptions2) {
  return function createComponent2(vueComponentOptions) {
    return Component(parseComponent(vueComponentOptions, parseOptions2));
  };
}
let $createComponentFn;
let $destroyComponentFn;
function getAppVm() {
  return getApp().$vm;
}
function $createComponent(initialVNode, options) {
  if (!$createComponentFn) {
    $createComponentFn = getAppVm().$createComponent;
  }
  const proxy = $createComponentFn(initialVNode, options);
  return getExposeProxy(proxy.$) || proxy;
}
function $destroyComponent(instance) {
  if (!$destroyComponentFn) {
    $destroyComponentFn = getAppVm().$destroyComponent;
  }
  return $destroyComponentFn(instance);
}
function parsePage(vueOptions, parseOptions2) {
  const { parse, mocks: mocks2, isPage: isPage2, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 } = parseOptions2;
  const miniProgramPageOptions = parseComponent(vueOptions, {
    mocks: mocks2,
    isPage: isPage2,
    isPageInProject: true,
    initRelation: initRelation2,
    handleLink: handleLink2,
    initLifetimes: initLifetimes2
  });
  initPageProps(miniProgramPageOptions, (vueOptions.default || vueOptions).props);
  const methods = miniProgramPageOptions.methods;
  methods.onLoad = function(query) {
    {
      this.options = query;
    }
    this.$page = {
      fullPath: addLeadingSlash(this.route + stringifyQuery(query))
    };
    return this.$vm && this.$vm.$callHook(ON_LOAD, query);
  };
  initHooks(methods, PAGE_INIT_HOOKS);
  {
    initUnknownHooks(methods, vueOptions);
  }
  initRuntimeHooks(methods, vueOptions.__runtimeHooks);
  initMixinRuntimeHooks(methods);
  parse && parse(miniProgramPageOptions, { handleLink: handleLink2 });
  return miniProgramPageOptions;
}
function initCreatePage(parseOptions2) {
  return function createPage2(vuePageOptions) {
    return Component(parsePage(vuePageOptions, parseOptions2));
  };
}
function initCreatePluginApp(parseAppOptions) {
  return function createApp2(vm) {
    initAppLifecycle(parseApp(vm), vm);
  };
}
const MPPage = Page;
const MPComponent = Component;
function initTriggerEvent(mpInstance) {
  const oldTriggerEvent = mpInstance.triggerEvent;
  const newTriggerEvent = function(event, ...args) {
    return oldTriggerEvent.apply(mpInstance, [
      customizeEvent(event),
      ...args
    ]);
  };
  try {
    mpInstance.triggerEvent = newTriggerEvent;
  } catch (error) {
    mpInstance._triggerEvent = newTriggerEvent;
  }
}
function initMiniProgramHook(name, options, isComponent) {
  const oldHook = options[name];
  if (!oldHook) {
    options[name] = function() {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function(...args) {
      initTriggerEvent(this);
      return oldHook.apply(this, args);
    };
  }
}
Page = function(options) {
  initMiniProgramHook(ON_LOAD, options);
  return MPPage(options);
};
Component = function(options) {
  initMiniProgramHook("created", options);
  const isVueComponent = options.properties && options.properties.uP;
  if (!isVueComponent) {
    initProps(options);
    initPropsObserver(options);
  }
  return MPComponent(options);
};
function initLifetimes({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }) {
  return {
    attached() {
      let properties = this.properties;
      initVueIds(properties.uI, this);
      const relationOptions = {
        vuePid: this._$vuePid
      };
      initRelation2(this, relationOptions);
      const mpInstance = this;
      const isMiniProgramPage = isPage2(mpInstance);
      let propsData = properties;
      this.$vm = $createComponent({
        type: vueOptions,
        props: findPropsData(propsData, isMiniProgramPage)
      }, {
        mpType: isMiniProgramPage ? "page" : "component",
        mpInstance,
        slots: properties.uS || {},
        // vueSlots
        parentComponent: relationOptions.parent && relationOptions.parent.$,
        onBeforeSetup(instance, options) {
          initRefs(instance, mpInstance);
          initMocks(instance, mpInstance, mocks2);
          initComponentInstance(instance, options);
        }
      });
      if (!isMiniProgramPage) {
        initFormField(this.$vm);
      }
    },
    ready() {
      if (this.$vm) {
        {
          this.$vm.$callHook("mounted");
          this.$vm.$callHook(ON_READY);
        }
      }
    },
    detached() {
      if (this.$vm) {
        pruneComponentPropsCache(this.$vm.$.uid);
        $destroyComponent(this.$vm);
      }
    }
  };
}
const mocks = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
function isPage(mpInstance) {
  return !!mpInstance.route;
}
function initRelation(mpInstance, detail) {
  mpInstance.triggerEvent("__l", detail);
}
function handleLink(event) {
  const detail = event.detail || event.value;
  const vuePid = detail.vuePid;
  let parentVm;
  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }
  if (!parentVm) {
    parentVm = this.$vm;
  }
  detail.parent = parentVm;
}
var parseOptions = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  handleLink,
  initLifetimes,
  initRelation,
  isPage,
  mocks
});
const createApp = initCreateApp();
const createPage = initCreatePage(parseOptions);
const createComponent = initCreateComponent(parseOptions);
const createPluginApp = initCreatePluginApp();
const createSubpackageApp = initCreateSubpackageApp();
{
  wx.createApp = global.createApp = createApp;
  wx.createPage = createPage;
  wx.createComponent = createComponent;
  wx.createPluginApp = global.createPluginApp = createPluginApp;
  wx.createSubpackageApp = global.createSubpackageApp = createSubpackageApp;
}
/*!
 * vuex v4.1.0
 * (c) 2022 Evan You
 * @license MIT
 */
var storeKey = "store";
function forEachValue(obj, fn) {
  Object.keys(obj).forEach(function(key) {
    return fn(obj[key], key);
  });
}
function isObject$1(obj) {
  return obj !== null && typeof obj === "object";
}
function isPromise$1(val) {
  return val && typeof val.then === "function";
}
function assert(condition, msg) {
  if (!condition) {
    throw new Error("[vuex] " + msg);
  }
}
function partial(fn, arg) {
  return function() {
    return fn(arg);
  };
}
function genericSubscribe(fn, subs, options) {
  if (subs.indexOf(fn) < 0) {
    options && options.prepend ? subs.unshift(fn) : subs.push(fn);
  }
  return function() {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  };
}
function resetStore(store, hot) {
  store._actions = /* @__PURE__ */ Object.create(null);
  store._mutations = /* @__PURE__ */ Object.create(null);
  store._wrappedGetters = /* @__PURE__ */ Object.create(null);
  store._modulesNamespaceMap = /* @__PURE__ */ Object.create(null);
  var state = store.state;
  installModule(store, state, [], store._modules.root, true);
  resetStoreState(store, state, hot);
}
function resetStoreState(store, state, hot) {
  var oldState = store._state;
  var oldScope = store._scope;
  store.getters = {};
  store._makeLocalGettersCache = /* @__PURE__ */ Object.create(null);
  var wrappedGetters = store._wrappedGetters;
  var computedObj = {};
  var computedCache = {};
  var scope = effectScope(true);
  scope.run(function() {
    forEachValue(wrappedGetters, function(fn, key) {
      computedObj[key] = partial(fn, store);
      computedCache[key] = computed(function() {
        return computedObj[key]();
      });
      Object.defineProperty(store.getters, key, {
        get: function() {
          return computedCache[key].value;
        },
        enumerable: true
        // for local getters
      });
    });
  });
  store._state = reactive({
    data: state
  });
  store._scope = scope;
  if (store.strict) {
    enableStrictMode(store);
  }
  if (oldState) {
    if (hot) {
      store._withCommit(function() {
        oldState.data = null;
      });
    }
  }
  if (oldScope) {
    oldScope.stop();
  }
}
function installModule(store, rootState, path, module2, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);
  if (module2.namespaced) {
    if (store._modulesNamespaceMap[namespace] && true) {
      console.error("[vuex] duplicate namespace " + namespace + " for the namespaced module " + path.join("/"));
    }
    store._modulesNamespaceMap[namespace] = module2;
  }
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function() {
      {
        if (moduleName in parentState) {
          console.warn(
            '[vuex] state field "' + moduleName + '" was overridden by a module with the same name at "' + path.join(".") + '"'
          );
        }
      }
      parentState[moduleName] = module2.state;
    });
  }
  var local = module2.context = makeLocalContext(store, namespace, path);
  module2.forEachMutation(function(mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });
  module2.forEachAction(function(action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });
  module2.forEachGetter(function(getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });
  module2.forEachChild(function(child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}
function makeLocalContext(store, namespace, path) {
  var noNamespace = namespace === "";
  var local = {
    dispatch: noNamespace ? store.dispatch : function(_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;
      if (!options || !options.root) {
        type = namespace + type;
        if (!store._actions[type]) {
          console.error("[vuex] unknown local action type: " + args.type + ", global type: " + type);
          return;
        }
      }
      return store.dispatch(type, payload);
    },
    commit: noNamespace ? store.commit : function(_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;
      if (!options || !options.root) {
        type = namespace + type;
        if (!store._mutations[type]) {
          console.error("[vuex] unknown local mutation type: " + args.type + ", global type: " + type);
          return;
        }
      }
      store.commit(type, payload, options);
    }
  };
  Object.defineProperties(local, {
    getters: {
      get: noNamespace ? function() {
        return store.getters;
      } : function() {
        return makeLocalGetters(store, namespace);
      }
    },
    state: {
      get: function() {
        return getNestedState(store.state, path);
      }
    }
  });
  return local;
}
function makeLocalGetters(store, namespace) {
  if (!store._makeLocalGettersCache[namespace]) {
    var gettersProxy = {};
    var splitPos = namespace.length;
    Object.keys(store.getters).forEach(function(type) {
      if (type.slice(0, splitPos) !== namespace) {
        return;
      }
      var localType = type.slice(splitPos);
      Object.defineProperty(gettersProxy, localType, {
        get: function() {
          return store.getters[type];
        },
        enumerable: true
      });
    });
    store._makeLocalGettersCache[namespace] = gettersProxy;
  }
  return store._makeLocalGettersCache[namespace];
}
function registerMutation(store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler(payload) {
    handler.call(store, local.state, payload);
  });
}
function registerAction(store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler(payload) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload);
    if (!isPromise$1(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function(err) {
        store._devtoolHook.emit("vuex:error", err);
        throw err;
      });
    } else {
      return res;
    }
  });
}
function registerGetter(store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    {
      console.error("[vuex] duplicate getter key: " + type);
    }
    return;
  }
  store._wrappedGetters[type] = function wrappedGetter(store2) {
    return rawGetter(
      local.state,
      // local state
      local.getters,
      // local getters
      store2.state,
      // root state
      store2.getters
      // root getters
    );
  };
}
function enableStrictMode(store) {
  watch(function() {
    return store._state.data;
  }, function() {
    {
      assert(store._committing, "do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, flush: "sync" });
}
function getNestedState(state, path) {
  return path.reduce(function(state2, key) {
    return state2[key];
  }, state);
}
function unifyObjectStyle(type, payload, options) {
  if (isObject$1(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }
  {
    assert(typeof type === "string", "expects string as the type, but found " + typeof type + ".");
  }
  return { type, payload, options };
}
var Module = function Module2(rawModule, runtime) {
  this.runtime = runtime;
  this._children = /* @__PURE__ */ Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === "function" ? rawState() : rawState) || {};
};
var prototypeAccessors$1 = { namespaced: { configurable: true } };
prototypeAccessors$1.namespaced.get = function() {
  return !!this._rawModule.namespaced;
};
Module.prototype.addChild = function addChild(key, module2) {
  this._children[key] = module2;
};
Module.prototype.removeChild = function removeChild(key) {
  delete this._children[key];
};
Module.prototype.getChild = function getChild(key) {
  return this._children[key];
};
Module.prototype.hasChild = function hasChild(key) {
  return key in this._children;
};
Module.prototype.update = function update(rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};
Module.prototype.forEachChild = function forEachChild(fn) {
  forEachValue(this._children, fn);
};
Module.prototype.forEachGetter = function forEachGetter(fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};
Module.prototype.forEachAction = function forEachAction(fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};
Module.prototype.forEachMutation = function forEachMutation(fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};
Object.defineProperties(Module.prototype, prototypeAccessors$1);
var ModuleCollection = function ModuleCollection2(rawRootModule) {
  this.register([], rawRootModule, false);
};
ModuleCollection.prototype.get = function get2(path) {
  return path.reduce(function(module2, key) {
    return module2.getChild(key);
  }, this.root);
};
ModuleCollection.prototype.getNamespace = function getNamespace(path) {
  var module2 = this.root;
  return path.reduce(function(namespace, key) {
    module2 = module2.getChild(key);
    return namespace + (module2.namespaced ? key + "/" : "");
  }, "");
};
ModuleCollection.prototype.update = function update$1(rawRootModule) {
  update2([], this.root, rawRootModule);
};
ModuleCollection.prototype.register = function register(path, rawModule, runtime) {
  var this$1$1 = this;
  if (runtime === void 0)
    runtime = true;
  {
    assertRawModule(path, rawModule);
  }
  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function(rawChildModule, key) {
      this$1$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};
ModuleCollection.prototype.unregister = function unregister(path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  var child = parent.getChild(key);
  if (!child) {
    {
      console.warn(
        "[vuex] trying to unregister module '" + key + "', which is not registered"
      );
    }
    return;
  }
  if (!child.runtime) {
    return;
  }
  parent.removeChild(key);
};
ModuleCollection.prototype.isRegistered = function isRegistered(path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (parent) {
    return parent.hasChild(key);
  }
  return false;
};
function update2(path, targetModule, newModule) {
  {
    assertRawModule(path, newModule);
  }
  targetModule.update(newModule);
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, manual reload is needed"
          );
        }
        return;
      }
      update2(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}
var functionAssert = {
  assert: function(value) {
    return typeof value === "function";
  },
  expected: "function"
};
var objectAssert = {
  assert: function(value) {
    return typeof value === "function" || typeof value === "object" && typeof value.handler === "function";
  },
  expected: 'function or object with "handler" function'
};
var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};
function assertRawModule(path, rawModule) {
  Object.keys(assertTypes).forEach(function(key) {
    if (!rawModule[key]) {
      return;
    }
    var assertOptions = assertTypes[key];
    forEachValue(rawModule[key], function(value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}
function makeAssertionMessage(path, key, type, value, expected) {
  var buf = key + " should be " + expected + ' but "' + key + "." + type + '"';
  if (path.length > 0) {
    buf += ' in module "' + path.join(".") + '"';
  }
  buf += " is " + JSON.stringify(value) + ".";
  return buf;
}
function createStore(options) {
  return new Store(options);
}
var Store = function Store2(options) {
  var this$1$1 = this;
  if (options === void 0)
    options = {};
  {
    assert(typeof Promise !== "undefined", "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store2, "store must be called with the new operator.");
  }
  var plugins = options.plugins;
  if (plugins === void 0)
    plugins = [];
  var strict = options.strict;
  if (strict === void 0)
    strict = false;
  var devtools2 = options.devtools;
  this._committing = false;
  this._actions = /* @__PURE__ */ Object.create(null);
  this._actionSubscribers = [];
  this._mutations = /* @__PURE__ */ Object.create(null);
  this._wrappedGetters = /* @__PURE__ */ Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = /* @__PURE__ */ Object.create(null);
  this._subscribers = [];
  this._makeLocalGettersCache = /* @__PURE__ */ Object.create(null);
  this._scope = null;
  this._devtools = devtools2;
  var store = this;
  var ref2 = this;
  var dispatch2 = ref2.dispatch;
  var commit2 = ref2.commit;
  this.dispatch = function boundDispatch(type, payload) {
    return dispatch2.call(store, type, payload);
  };
  this.commit = function boundCommit(type, payload, options2) {
    return commit2.call(store, type, payload, options2);
  };
  this.strict = strict;
  var state = this._modules.root.state;
  installModule(this, state, [], this._modules.root);
  resetStoreState(this, state);
  plugins.forEach(function(plugin2) {
    return plugin2(this$1$1);
  });
};
var prototypeAccessors = { state: { configurable: true } };
Store.prototype.install = function install(app, injectKey) {
  app.provide(injectKey || storeKey, this);
  app.config.globalProperties.$store = this;
  this._devtools !== void 0 ? this._devtools : true;
};
prototypeAccessors.state.get = function() {
  return this._state.data;
};
prototypeAccessors.state.set = function(v) {
  {
    assert(false, "use store.replaceState() to explicit replace store state.");
  }
};
Store.prototype.commit = function commit(_type, _payload, _options) {
  var this$1$1 = this;
  var ref2 = unifyObjectStyle(_type, _payload, _options);
  var type = ref2.type;
  var payload = ref2.payload;
  var options = ref2.options;
  var mutation = { type, payload };
  var entry = this._mutations[type];
  if (!entry) {
    {
      console.error("[vuex] unknown mutation type: " + type);
    }
    return;
  }
  this._withCommit(function() {
    entry.forEach(function commitIterator(handler) {
      handler(payload);
    });
  });
  this._subscribers.slice().forEach(function(sub) {
    return sub(mutation, this$1$1.state);
  });
  if (options && options.silent) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. Use the filter functionality in the vue-devtools"
    );
  }
};
Store.prototype.dispatch = function dispatch(_type, _payload) {
  var this$1$1 = this;
  var ref2 = unifyObjectStyle(_type, _payload);
  var type = ref2.type;
  var payload = ref2.payload;
  var action = { type, payload };
  var entry = this._actions[type];
  if (!entry) {
    {
      console.error("[vuex] unknown action type: " + type);
    }
    return;
  }
  try {
    this._actionSubscribers.slice().filter(function(sub) {
      return sub.before;
    }).forEach(function(sub) {
      return sub.before(action, this$1$1.state);
    });
  } catch (e2) {
    {
      console.warn("[vuex] error in before action subscribers: ");
      console.error(e2);
    }
  }
  var result = entry.length > 1 ? Promise.all(entry.map(function(handler) {
    return handler(payload);
  })) : entry[0](payload);
  return new Promise(function(resolve2, reject) {
    result.then(function(res) {
      try {
        this$1$1._actionSubscribers.filter(function(sub) {
          return sub.after;
        }).forEach(function(sub) {
          return sub.after(action, this$1$1.state);
        });
      } catch (e2) {
        {
          console.warn("[vuex] error in after action subscribers: ");
          console.error(e2);
        }
      }
      resolve2(res);
    }, function(error) {
      try {
        this$1$1._actionSubscribers.filter(function(sub) {
          return sub.error;
        }).forEach(function(sub) {
          return sub.error(action, this$1$1.state, error);
        });
      } catch (e2) {
        {
          console.warn("[vuex] error in error action subscribers: ");
          console.error(e2);
        }
      }
      reject(error);
    });
  });
};
Store.prototype.subscribe = function subscribe(fn, options) {
  return genericSubscribe(fn, this._subscribers, options);
};
Store.prototype.subscribeAction = function subscribeAction(fn, options) {
  var subs = typeof fn === "function" ? { before: fn } : fn;
  return genericSubscribe(subs, this._actionSubscribers, options);
};
Store.prototype.watch = function watch$1(getter, cb, options) {
  var this$1$1 = this;
  {
    assert(typeof getter === "function", "store.watch only accepts a function.");
  }
  return watch(function() {
    return getter(this$1$1.state, this$1$1.getters);
  }, cb, Object.assign({}, options));
};
Store.prototype.replaceState = function replaceState(state) {
  var this$1$1 = this;
  this._withCommit(function() {
    this$1$1._state.data = state;
  });
};
Store.prototype.registerModule = function registerModule(path, rawModule, options) {
  if (options === void 0)
    options = {};
  if (typeof path === "string") {
    path = [path];
  }
  {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, "cannot register the root module by using registerModule.");
  }
  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  resetStoreState(this, this.state);
};
Store.prototype.unregisterModule = function unregisterModule(path) {
  var this$1$1 = this;
  if (typeof path === "string") {
    path = [path];
  }
  {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }
  this._modules.unregister(path);
  this._withCommit(function() {
    var parentState = getNestedState(this$1$1.state, path.slice(0, -1));
    delete parentState[path[path.length - 1]];
  });
  resetStore(this);
};
Store.prototype.hasModule = function hasModule(path) {
  if (typeof path === "string") {
    path = [path];
  }
  {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }
  return this._modules.isRegistered(path);
};
Store.prototype.hotUpdate = function hotUpdate(newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};
Store.prototype._withCommit = function _withCommit(fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};
Object.defineProperties(Store.prototype, prototypeAccessors);
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var dayjs_min = { exports: {} };
(function(module2, exports2) {
  !function(t2, e2) {
    module2.exports = e2();
  }(commonjsGlobal, function() {
    var t2 = 1e3, e2 = 6e4, n2 = 36e5, r2 = "millisecond", i = "second", s2 = "minute", u = "hour", a = "day", o2 = "week", c = "month", f2 = "quarter", h = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|YYYY|YY|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(t3) {
      var e3 = ["th", "st", "nd", "rd"], n3 = t3 % 100;
      return "[" + t3 + (e3[(n3 - 20) % 10] || e3[n3] || e3[0]) + "]";
    } }, m = function(t3, e3, n3) {
      var r3 = String(t3);
      return !r3 || r3.length >= e3 ? t3 : "" + Array(e3 + 1 - r3.length).join(n3) + t3;
    }, v = { s: m, z: function(t3) {
      var e3 = -t3.utcOffset(), n3 = Math.abs(e3), r3 = Math.floor(n3 / 60), i2 = n3 % 60;
      return (e3 <= 0 ? "+" : "-") + m(r3, 2, "0") + ":" + m(i2, 2, "0");
    }, m: function t3(e3, n3) {
      if (e3.date() < n3.date())
        return -t3(n3, e3);
      var r3 = 12 * (n3.year() - e3.year()) + (n3.month() - e3.month()), i2 = e3.clone().add(r3, c), s3 = n3 - i2 < 0, u2 = e3.clone().add(r3 + (s3 ? -1 : 1), c);
      return +(-(r3 + (n3 - i2) / (s3 ? i2 - u2 : u2 - i2)) || 0);
    }, a: function(t3) {
      return t3 < 0 ? Math.ceil(t3) || 0 : Math.floor(t3);
    }, p: function(t3) {
      return { M: c, y: h, w: o2, d: a, D: d, h: u, m: s2, s: i, ms: r2, Q: f2 }[t3] || String(t3 || "").toLowerCase().replace(/s$/, "");
    }, u: function(t3) {
      return void 0 === t3;
    } }, g = "en", D = {};
    D[g] = M;
    var p2 = "$isDayjsObject", S = function(t3) {
      return t3 instanceof _ || !(!t3 || !t3[p2]);
    }, w2 = function t3(e3, n3, r3) {
      var i2;
      if (!e3)
        return g;
      if ("string" == typeof e3) {
        var s3 = e3.toLowerCase();
        D[s3] && (i2 = s3), n3 && (D[s3] = n3, i2 = s3);
        var u2 = e3.split("-");
        if (!i2 && u2.length > 1)
          return t3(u2[0]);
      } else {
        var a2 = e3.name;
        D[a2] = e3, i2 = a2;
      }
      return !r3 && i2 && (g = i2), i2 || !r3 && g;
    }, O = function(t3, e3) {
      if (S(t3))
        return t3.clone();
      var n3 = "object" == typeof e3 ? e3 : {};
      return n3.date = t3, n3.args = arguments, new _(n3);
    }, b = v;
    b.l = w2, b.i = S, b.w = function(t3, e3) {
      return O(t3, { locale: e3.$L, utc: e3.$u, x: e3.$x, $offset: e3.$offset });
    };
    var _ = function() {
      function M2(t3) {
        this.$L = w2(t3.locale, null, true), this.parse(t3), this.$x = this.$x || t3.x || {}, this[p2] = true;
      }
      var m2 = M2.prototype;
      return m2.parse = function(t3) {
        this.$d = function(t4) {
          var e3 = t4.date, n3 = t4.utc;
          if (null === e3)
            return /* @__PURE__ */ new Date(NaN);
          if (b.u(e3))
            return /* @__PURE__ */ new Date();
          if (e3 instanceof Date)
            return new Date(e3);
          if ("string" == typeof e3 && !/Z$/i.test(e3)) {
            var r3 = e3.match($);
            if (r3) {
              var i2 = r3[2] - 1 || 0, s3 = (r3[7] || "0").substring(0, 3);
              return n3 ? new Date(Date.UTC(r3[1], i2, r3[3] || 1, r3[4] || 0, r3[5] || 0, r3[6] || 0, s3)) : new Date(r3[1], i2, r3[3] || 1, r3[4] || 0, r3[5] || 0, r3[6] || 0, s3);
            }
          }
          return new Date(e3);
        }(t3), this.init();
      }, m2.init = function() {
        var t3 = this.$d;
        this.$y = t3.getFullYear(), this.$M = t3.getMonth(), this.$D = t3.getDate(), this.$W = t3.getDay(), this.$H = t3.getHours(), this.$m = t3.getMinutes(), this.$s = t3.getSeconds(), this.$ms = t3.getMilliseconds();
      }, m2.$utils = function() {
        return b;
      }, m2.isValid = function() {
        return !(this.$d.toString() === l);
      }, m2.isSame = function(t3, e3) {
        var n3 = O(t3);
        return this.startOf(e3) <= n3 && n3 <= this.endOf(e3);
      }, m2.isAfter = function(t3, e3) {
        return O(t3) < this.startOf(e3);
      }, m2.isBefore = function(t3, e3) {
        return this.endOf(e3) < O(t3);
      }, m2.$g = function(t3, e3, n3) {
        return b.u(t3) ? this[e3] : this.set(n3, t3);
      }, m2.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, m2.valueOf = function() {
        return this.$d.getTime();
      }, m2.startOf = function(t3, e3) {
        var n3 = this, r3 = !!b.u(e3) || e3, f3 = b.p(t3), l2 = function(t4, e4) {
          var i2 = b.w(n3.$u ? Date.UTC(n3.$y, e4, t4) : new Date(n3.$y, e4, t4), n3);
          return r3 ? i2 : i2.endOf(a);
        }, $2 = function(t4, e4) {
          return b.w(n3.toDate()[t4].apply(n3.toDate("s"), (r3 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e4)), n3);
        }, y2 = this.$W, M3 = this.$M, m3 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
        switch (f3) {
          case h:
            return r3 ? l2(1, 0) : l2(31, 11);
          case c:
            return r3 ? l2(1, M3) : l2(0, M3 + 1);
          case o2:
            var g2 = this.$locale().weekStart || 0, D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
            return l2(r3 ? m3 - D2 : m3 + (6 - D2), M3);
          case a:
          case d:
            return $2(v2 + "Hours", 0);
          case u:
            return $2(v2 + "Minutes", 1);
          case s2:
            return $2(v2 + "Seconds", 2);
          case i:
            return $2(v2 + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, m2.endOf = function(t3) {
        return this.startOf(t3, false);
      }, m2.$set = function(t3, e3) {
        var n3, o3 = b.p(t3), f3 = "set" + (this.$u ? "UTC" : ""), l2 = (n3 = {}, n3[a] = f3 + "Date", n3[d] = f3 + "Date", n3[c] = f3 + "Month", n3[h] = f3 + "FullYear", n3[u] = f3 + "Hours", n3[s2] = f3 + "Minutes", n3[i] = f3 + "Seconds", n3[r2] = f3 + "Milliseconds", n3)[o3], $2 = o3 === a ? this.$D + (e3 - this.$W) : e3;
        if (o3 === c || o3 === h) {
          var y2 = this.clone().set(d, 1);
          y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
        } else
          l2 && this.$d[l2]($2);
        return this.init(), this;
      }, m2.set = function(t3, e3) {
        return this.clone().$set(t3, e3);
      }, m2.get = function(t3) {
        return this[b.p(t3)]();
      }, m2.add = function(r3, f3) {
        var d2, l2 = this;
        r3 = Number(r3);
        var $2 = b.p(f3), y2 = function(t3) {
          var e3 = O(l2);
          return b.w(e3.date(e3.date() + Math.round(t3 * r3)), l2);
        };
        if ($2 === c)
          return this.set(c, this.$M + r3);
        if ($2 === h)
          return this.set(h, this.$y + r3);
        if ($2 === a)
          return y2(1);
        if ($2 === o2)
          return y2(7);
        var M3 = (d2 = {}, d2[s2] = e2, d2[u] = n2, d2[i] = t2, d2)[$2] || 1, m3 = this.$d.getTime() + r3 * M3;
        return b.w(m3, this);
      }, m2.subtract = function(t3, e3) {
        return this.add(-1 * t3, e3);
      }, m2.format = function(t3) {
        var e3 = this, n3 = this.$locale();
        if (!this.isValid())
          return n3.invalidDate || l;
        var r3 = t3 || "YYYY-MM-DDTHH:mm:ssZ", i2 = b.z(this), s3 = this.$H, u2 = this.$m, a2 = this.$M, o3 = n3.weekdays, c2 = n3.months, f3 = n3.meridiem, h2 = function(t4, n4, i3, s4) {
          return t4 && (t4[n4] || t4(e3, r3)) || i3[n4].slice(0, s4);
        }, d2 = function(t4) {
          return b.s(s3 % 12 || 12, t4, "0");
        }, $2 = f3 || function(t4, e4, n4) {
          var r4 = t4 < 12 ? "AM" : "PM";
          return n4 ? r4.toLowerCase() : r4;
        };
        return r3.replace(y, function(t4, r4) {
          return r4 || function(t5) {
            switch (t5) {
              case "YY":
                return String(e3.$y).slice(-2);
              case "YYYY":
                return b.s(e3.$y, 4, "0");
              case "M":
                return a2 + 1;
              case "MM":
                return b.s(a2 + 1, 2, "0");
              case "MMM":
                return h2(n3.monthsShort, a2, c2, 3);
              case "MMMM":
                return h2(c2, a2);
              case "D":
                return e3.$D;
              case "DD":
                return b.s(e3.$D, 2, "0");
              case "d":
                return String(e3.$W);
              case "dd":
                return h2(n3.weekdaysMin, e3.$W, o3, 2);
              case "ddd":
                return h2(n3.weekdaysShort, e3.$W, o3, 3);
              case "dddd":
                return o3[e3.$W];
              case "H":
                return String(s3);
              case "HH":
                return b.s(s3, 2, "0");
              case "h":
                return d2(1);
              case "hh":
                return d2(2);
              case "a":
                return $2(s3, u2, true);
              case "A":
                return $2(s3, u2, false);
              case "m":
                return String(u2);
              case "mm":
                return b.s(u2, 2, "0");
              case "s":
                return String(e3.$s);
              case "ss":
                return b.s(e3.$s, 2, "0");
              case "SSS":
                return b.s(e3.$ms, 3, "0");
              case "Z":
                return i2;
            }
            return null;
          }(t4) || i2.replace(":", "");
        });
      }, m2.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, m2.diff = function(r3, d2, l2) {
        var $2, y2 = this, M3 = b.p(d2), m3 = O(r3), v2 = (m3.utcOffset() - this.utcOffset()) * e2, g2 = this - m3, D2 = function() {
          return b.m(y2, m3);
        };
        switch (M3) {
          case h:
            $2 = D2() / 12;
            break;
          case c:
            $2 = D2();
            break;
          case f2:
            $2 = D2() / 3;
            break;
          case o2:
            $2 = (g2 - v2) / 6048e5;
            break;
          case a:
            $2 = (g2 - v2) / 864e5;
            break;
          case u:
            $2 = g2 / n2;
            break;
          case s2:
            $2 = g2 / e2;
            break;
          case i:
            $2 = g2 / t2;
            break;
          default:
            $2 = g2;
        }
        return l2 ? $2 : b.a($2);
      }, m2.daysInMonth = function() {
        return this.endOf(c).$D;
      }, m2.$locale = function() {
        return D[this.$L];
      }, m2.locale = function(t3, e3) {
        if (!t3)
          return this.$L;
        var n3 = this.clone(), r3 = w2(t3, e3, true);
        return r3 && (n3.$L = r3), n3;
      }, m2.clone = function() {
        return b.w(this.$d, this);
      }, m2.toDate = function() {
        return new Date(this.valueOf());
      }, m2.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, m2.toISOString = function() {
        return this.$d.toISOString();
      }, m2.toString = function() {
        return this.$d.toUTCString();
      }, M2;
    }(), Y = _.prototype;
    return O.prototype = Y, [["$ms", r2], ["$s", i], ["$m", s2], ["$H", u], ["$W", a], ["$M", c], ["$y", h], ["$D", d]].forEach(function(t3) {
      Y[t3[1]] = function(e3) {
        return this.$g(e3, t3[0], t3[1]);
      };
    }), O.extend = function(t3, e3) {
      return t3.$i || (t3(e3, _, O), t3.$i = true), O;
    }, O.locale = w2, O.isDayjs = S, O.unix = function(t3) {
      return O(1e3 * t3);
    }, O.en = D[g], O.Ls = D, O.p = {}, O;
  });
})(dayjs_min);
var dayjs_minExports = dayjs_min.exports;
const dayjs = /* @__PURE__ */ getDefaultExportFromCjs(dayjs_minExports);
var relativeTime$1 = { exports: {} };
(function(module2, exports2) {
  !function(r2, e2) {
    module2.exports = e2();
  }(commonjsGlobal, function() {
    return function(r2, e2, t2) {
      r2 = r2 || {};
      var n2 = e2.prototype, o2 = { future: "in %s", past: "%s ago", s: "a few seconds", m: "a minute", mm: "%d minutes", h: "an hour", hh: "%d hours", d: "a day", dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years" };
      function i(r3, e3, t3, o3) {
        return n2.fromToBase(r3, e3, t3, o3);
      }
      t2.en.relativeTime = o2, n2.fromToBase = function(e3, n3, i2, d2, u) {
        for (var f2, a, s2, l = i2.$locale().relativeTime || o2, h = r2.thresholds || [{ l: "s", r: 44, d: "second" }, { l: "m", r: 89 }, { l: "mm", r: 44, d: "minute" }, { l: "h", r: 89 }, { l: "hh", r: 21, d: "hour" }, { l: "d", r: 35 }, { l: "dd", r: 25, d: "day" }, { l: "M", r: 45 }, { l: "MM", r: 10, d: "month" }, { l: "y", r: 17 }, { l: "yy", d: "year" }], m = h.length, c = 0; c < m; c += 1) {
          var y = h[c];
          y.d && (f2 = d2 ? t2(e3).diff(i2, y.d, true) : i2.diff(e3, y.d, true));
          var p2 = (r2.rounding || Math.round)(Math.abs(f2));
          if (s2 = f2 > 0, p2 <= y.r || !y.r) {
            p2 <= 1 && c > 0 && (y = h[c - 1]);
            var v = l[y.l];
            u && (p2 = u("" + p2)), a = "string" == typeof v ? v.replace("%d", p2) : v(p2, n3, y.l, s2);
            break;
          }
        }
        if (n3)
          return a;
        var M = s2 ? l.future : l.past;
        return "function" == typeof M ? M(a) : M.replace("%s", a);
      }, n2.to = function(r3, e3) {
        return i(r3, e3, this, true);
      }, n2.from = function(r3, e3) {
        return i(r3, e3, this);
      };
      var d = function(r3) {
        return r3.$u ? t2.utc() : t2();
      };
      n2.toNow = function(r3) {
        return this.to(d(this), r3);
      }, n2.fromNow = function(r3) {
        return this.from(d(this), r3);
      };
    };
  });
})(relativeTime$1);
var relativeTimeExports = relativeTime$1.exports;
const relativeTime = /* @__PURE__ */ getDefaultExportFromCjs(relativeTimeExports);
var zhCn = { exports: {} };
(function(module2, exports2) {
  !function(e2, _) {
    module2.exports = _(dayjs_minExports);
  }(commonjsGlobal, function(e2) {
    function _(e3) {
      return e3 && "object" == typeof e3 && "default" in e3 ? e3 : { default: e3 };
    }
    var t2 = _(e2), d = { name: "zh-cn", weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"), weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"), weekdaysMin: "日_一_二_三_四_五_六".split("_"), months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"), monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"), ordinal: function(e3, _2) {
      return "W" === _2 ? e3 + "周" : e3 + "日";
    }, weekStart: 1, yearStart: 4, formats: { LT: "HH:mm", LTS: "HH:mm:ss", L: "YYYY/MM/DD", LL: "YYYY年M月D日", LLL: "YYYY年M月D日Ah点mm分", LLLL: "YYYY年M月D日ddddAh点mm分", l: "YYYY/M/D", ll: "YYYY年M月D日", lll: "YYYY年M月D日 HH:mm", llll: "YYYY年M月D日dddd HH:mm" }, relativeTime: { future: "%s内", past: "%s前", s: "几秒", m: "1 分钟", mm: "%d 分钟", h: "1 小时", hh: "%d 小时", d: "1 天", dd: "%d 天", M: "1 个月", MM: "%d 个月", y: "1 年", yy: "%d 年" }, meridiem: function(e3, _2) {
      var t3 = 100 * e3 + _2;
      return t3 < 600 ? "凌晨" : t3 < 900 ? "早上" : t3 < 1100 ? "上午" : t3 < 1300 ? "中午" : t3 < 1800 ? "下午" : "晚上";
    } };
    return t2.default.locale(d, null, true), d;
  });
})(zhCn);
const toString$1 = Object.prototype.toString;
function is(val, type) {
  return toString$1.call(val) === `[object ${type}]`;
}
function isDef(val) {
  return typeof val !== "undefined";
}
function isObject(val) {
  return val !== null && is(val, "Object");
}
function isEmpty(val) {
  if (isArray(val) || isString(val))
    return val.length === 0;
  if (val instanceof Map || val instanceof Set)
    return val.size === 0;
  if (isObject(val))
    return Object.keys(val).length === 0;
  return false;
}
function isDate(val) {
  return is(val, "Date");
}
function isNumber(val) {
  return is(val, "Number");
}
function isPromise(val) {
  return is(val, "Promise") || (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
}
function isString(val) {
  return is(val, "String");
}
function isFunction(val) {
  return typeof val === "function";
}
function isBoolean(val) {
  return is(val, "Boolean");
}
function isArray(val) {
  return val && Array.isArray(val);
}
function TypeOfFun(value) {
  if (value === null)
    return "null";
  const type = typeof value;
  if (type === "undefined" || type === "string")
    return type;
  const typeString = toString.call(value);
  switch (typeString) {
    case "[object Array]":
      return "array";
    case "[object Date]":
      return "date";
    case "[object Boolean]":
      return "boolean";
    case "[object Number]":
      return "number";
    case "[object Function]":
      return "function";
    case "[object RegExp]":
      return "regexp";
    case "[object Object]":
      if (void 0 !== value.nodeType) {
        if (value.nodeType === 3)
          return /\S/.test(value.nodeValue) ? "textnode" : "whitespace";
        else
          return "element";
      } else {
        return "object";
      }
    default:
      return "unknow";
  }
}
function getPropByPath(obj, keyPath) {
  try {
    return keyPath.split(".").reduce((prev, curr) => prev[curr], obj);
  } catch (error) {
    return "";
  }
}
function floatData(format, dataOp, mapOps) {
  const mergeFormat = Object.assign({}, format);
  const mergeMapOps = Object.assign({}, mapOps);
  if (Object.keys(dataOp).length > 0) {
    Object.keys(mergeFormat).forEach((keys) => {
      if (Object.prototype.hasOwnProperty.call(mergeMapOps, keys)) {
        const tof = TypeOfFun(mergeMapOps[keys]);
        if (tof === "function")
          mergeFormat[keys] = mergeMapOps[keys](dataOp);
        if (tof === "string")
          mergeFormat[keys] = dataOp[mergeMapOps[keys]];
      } else {
        if (dataOp[keys])
          mergeFormat[keys] = dataOp[keys];
      }
    });
    return mergeFormat;
  }
  return format;
}
function preventDefault(event, isStopPropagation) {
  if (typeof event.cancelable !== "boolean" || event.cancelable)
    event.preventDefault();
  if (isStopPropagation)
    event.stopPropagation();
}
function cacheStringFunction(fn) {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
function padZero(num, length = 2) {
  num += "";
  while (num.length < length)
    num = `0${num}`;
  return num.toString();
}
const { hasOwnProperty } = Object.prototype;
function assignKey(to, from, key) {
  const val = from[key];
  if (!isDef(val))
    return;
  if (!hasOwnProperty.call(to, key) || !isObject(val))
    to[key] = val;
  else
    to[key] = deepAssign(Object(to[key]), val);
}
function deepAssign(to, from) {
  Object.keys(from).forEach((key) => {
    assignKey(to, from, key);
  });
  return to;
}
function omit(obj, keys) {
  if (Object.prototype.toString.call(obj) === "[object Object]")
    return obj;
  return Object.keys(obj).reduce((prev, key) => {
    if (!keys.includes(key))
      prev[key] = obj[key];
    return prev;
  }, {});
}
function getRandomId() {
  return Math.random().toString(36).slice(-8);
}
function isLooseEqual(a, b) {
  if (a === b)
    return true;
  const isObjectA = isObject(a);
  const isObjectB = isObject(b);
  if (isObjectA && isObjectB)
    return JSON.stringify(a) === JSON.stringify(b);
  else if (!isObjectA && !isObjectB)
    return String(a) === String(b);
  else
    return false;
}
function isEqualArray(a, b) {
  if (a === b)
    return true;
  if (!isArray(a) || !isArray(b))
    return false;
  if (a.length !== b.length)
    return false;
  for (let i = 0; i < a.length; i++) {
    if (!isLooseEqual(a[i], b[i]))
      return false;
  }
  return true;
}
function isEqualValue(a, b) {
  if (a === b)
    return true;
  if (isArray(a) && isArray(b))
    return isEqualArray(a, b);
  return isLooseEqual(a, b);
}
function cloneDeep(obj, cache = /* @__PURE__ */ new WeakMap()) {
  if (obj === null || typeof obj !== "object")
    return obj;
  if (cache.has(obj))
    return cache.get(obj);
  let clone2;
  if (obj instanceof Date) {
    clone2 = new Date(obj.getTime());
  } else if (obj instanceof RegExp) {
    clone2 = new RegExp(obj);
  } else if (obj instanceof Map) {
    clone2 = new Map(Array.from(obj, ([key, value]) => [key, cloneDeep(value, cache)]));
  } else if (obj instanceof Set) {
    clone2 = new Set(Array.from(obj, (value) => cloneDeep(value, cache)));
  } else if (Array.isArray(obj)) {
    clone2 = obj.map((value) => cloneDeep(value, cache));
  } else if (Object.prototype.toString.call(obj) === "[object Object]") {
    clone2 = Object.create(Object.getPrototypeOf(obj));
    cache.set(obj, clone2);
    for (const [key, value] of Object.entries(obj))
      clone2[key] = cloneDeep(value, cache);
  } else {
    clone2 = Object.assign({}, obj);
  }
  cache.set(obj, clone2);
  return clone2;
}
function getTimeStamp(timeStr) {
  if (!timeStr)
    return Date.now();
  let t2 = timeStr;
  t2 = t2 > 0 ? +t2 : t2.toString().replace(/-/g, "/");
  return new Date(t2).getTime();
}
function isLeapYear(y) {
  return y % 4 === 0 && y % 100 !== 0 || y % 400 === 0;
}
function getWhatDay(year, month, day) {
  const date = /* @__PURE__ */ new Date(`${year}/${month}/${day}`);
  const index2 = date.getDay();
  const dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return dayNames[index2];
}
function getMonthPreDay(year, month) {
  const date = /* @__PURE__ */ new Date(`${year}/${month}/01`);
  let day = date.getDay();
  if (day === 0)
    day = 7;
  return day;
}
function getMonthDays(year, month) {
  if (month.startsWith("0"))
    month = month.split("")[1];
  return [0, 31, isLeapYear(Number(year)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}
function getNumTwoBit(n2) {
  n2 = Number(n2);
  return (n2 > 9 ? "" : "0") + n2;
}
function date2Str(date, split) {
  split = split || "-";
  const y = date.getFullYear();
  const m = getNumTwoBit(date.getMonth() + 1);
  const d = getNumTwoBit(date.getDate());
  return [y, m, d].join(split);
}
function getDay(i) {
  i = i || 0;
  let date = /* @__PURE__ */ new Date();
  const diff2 = i * (1e3 * 60 * 60 * 24);
  date = new Date(date.getTime() + diff2);
  return date2Str(date);
}
function compareDate(date1, date2) {
  const startTime = new Date(date1.replace("-", "/").replace("-", "/"));
  const endTime = new Date(date2.replace("-", "/").replace("-", "/"));
  if (startTime >= endTime)
    return false;
  return true;
}
function isEqual(date1, date2) {
  const startTime = new Date(date1).getTime();
  const endTime = new Date(date2).getTime();
  if (startTime === endTime)
    return true;
  return false;
}
function getMonthWeek(year, month, date, firstDayOfWeek = 0) {
  const dateNow = new Date(Number(year), Number.parseInt(month) - 1, Number(date));
  let w2 = dateNow.getDay();
  const d = dateNow.getDate();
  let remainder = 6 - w2;
  if (firstDayOfWeek !== 0) {
    w2 = w2 === 0 ? 7 : w2;
    remainder = 7 - w2;
  }
  return Math.ceil((d + remainder) / 7);
}
function getYearWeek(year, month, date) {
  const dateNow = new Date(Number(year), Number.parseInt(month) - 1, Number(date));
  const dateFirst = new Date(Number(year), 0, 1);
  const dataNumber = Math.round((dateNow.valueOf() - dateFirst.valueOf()) / 864e5);
  return Math.ceil((dataNumber + (dateFirst.getDay() + 1 - 1)) / 7);
}
function getWeekDate(year, month, date, firstDayOfWeek = 0) {
  const dateNow = new Date(Number(year), Number.parseInt(month) - 1, Number(date));
  const nowTime = dateNow.getTime();
  let day = dateNow.getDay();
  if (firstDayOfWeek === 0) {
    const oneDayTime = 24 * 60 * 60 * 1e3;
    const SundayTime = nowTime - day * oneDayTime;
    const SaturdayTime = nowTime + (6 - day) * oneDayTime;
    const sunday = date2Str(new Date(SundayTime));
    const saturday = date2Str(new Date(SaturdayTime));
    return [sunday, saturday];
  } else {
    day = day === 0 ? 7 : day;
    const oneDayTime = 24 * 60 * 60 * 1e3;
    const MondayTime = nowTime - (day - 1) * oneDayTime;
    const SundayTime = nowTime + (7 - day) * oneDayTime;
    const monday = date2Str(new Date(MondayTime));
    const sunday = date2Str(new Date(SundayTime));
    return [monday, sunday];
  }
}
function formatResultDate(date) {
  const days = [...date.split("-")];
  days[2] = getNumTwoBit(Number(days[2]));
  days[3] = `${days[0]}-${days[1]}-${days[2]}`;
  days[4] = getWhatDay(+days[0], +days[1], +days[2]);
  return days;
}
function ifDefPlatform() {
  let platform2;
  platform2 = "MP-WEIXIN";
  platform2 = "MP";
  return platform2;
}
const platform = ifDefPlatform();
const isH5 = platform === "H5";
const isMpAlipay = platform === "MP-ALIPAY";
function funInterceptor(interceptor, {
  args = [],
  done,
  canceled
}) {
  if (interceptor) {
    const returnVal = interceptor(null, ...args);
    if (isPromise(returnVal)) {
      returnVal.then((value) => {
        if (value)
          done(value);
        else if (canceled)
          canceled();
      }).catch(() => {
      });
    } else if (returnVal) {
      done();
    } else if (canceled) {
      canceled();
    }
  } else {
    done();
  }
}
const numericProp = [Number, String];
const truthProp = {
  type: Boolean,
  default: true
};
const nullableBooleanProp = {
  type: Boolean,
  default: void 0
};
function makeRequiredProp(type) {
  return {
    type,
    required: true
  };
}
function makeArrayProp(defaultVal = []) {
  return {
    type: Array,
    default: () => defaultVal
  };
}
function makeObjectProp(defaultVal) {
  return {
    type: Object,
    default: () => defaultVal
  };
}
function makeNumberProp(defaultVal) {
  return {
    type: Number,
    default: defaultVal
  };
}
function makeNumericProp(defaultVal) {
  return {
    type: numericProp,
    default: defaultVal
  };
}
function makeStringProp(defaultVal) {
  return {
    type: String,
    default: defaultVal
  };
}
const commonProps = {
  /**
   * @description 自定义类名
   */
  customClass: {
    type: [String, Object, Array],
    default: ""
  },
  /**
   * @description 自定义样式
   */
  customStyle: {
    type: [String, Object, Array],
    default: ""
  }
};
function pxCheck(value) {
  return Number.isNaN(Number(value)) ? String(value) : `${value}px`;
}
const _window = window;
function requestAniFrame() {
  if (typeof _window !== "undefined") {
    return _window.requestAnimationFrame || _window.webkitRequestAnimationFrame || function(callback) {
      _window.setTimeout(callback, 1e3 / 60);
    };
  } else {
    return function(callback) {
      setTimeout(callback, 1e3 / 60);
    };
  }
}
const requestAniFrame$1 = requestAniFrame();
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([\s\S]+)/;
const styleCommentRE = /\/\*.*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function stringifyStyle(styles) {
  let ret = "";
  if (!styles || isString(styles))
    return ret;
  for (const key in styles) {
    const value = styles[key];
    const normalizedKey = key.startsWith("--") ? key : hyphenate(key);
    if (isString(value) || typeof value === "number") {
      ret += `${normalizedKey}:${value};`;
    }
  }
  return ret;
}
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          if (!isEmpty(normalized[key]))
            res[key] = normalized[key];
        }
      }
    }
    return res;
  }
  if (isString(value))
    return value;
  if (isObject(value))
    return value;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized)
        res += `${normalized} `;
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name])
        res += `${name} `;
    }
  }
  return res.trim();
}
function getMainClass(props, componentName2, cls) {
  return normalizeClass([props.customClass, { [componentName2]: true }, cls]);
}
function getMainStyle(props, style) {
  return stringifyStyle(normalizeStyle([props.customStyle, style]));
}
const UPDATE_MODEL_EVENT = "update:modelValue";
const UPDATE_VISIBLE_EVENT = "update:visible";
const CHANGE_EVENT = "change";
const INPUT_EVENT = "input";
const CLICK_EVENT = "click";
const OPEN_EVENT = "open";
const CLOSE_EVENT = "close";
const OPENED_EVENT = "opened";
const CLOSED_EVENT = "closed";
const FOCUS_EVENT = "focus";
const BLUR_EVENT = "blur";
const CONFIRM_EVENT = "confirm";
const SEARCH_EVENT = "search";
const CLEAR_EVENT = "clear";
const CANCEL_EVENT = "cancel";
const CHOOSE_EVENT = "choose";
const SELECT_EVENT = "select";
const SELECTED_EVENT = "selected";
const PREFIX = "nut";
const animationName = {
  center: "fade",
  top: "slide-down",
  bottom: "slide-up",
  left: "slide-left",
  right: "slide-right"
};
const notifyDefaultOptionsKey = "__NOTIFY_OPTIONS__";
const notifyDefaultOptions = {
  visible: false,
  type: "danger",
  msg: "",
  position: "top",
  duration: 3e3,
  zIndex: 9999
};
const notifyProps = {
  ...commonProps,
  /**
   * @description 显示与否
   */
  visible: {
    type: Boolean,
    default: notifyDefaultOptions.visible
  },
  /**
   * @description 配置注入的key
   */
  selector: String,
  /**
   * @description 提示的信息类型，可选值为`base` `primary` `success` `danger` `warning`
   */
  type: makeStringProp(notifyDefaultOptions.type),
  /**
   * @description 展示文案，支持通过`\n`换行
   */
  msg: makeStringProp(notifyDefaultOptions.msg),
  /**
   * @description 自定义位置，可选值为 `top` `bottom`
   */
  position: makeStringProp(notifyDefaultOptions.position),
  /**
   * @description 展示时长(ms)，值为 0 时，notify 不会消失
   */
  duration: makeNumberProp(notifyDefaultOptions.duration),
  /**
   * @description 自定义类名
   */
  className: makeStringProp(""),
  /**
   * @description 组件z-index
   */
  zIndex: makeNumberProp(notifyDefaultOptions.zIndex),
  /**
   * @description 字体颜色
   */
  customColor: makeStringProp(""),
  /**
   * @description 背景颜色
   */
  background: makeStringProp(""),
  /**
   * @description 是否留出顶部安全距离（默认为状态栏高度）
   */
  safeAreaInsetTop: Boolean,
  /**
   * @description 是否留出底部安全距离（启用后通过 `safeHeight` 指定距离）
   */
  safeAreaInsetBottom: Boolean,
  /**
   * @description 自定义安全距离
   */
  safeHeight: makeNumericProp(""),
  /**
   * @description 点击时的回调函数
   */
  onClick: Function,
  /**
   * @description 关闭时的回调函数
   */
  onClose: Function,
  /**
   * @description 关闭动画完成时回调函数
   */
  onClosed: Function
};
const notifyEmits = {
  [UPDATE_VISIBLE_EVENT]: (value) => isBoolean(value),
  [CLICK_EVENT]: () => true,
  [CLOSE_EVENT]: () => true,
  [CLOSED_EVENT]: () => true
};
function useNotify(selector = "") {
  const notifyOptionsKey = `${notifyDefaultOptionsKey}${selector || ""}`;
  const notifyOptions = ref(cloneDeep(notifyDefaultOptions));
  provide(notifyOptionsKey, notifyOptions);
  function show(type, msg, options) {
    notifyOptions.value = Object.assign({
      visible: true,
      type,
      msg
    }, options);
  }
  function legacyShow(options) {
    show(notifyDefaultOptions.type, options.msg || notifyDefaultOptions.msg, options);
  }
  function showPrimary(msg, options) {
    show("primary", msg, options);
  }
  function showSuccess(msg, options) {
    show("success", msg, options);
  }
  function showDanger(msg, options) {
    show("danger", msg, options);
  }
  function showWarning(msg, options) {
    show("warning", msg, options);
  }
  function showCustom(msg, options) {
    show("custom", msg, options);
  }
  function hide() {
    notifyOptions.value = Object.assign(cloneDeep(notifyOptions.value), {
      visible: false
    });
  }
  return {
    showNotify: legacyShow,
    hideNotify: hide,
    show,
    primary: showPrimary,
    success: showSuccess,
    danger: showDanger,
    warning: showWarning,
    custom: showCustom,
    hide
  };
}
const toastDefaultOptionsKey = "__TOAST_OPTIONS__";
const toastDefaultOptions = {
  visible: false,
  type: "text",
  msg: "",
  duration: 2e3,
  size: "base",
  zIndex: 50,
  iconSize: "20px",
  center: true,
  bottom: "30px",
  textAlignCenter: true,
  loadingRotate: true
};
const toastProps = {
  ...commonProps,
  /**
   * @description 是否显示
   */
  visible: {
    type: Boolean,
    default: toastDefaultOptions.visible
  },
  /**
   * @description 配置注入的key
   */
  selector: String,
  /**
   * @description 弹框类型，可选值（text、success、error、warning、loading）
   */
  type: makeStringProp(toastDefaultOptions.type),
  /**
   * @description 标题
   */
  title: String,
  /**
   * @description 消息文本内容，支持传入HTML
   */
  msg: makeStringProp(toastDefaultOptions.msg),
  /**
   * @description 展示时长（单位：ms）
   * - 值为0时toast不会自动关闭
   * - 组合式函数用法/Ref用法中，loading类型默认为0
   */
  duration: makeNumberProp(toastDefaultOptions.duration),
  /**
   * @description 文案尺寸，可选值（small、base、large）
   */
  size: makeStringProp(toastDefaultOptions.size),
  /**
   * @description 组件z-index
   */
  zIndex: makeNumberProp(toastDefaultOptions.zIndex),
  /**
   * @description 自定义图标
   */
  icon: String,
  /**
   * @description 图标大小
   */
  iconSize: makeNumericProp(toastDefaultOptions.iconSize),
  /**
   * @description 背景颜色
   */
  bgColor: String,
  /**
   * @description 是否显示遮罩层
   * - 组合式函数用法/Ref用法中，loading类型默认为true
   */
  cover: Boolean,
  /**
   * @description 遮罩层颜色，默认透明
   */
  coverColor: String,
  /**
   * @description 是否展示在页面中部（为false时展示在底部）
   */
  center: {
    type: Boolean,
    default: toastDefaultOptions.center
  },
  /**
   * @description 距页面底部的距离（center为false时生效）
   */
  bottom: makeNumericProp(toastDefaultOptions.bottom),
  /**
   * @description 文案是否居中
   */
  textAlignCenter: {
    type: Boolean,
    default: toastDefaultOptions.textAlignCenter
  },
  /**
   * @description loading图标是否旋转（仅对loading类型生效）
   */
  loadingRotate: {
    type: Boolean,
    default: toastDefaultOptions.loadingRotate
  },
  /**
   * @description 是否在点击遮罩层后关闭提示
   */
  closeOnClickOverlay: Boolean,
  /**
   * @description 关闭时触发的事件
   */
  onClose: Function,
  /**
   * @description 关闭动画完成时触发的事件
   */
  onClosed: Function
};
const toastEmits = {
  [UPDATE_VISIBLE_EVENT]: (visible) => isBoolean(visible),
  [CLOSE_EVENT]: () => true,
  [CLOSED_EVENT]: () => true
};
const skeletonProps = {
  ...commonProps,
  /**
   * @description 是否显示骨架屏
   */
  loading: truthProp,
  /**
   * @description 每行宽度
   */
  width: makeStringProp("100px"),
  /**
   * @description 每行高度
   */
  height: makeStringProp("15px"),
  /**
   * @description 是否开启骨架屏动画
   */
  animated: Boolean,
  /**
   * @description 是否显示头像
   */
  avatar: Boolean,
  /**
   * @description 头像形状
   */
  avatarShape: makeStringProp("round"),
  /**
   * @description 头像大小
   */
  avatarSize: makeStringProp("50px"),
  /**
   * @description 标题/段落是否采用圆角风格
   */
  round: Boolean,
  /**
   * @description 设置段落行数
   */
  row: makeStringProp("1"),
  /**
   * @description 是否显示段落标题
   */
  title: truthProp
};
const tagProps = {
  ...commonProps,
  /**
   * @description 标签颜色
   */
  customColor: String,
  /**
   * @description 文本颜色，优先级高于 color 属性
   */
  textColor: String,
  /**
   * @description 标签类型，可选值为 primary、success、danger、warning
   */
  type: makeStringProp("default"),
  /**
   * @description 是否为空心样式
   */
  plain: Boolean,
  /**
   * @description 是否为圆角样式
   */
  round: Boolean,
  /**
   * @description 是否为标记样式
   */
  mark: Boolean,
  /**
   * @description 是否为可关闭标签
   */
  closeable: Boolean,
  /**
   * @description 关闭图标大小
   */
  closeIconSize: makeNumericProp(11),
  /**
   * @description 是否禁用
   */
  disabled: Boolean
};
const tagEmits = {
  [CLICK_EVENT]: (evt) => evt instanceof Object,
  [CLOSE_EVENT]: (evt) => evt instanceof Object
};
const cellProps = {
  ...commonProps,
  /**
   * @description 标题名称
   */
  title: String,
  /**
   * @description 左侧副标题
   */
  subTitle: String,
  /**
   * @description 右侧描述
   */
  desc: String,
  /**
   * @description 右侧描述文本对齐方式 [text-align](https://www.w3school.com.cn/cssref/pr_text_text-align.asp)
   */
  descTextAlign: makeStringProp("right"),
  /**
   * @description 是否展示右侧箭头并开启点击反馈
   */
  isLink: Boolean,
  /**
   * @description 点击后跳转的目标路由对象，
   */
  to: String,
  /**
   * @description 圆角半径
   */
  roundRadius: makeNumericProp(void 0),
  /**
   * @description 是否使内容垂直居中
   */
  center: Boolean,
  /**
   * @description 单元格大小，可选值为 `large`
   */
  size: makeStringProp(""),
  /**
   * @description 是否启用点击效果
   */
  clickable: Boolean,
  /**
   * @description 左侧图标
   */
  icon: String,
  /**
   * @description 标题宽度
   */
  titleWidth: makeNumericProp(void 0)
};
const cellEmits = {
  [CLICK_EVENT]: (event) => event instanceof Object
};
const buttonProps = {
  ...commonProps,
  /**
   * @description 指定按钮按下去的样式类
   */
  hoverClass: makeStringProp("button-hover"),
  /**
   * @description 按住后多久出现点击态，单位毫秒
   */
  hoverStartTime: makeNumberProp(20),
  /**
   * @description 手指松开后点击态保留时间，单位毫秒
   */
  hoverStayTime: makeNumberProp(70),
  /**
   * @description 按钮颜色，支持传入 `linear-gradient` 渐变色
   */
  customColor: String,
  /**
   * @description 形状，可选值为 `square` `round`
   */
  shape: makeStringProp("round"),
  /**
   * @description 是否为朴素按钮
   */
  plain: Boolean,
  /**
   * @description 按钮 `loading` 状态
   */
  loading: Boolean,
  /**
   * @description 是否禁用按钮
   */
  disabled: Boolean,
  /**
   * @description 按钮类型，可选值为 `primary` `info` `warning` `danger` `success` `default`
   */
  type: makeStringProp("default"),
  /**
   * @description 表单类型，可选值 `button` `submit` `reset`
   */
  formType: makeStringProp("button"),
  /**
   * @description 尺寸，可选值为 `large` `small` `mini` `normal`
   */
  size: makeStringProp("normal"),
  /**
   * @description 是否为块级元素
   */
  block: Boolean,
  /**
   * @description 小程序开放能力
   */
  openType: String,
  /**
   * @description 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文
   */
  lang: makeStringProp("en"),
  /**
   * @description 会话来源，openType="contact"时有效
   */
  sessionFrom: String,
  /**
   * @description 会话内消息卡片标题，openType="contact"时有效
   */
  sendMessageTitle: String,
  /**
   * @description 会话内消息卡片点击跳转小程序路径，openType="contact"时有效
   */
  sendMessagePath: String,
  /**
   * @description 会话内消息卡片图片，openType="contact"时有效
   */
  sendMessageImg: String,
  /**
   * @description 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，用户点击后可以快速发送小程序消息，openType="contact"时有效
   */
  showMessageCard: Boolean,
  /**
   * @description 打开群资料卡时，传递的群号，openType="openGroupProfile"时有效
   */
  groupId: String,
  /**
   * @description 打开频道页面时，传递的频道号 openType="openGuildProfile"时有效
   */
  guildId: makeStringProp(""),
  /**
   * @description 打开公众号资料卡时，传递的号码 openType="openPublicProfile"时有效
   */
  publicId: String,
  /**
   * @description 客服的抖音号,openType="im"时有效
   */
  dataImId: String,
  /**
   * @description IM卡片类型,openType="im"时有效
   */
  dataImType: String,
  /**
   * @description 商品的id，仅支持泛知识课程库和生活服务商品库中的商品,openType="im"时有效
   */
  dataGoodsId: String,
  /**
   * @description 订单的id，仅支持交易2.0订单, openType="im"时有效
   */
  dataOrderId: String,
  /**
   * @description 商品类型，“1”代表生活服务，“2”代表泛知识。openType="im"时有效
   */
  dataBizLine: String
};
const buttonEmits = {
  [CLICK_EVENT]: (evt) => evt instanceof Object,
  getphonenumber: (evt) => evt instanceof Object,
  getuserinfo: (evt) => evt instanceof Object,
  error: (evt) => evt instanceof Object,
  opensetting: (evt) => evt instanceof Object,
  launchapp: (evt) => evt instanceof Object,
  contact: (evt) => evt instanceof Object,
  chooseavatar: (evt) => evt instanceof Object,
  agreeprivacyauthorization: (evt) => evt instanceof Object,
  addgroupapp: (evt) => evt instanceof Object,
  chooseaddress: (evt) => evt instanceof Object,
  chooseinvoicetitle: (evt) => evt instanceof Object,
  subscribe: (evt) => evt instanceof Object,
  login: (evt) => evt instanceof Object,
  im: (evt) => evt instanceof Object
};
function defineLocaleConfig(locale) {
  return locale;
}
function EnUSLang() {
  return defineLocaleConfig({
    save: "Save",
    confirm: "Confirm",
    cancel: "Cancel",
    done: "Done",
    noData: "No Data",
    placeholder: "Placeholder",
    select: "Select",
    video: {
      errorTip: "Error Tip",
      clickRetry: "Click Retry"
    },
    fixednav: {
      activeText: "Close Nav",
      unActiveText: "Open Nav"
    },
    pagination: {
      prev: "Previous",
      next: "Next"
    },
    calendaritem: {
      weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      end: "End",
      start: "Start",
      title: "Calendar",
      monthTitle: (year, month) => `${year}/${month}`,
      today: "Today"
    },
    shortpassword: {
      title: "Please input a password",
      desc: "Verify",
      tips: "Forget password"
    },
    uploader: {
      ready: "Ready",
      readyUpload: "Ready to upload",
      waitingUpload: "Waiting for upload",
      uploading: "Uploading",
      success: "Upload successful",
      error: "Upload failed"
    },
    countdown: {
      day: " Day ",
      hour: " Hour ",
      minute: " Minute ",
      second: " Second "
    },
    address: {
      selectRegion: "Select Region",
      deliveryTo: "Delivery To",
      chooseAnotherAddress: "Choose Another Address"
    },
    signature: {
      reSign: "Re Sign",
      unSupportTpl: "Sorry, the current browser doesn't support canvas, so we can't use this control!"
    },
    ecard: {
      chooseText: "Select",
      otherValueText: "Other Value",
      placeholder: "Placeholder"
    },
    timeselect: {
      pickupTime: "Pickup Time"
    },
    sku: {
      buyNow: "Buy Now",
      buyNumber: "Buy Number",
      addToCart: "Add to Cart"
    },
    skuheader: {
      skuId: "Sku Number"
    },
    addresslist: {
      addAddress: "Add New Address",
      default: "default"
    },
    comment: {
      complaintsText: "I have a complaint",
      additionalReview: (day) => `Review after ${day} days of purchase`,
      additionalImages: (length) => `There are ${length} follow-up comments`
    },
    infiniteloading: {
      loading: "Loading...",
      pullTxt: "Loose to refresh",
      loadMoreTxt: "Oops, this is the bottom"
    },
    datepicker: {
      year: "Year",
      month: "Month",
      day: "Day",
      hour: "Hour",
      min: "Minute",
      seconds: "Second"
    },
    audiooperate: {
      back: "Back",
      start: "Start",
      pause: "Pause",
      forward: "Forward",
      mute: "Mute"
    },
    pullrefresh: {
      pulling: "Pull to refresh...",
      loosing: "Loose to refresh...",
      loading: "Loading..."
    }
  });
}
function ZhCNLang() {
  return defineLocaleConfig({
    save: "保存",
    confirm: "确认",
    cancel: "取消",
    done: "完成",
    noData: "暂无数据",
    placeholder: "请输入",
    select: "请选择",
    video: {
      errorTip: "视频加载失败",
      clickRetry: "点击重试"
    },
    fixednav: {
      activeText: "收起导航",
      unActiveText: "快速导航"
    },
    pagination: {
      prev: "上一页",
      next: "下一页"
    },
    calendaritem: {
      weekdays: ["日", "一", "二", "三", "四", "五", "六"],
      end: "结束",
      start: "开始",
      title: "日期选择",
      monthTitle: (year, month) => `${year}年${month}月`,
      today: "今天"
    },
    shortpassword: {
      title: "请输入密码",
      desc: "您使用了虚拟资产，请进行验证",
      tips: "忘记密码"
    },
    uploader: {
      ready: "准备完成",
      readyUpload: "准备上传",
      waitingUpload: "等待上传",
      uploading: "上传中",
      success: "上传成功",
      error: "上传失败"
    },
    countdown: {
      day: "天",
      hour: "时",
      minute: "分",
      second: "秒"
    },
    address: {
      selectRegion: "请选择所在地区",
      deliveryTo: "配送至",
      chooseAnotherAddress: "选择其他地址"
    },
    signature: {
      reSign: "重签",
      unSupportTpl: "对不起，当前浏览器不支持Canvas，无法使用本控件！"
    },
    ecard: {
      chooseText: "请选择电子卡面值",
      otherValueText: "其他面值",
      placeholder: "请输入1-5000整数"
    },
    timeselect: {
      pickupTime: "取件时间"
    },
    sku: {
      buyNow: "立即购买",
      buyNumber: "购买数量",
      addToCart: "加入购物车"
    },
    skuheader: {
      skuId: "商品编号"
    },
    addresslist: {
      addAddress: "新建地址",
      default: "默认"
    },
    comment: {
      complaintsText: "我要投诉",
      additionalReview: (day) => `购买${day}天后追评`,
      additionalImages: (length) => `${length}张追评图片`
    },
    infiniteloading: {
      loading: "加载中...",
      pullTxt: "松开刷新",
      loadMoreTxt: "哎呀，这里是底部了啦"
    },
    datepicker: {
      year: "年",
      month: "月",
      day: "日",
      hour: "时",
      min: "分",
      seconds: "秒"
    },
    audiooperate: {
      back: "倒退",
      start: "开始",
      pause: "暂停",
      forward: "快进",
      mute: "静音"
    },
    pullrefresh: {
      pulling: "下拉刷新",
      loosing: "释放刷新",
      loading: "加载中..."
    }
  });
}
const currentLang = ref("zh-CN");
const langs = reactive({
  "zh-CN": ZhCNLang(),
  "en-US": EnUSLang()
});
const Locale = {
  languages() {
    return langs[currentLang.value];
  },
  use(lang, Languages) {
    currentLang.value = lang;
    if (Languages)
      langs[lang] = Languages;
  },
  merge(Languages) {
    deepAssign(this.languages(), Languages);
  }
};
function useTranslate(compName) {
  function translate(keyPath, ...args) {
    const { languages } = Locale;
    const text = getPropByPath(languages(), `${compName.split("-").slice(1).join("-").replace("-", "")}.${keyPath}`) || getPropByPath(languages(), keyPath);
    return isFunction(text) ? text(...args) : text;
  }
  return {
    translate
  };
}
const emptyProps = {
  ...commonProps,
  /**
   * @description 图片类型，可选值为 `empty`、`error`、`network`，支持传入图片 `URL`
   */
  image: makeStringProp("empty"),
  /**
   * @description 图片大小，单位为 `px`
   */
  imageSize: makeNumericProp(""),
  /**
   * @description 图片下方的描述文字
   */
  description: makeStringProp("")
};
const dividerProps = {
  ...commonProps,
  /**
   * @description 内容位置，可选值为 `left`、`right`、`center`
   */
  contentPosition: makeStringProp("center"),
  /**
   * @description 是否使用虚线
   */
  dashed: Boolean,
  /**
   * @description 是否使用 `0.5px` 线
   */
  hairline: truthProp,
  /**
   * @description 水平还是垂直类型，可选值 `vertical`和`horizontal`
   */
  direction: makeStringProp("horizontal")
};
const safeareaProps = {
  ...commonProps,
  /**
   * @description 安全区的位置
   */
  position: String
};
let globalZIndex = 2e3;
function useGlobalZIndex() {
  return ++globalZIndex;
}
function useInject(key) {
  const parent = inject(key, null);
  if (parent) {
    const instance = getCurrentInstance();
    const { add: add2, remove: remove2, internalChildren } = parent;
    add2(instance);
    onUnmounted(() => remove2(instance));
    const index2 = computed(() => internalChildren.indexOf(instance));
    return {
      parent,
      index: index2
    };
  }
  return {
    parent: null,
    index: ref(-1)
  };
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function flattenVNodes(shouldTraverseChildren, childName) {
  const result = [];
  const traverse2 = (children) => {
    if (!Array.isArray(children))
      return;
    children.forEach((child) => {
      var _a;
      if (!isVNode(child))
        return;
      if (childName) {
        if (child.type && child.type.name === childName) {
          result.push(child);
          return;
        }
      } else {
        result.push(child);
      }
      if ((_a = child.component) == null ? void 0 : _a.subTree)
        traverse2(child.component.subTree.children);
      if (child.children)
        traverse2(child.children);
    });
  };
  traverse2(shouldTraverseChildren);
  return result;
}
function sortChildren(parent, internalChildren, childName) {
  const vnodes = flattenVNodes(parent && parent.subTree && parent.subTree.children, childName);
  internalChildren.sort((a, b) => {
    return vnodes.indexOf(a.vnode) - vnodes.indexOf(b.vnode);
  });
}
function useProvide(key, childName) {
  const internalChildren = shallowReactive([]);
  const publicChildren = shallowReactive([]);
  const parent = getCurrentInstance();
  const add2 = (child) => {
    if (!child.proxy)
      return;
    internalChildren.push(markRaw(child));
    publicChildren.push(markRaw(child.proxy));
    sortChildren(parent, internalChildren, childName);
  };
  const remove2 = (child) => {
    if (child.proxy) {
      internalChildren.splice(internalChildren.indexOf(markRaw(child)), 1);
      publicChildren.splice(publicChildren.indexOf(markRaw(child.proxy)), 1);
    }
  };
  return (value) => {
    provide(key, {
      add: add2,
      remove: remove2,
      internalChildren,
      ...value
    });
    return {
      internalChildren,
      children: publicChildren
    };
  };
}
function useSelectorQuery(instance) {
  let query = null;
  if (!instance)
    instance = getCurrentInstance();
  if (!instance)
    index.__f__("warn", "at node_modules/nutui-uniapp/components/_hooks/useSelectorQuery.ts:11", "useSelectorQuery", "useSelectorQuery必须在setup函数中使用");
  query = index.createSelectorQuery().in(instance);
  const getSelectorNodeInfo = (selector) => {
    return new Promise((resolve2, reject) => {
      if (query) {
        query.select(selector).boundingClientRect((res) => {
          const selectRes = res;
          if (selectRes)
            resolve2(selectRes);
          else
            reject(new Error(`未找到对应节点: ${selector}`));
        }).exec();
      } else {
        reject(new Error("未找到对应的SelectorQuery实例"));
      }
    });
  };
  const getSelectorNodeInfos = (selector) => {
    return new Promise((resolve2, reject) => {
      if (query) {
        query.selectAll(selector).boundingClientRect((res) => {
          const selectRes = res;
          if (selectRes && selectRes.length > 0)
            resolve2(selectRes);
          else
            reject(new Error(`未找到对应节点: ${selector}`));
        }).exec();
      } else {
        reject(new Error("未找到对应的SelectorQuery实例"));
      }
    });
  };
  return {
    query,
    getSelectorNodeInfo,
    getSelectorNodeInfos
  };
}
function useRect(id, instance) {
  const { getSelectorNodeInfo } = useSelectorQuery(instance);
  return getSelectorNodeInfo(`#${id}`);
}
const MIN_DISTANCE = 10;
function getDirection(x, y) {
  if (x > y && x > MIN_DISTANCE)
    return "horizontal";
  if (y > x && y > MIN_DISTANCE)
    return "vertical";
  return "";
}
function useTouch() {
  const startX = ref(0);
  const startY = ref(0);
  const moveX = ref(0);
  const moveY = ref(0);
  const deltaX = ref(0);
  const deltaY = ref(0);
  const offsetX = ref(0);
  const offsetY = ref(0);
  const direction = ref("");
  const isVertical = () => direction.value === "vertical";
  const isHorizontal = () => direction.value === "horizontal";
  const reset = () => {
    deltaX.value = 0;
    deltaY.value = 0;
    offsetX.value = 0;
    offsetY.value = 0;
    direction.value = "";
  };
  const start = (event) => {
    reset();
    startX.value = event.touches[0].clientX;
    startY.value = event.touches[0].clientY;
  };
  const move = (event) => {
    const touch = event.touches[0];
    deltaX.value = touch.clientX - startX.value;
    deltaY.value = touch.clientY - startY.value;
    moveX.value = touch.clientX;
    moveY.value = touch.clientY;
    offsetX.value = Math.abs(deltaX.value);
    offsetY.value = Math.abs(deltaY.value);
    if (!direction.value)
      direction.value = getDirection(offsetX.value, offsetY.value);
  };
  return {
    move,
    start,
    reset,
    startX,
    startY,
    moveX,
    moveY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    direction,
    isVertical,
    isHorizontal
  };
}
const TAB_KEY = Symbol("tabs");
const tabsProps = {
  ...commonProps,
  /**
   * @description 绑定当前选中标签的标识符
   */
  modelValue: makeNumericProp(0),
  /**
   * @description 标签选中色
   */
  customColor: String,
  /**
   * @description 使用横纵方向,可选值`horizontal`、`vertical`
   */
  direction: makeStringProp("horizontal"),
  /**
   * @description 标签栏字体尺寸大小,可选值`large` `normal` `small`
   */
  size: makeStringProp("normal"),
  /**
   * @description 选中底部展示样式,可选值 `line`、`smile`
   */
  type: makeStringProp("line"),
  /**
   * @description 标签栏是否可以滚动
   */
  titleScroll: Boolean,
  /**
   * @description 是否省略过长的标题文字
   */
  ellipsis: truthProp,
  /**
   * @description 是否开启手势左右滑动切换
   */
  swipeable: Boolean,
  /**
   * @description 自动高度。设置为 true 时，nut-tabs 和 nut-tabs__content 会随着当前 nut-tab-pane 的高度而发生变化,使用此属性时必须设置nut-tabs的`pane-key`
   */
  autoHeight: Boolean,
  /**
   * @description 标签栏背景颜色
   */
  background: String,
  /**
   * @description 切换动画时长，单位 ms。0 代表无动画，此时必须设置 pane-key
   */
  animatedTime: makeNumericProp(300),
  /**
   * @description 标签间隙
   */
  titleGutter: makeNumericProp(0),
  /**
   * @description 横轴方向的标题对齐方式，可选值 left、center
   */
  align: makeStringProp("center")
};
const tabsEmits = {
  [CLICK_EVENT]: (val) => val instanceof Object,
  [CHANGE_EVENT]: (val) => val instanceof Object,
  [UPDATE_MODEL_EVENT]: (val) => isString(val)
};
class Title {
  constructor() {
    this.title = "";
    this.paneKey = "";
    this.disabled = false;
  }
}
const tabpaneProps = {
  ...commonProps,
  /**
   * @description 标题
   */
  title: makeNumericProp(""),
  /**
   * @description 标签 Key, 匹配的标识符
   */
  paneKey: makeNumericProp(""),
  /**
   * @description 是否禁用标签
   */
  disabled: Boolean
};
const tabpaneEmits = {
  [CLICK_EVENT]: () => true
};
function useTabContentTouch(props, tabMethods, uni, useRect2) {
  const tabsContentRef = ref();
  const tabsContentID = `tabsContentRef-${getRandomId()}`;
  const tabsContentRefRect = ref({ width: 0, height: 0 });
  const initUniWidth = async () => {
    var _a, _b;
    if (uni) {
      const rect = await useRect2(tabsContentID, uni);
      tabsContentRefRect.value.width = rect.width || 0;
      tabsContentRefRect.value.height = rect.height || 0;
    } else {
      tabsContentRefRect.value.width = ((_a = tabsContentRef.value) == null ? void 0 : _a.clientWidth) || 0;
      tabsContentRefRect.value.height = ((_b = tabsContentRef.value) == null ? void 0 : _b.clientHeight) || 0;
    }
  };
  onMounted(() => {
    setTimeout(() => {
      initUniWidth();
    }, 100);
  });
  const touchState = reactive({
    offset: 0,
    moving: false
  });
  const touch = useTouch();
  let position = "";
  const setoffset = (deltaX, deltaY) => {
    var _a;
    let offset = deltaX;
    if (props.direction === "horizontal") {
      position = deltaX > 0 ? "right" : "left";
      offset = Math.abs(offset) / tabsContentRefRect.value.width * 100;
    } else {
      position = deltaY > 0 ? "bottom" : "top";
      offset = deltaY;
      offset = Math.abs(offset) / ((_a = tabsContentRefRect.value) == null ? void 0 : _a.height) * 100;
    }
    if (offset > 85)
      offset = 85;
    switch (position) {
      case "left":
      case "top":
        if (tabMethods.isEnd()) {
          offset = 0;
          touchState.moving = false;
        }
        break;
      case "right":
      case "bottom":
        offset = -offset;
        if (tabMethods.isBegin()) {
          offset = 0;
          touchState.moving = false;
        }
        break;
    }
    touchState.offset = offset;
  };
  const touchMethods = {
    onTouchStart(event) {
      if (!props.swipeable)
        return;
      touch.start(event);
    },
    onTouchMove(event) {
      if (!props.swipeable)
        return;
      touch.move(event);
      touchState.moving = true;
      setoffset(touch.deltaX.value, touch.deltaY.value);
      if (props.direction === "horizontal" && touch.isHorizontal()) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (props.direction === "vertical" && touch.isVertical()) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    onTouchEnd() {
      if (touchState.moving) {
        touchState.moving = false;
        switch (position) {
          case "left":
          case "top":
            if (touchState.offset > 35)
              tabMethods.next();
            break;
          case "right":
          case "bottom":
            if (touchState.offset < -35)
              tabMethods.prev();
            break;
        }
      }
    }
  };
  return { touchMethods, touchState, tabsContentRef, tabsContentID };
}
const overlayProps = {
  ...commonProps,
  /**
   * @description 控制遮罩的显示/隐藏
   */
  visible: Boolean,
  /**
   * @description 自定义遮罩层级
   */
  zIndex: Number,
  /**
   * @description 显示/隐藏的动画时长，单位毫秒
   */
  duration: makeNumericProp(300),
  /**
   * @description 自定义遮罩类名
   */
  overlayClass: makeStringProp(""),
  /**
   * @description 自定义遮罩样式
   */
  overlayStyle: Object,
  /**
   * @description 遮罩显示时的背景是否锁定
   */
  lockScroll: Boolean,
  /**
   * @description 点击遮罩时是否关闭
   */
  closeOnClickOverlay: truthProp,
  /**
   * @description 是否保留遮罩关闭后的内容
   */
  destroyOnClose: Boolean
};
const overlayEmits = {
  [UPDATE_VISIBLE_EVENT]: (visible) => isBoolean(visible),
  [CLICK_EVENT]: (evt) => evt instanceof Object
};
const popupProps = {
  ...overlayProps,
  ...commonProps,
  /**
   * @description 弹出位置（top,bottom,left,right,center）
   */
  position: makeStringProp("center"),
  /**
   * @description 动画名
   */
  transition: {
    type: String,
    default: ""
  },
  /**
   * @description 自定义弹框类名
   */
  popClass: makeStringProp(""),
  /**
   * @description 是否显示圆角
   */
  round: Boolean,
  /**
   * @description 是否显示关闭按钮
   */
  closeable: Boolean,
  /**
   * @description 关闭按钮图标
   */
  closeIcon: makeStringProp("close"),
  /**
   * @description 关闭按钮位置（top-left,top-right,bottom-left,bottom-right）
   */
  closeIconPosition: makeStringProp("top-right"),
  /**
   * @description 是否保留弹层关闭后的内容
   */
  destroyOnClose: truthProp,
  /**
   * @description 是否显示遮罩层
   */
  overlay: truthProp,
  /**
   * @description 是否开启 iPhone 系列全面屏底部安全区适配，仅当 `position` 为 `bottom` 时有效
   */
  safeAreaInsetBottom: Boolean,
  /**
   * @description 是否开启 iPhone 顶部安全区适配
   */
  safeAreaInsetTop: truthProp
};
const popupEmits = {
  [UPDATE_VISIBLE_EVENT]: (value) => true,
  "click-pop": (event) => true,
  "click-close-icon": () => true,
  "click-overlay": () => true,
  [OPEN_EVENT]: () => true,
  [OPENED_EVENT]: () => true,
  [CLOSE_EVENT]: () => true,
  [CLOSED_EVENT]: () => true,
  /**
   * @deprecated
   */
  "opend": () => true
};
const componentName$3 = `${PREFIX}-popup`;
function usePopup(props, emit2) {
  const state = reactive({
    innerVisible: false,
    innerIndex: props.zIndex,
    showSlot: true
  });
  const classes = computed(() => {
    return getMainClass(props, componentName$3, {
      round: props.round,
      [`nut-popup--${props.position}`]: true,
      [`nut-popup--${props.position}--safebottom`]: props.position === "bottom" && props.safeAreaInsetBottom,
      [`nut-popup--${props.position}--safetop`]: props.position === "top" && props.safeAreaInsetTop,
      [props.popClass]: true
    });
  });
  const popStyle = computed(() => {
    return getMainStyle(props, {
      zIndex: state.innerIndex,
      transitionDuration: `${props.duration}ms`
    });
  });
  const transitionName = computed(() => {
    return props.transition ? props.transition : `${animationName[props.position]}`;
  });
  const open = () => {
    if (state.innerVisible)
      return;
    state.innerIndex = props.zIndex !== void 0 ? props.zIndex : useGlobalZIndex();
    state.innerVisible = true;
    emit2(UPDATE_VISIBLE_EVENT, true);
    state.showSlot = true;
    emit2(OPEN_EVENT);
  };
  const close = () => {
    if (!state.innerVisible)
      return;
    state.innerVisible = false;
    emit2(UPDATE_VISIBLE_EVENT, false);
    emit2(CLOSE_EVENT);
  };
  const onClick = (e2) => {
    emit2("click-pop", e2);
  };
  const onClickCloseIcon = (e2) => {
    e2.stopPropagation();
    emit2("click-close-icon");
    close();
  };
  const onClickOverlay = () => {
    emit2("click-overlay");
    if (props.closeOnClickOverlay)
      close();
  };
  const onOpened = () => {
    emit2(OPENED_EVENT);
    emit2("opend");
  };
  const onClosed = () => {
    emit2(CLOSED_EVENT);
    state.showSlot = !props.destroyOnClose;
  };
  const applyVisible = (visible) => {
    if (visible && !state.innerVisible) {
      open();
    }
    if (!visible && state.innerVisible) {
      state.innerVisible = false;
      emit2(CLOSE_EVENT);
    }
  };
  watch(() => props.visible, (value) => {
    applyVisible(value);
  });
  onMounted(() => {
    applyVisible(props.visible);
  });
  return {
    ...toRefs(state),
    popStyle,
    transitionName,
    classes,
    onClick,
    onClickCloseIcon,
    onClickOverlay,
    onOpened,
    onClosed
  };
}
const iconProps = {
  ...commonProps,
  popClass: { type: String, default: "" },
  /**
   * @description 图标宽度
   */
  width: makeNumericProp(""),
  /**
   * @description 图标高度
   */
  height: makeNumericProp(""),
  /**
   * @description 图标名称
   */
  name: makeStringProp(""),
  /**
   * @description 图标大小
   */
  size: makeNumericProp(""),
  /**
   * @description 自定义 `icon` 类名前缀，用于使用自定义图标
   */
  classPrefix: { type: String, default: "nut-icon" },
  /**
   * @description  自定义 `icon` 字体基础类名
   */
  fontClassName: { type: String, default: "nutui-iconfont" },
  /**
   * @description 图标颜色
   */
  customColor: { type: String, default: "" }
};
const iconEmits = {
  [CLICK_EVENT]: (evt) => evt instanceof Object
};
const dialogProps = {
  ...popupProps,
  ...commonProps,
  /**
   * @description 点击蒙层是否关闭对话框
   */
  closeOnClickOverlay: truthProp,
  /**
   * @description 标题
   */
  title: makeStringProp(""),
  /**
   * @description 内容，支持 HTML
   */
  content: makeStringProp(""),
  /**
   * @description 是否隐藏底部按钮栏
   */
  noFooter: Boolean,
  /**
   * @description 是否隐藏确定按钮
   */
  noOkBtn: Boolean,
  /**
   * @description 是否隐藏取消按钮
   */
  noCancelBtn: Boolean,
  /**
   * @description 取消按钮文案
   */
  cancelText: makeStringProp(""),
  /**
   * @description 确定按钮文案
   */
  okText: makeStringProp(""),
  /**
   * @description 确认按钮是否默认关闭弹窗
   */
  okAutoClose: truthProp,
  /**
   * @description 取消按钮是否默认关闭弹窗
   */
  cancelAutoClose: truthProp,
  /**
   * @description 文字对齐方向，可选值同 css 的 text-align
   */
  textAlign: makeStringProp("center"),
  /**
   * @description 是否在页面回退时自动关闭
   */
  closeOnPopstate: Boolean,
  /**
   * @description 使用横纵方向,可选值`horizontal`、`vertical`
   */
  footerDirection: makeStringProp("horizontal"),
  /**
   * @description 自定义类名
   */
  customClass: makeStringProp(""),
  /**
   * @description 自定义 popup 弹框样式
   */
  popStyle: {
    type: Object
  },
  /**
   * @description 是否在页面回退时自动关闭
   */
  beforeClose: Function
};
const dialogEmits = {
  update: (val) => isBoolean(val),
  [UPDATE_VISIBLE_EVENT]: (val) => isBoolean(val),
  ok: () => true,
  [CANCEL_EVENT]: () => true,
  [OPENED_EVENT]: () => true,
  [CLOSED_EVENT]: () => true
};
const componentName$2 = `${PREFIX}-dialog`;
function useDialog(props, emit2) {
  const showPopup = ref(props.visible);
  const dialogStatus = ref({
    title: props.title,
    content: props.content,
    cancelText: props.cancelText,
    okText: props.okText,
    textAlign: props.textAlign,
    footerDirection: props.footerDirection,
    noFooter: props.noFooter,
    noOkBtn: props.noOkBtn,
    noCancelBtn: props.noCancelBtn,
    transition: props.transition,
    closeOnClickOverlay: props.closeOnClickOverlay,
    okAutoClose: props.okAutoClose
  });
  watch(() => props.title, (title) => dialogStatus.value.title = title);
  const showDialog = (options) => {
    dialogStatus.value = {
      title: options.title || props.title,
      content: options.content || props.content,
      cancelText: options.cancelText || props.cancelText,
      okText: options.okText || props.okText,
      okAutoClose: options.okAutoClose || props.okAutoClose,
      textAlign: options.textAlign || props.textAlign,
      footerDirection: options.footerDirection || props.footerDirection,
      noFooter: options.noFooter || props.noFooter,
      noOkBtn: options.noOkBtn || props.noOkBtn,
      transition: options.transition || props.transition,
      noCancelBtn: options.noCancelBtn || props.noCancelBtn,
      closeOnClickOverlay: options.closeOnClickOverlay || props.closeOnClickOverlay
    };
    showPopup.value = true;
  };
  onMounted(() => {
    if (props.closeOnPopstate)
      ;
  });
  watch(
    () => props.visible,
    (value) => {
      showPopup.value = value;
      if (value)
        emit2(OPENED_EVENT);
    }
  );
  const classes = computed(() => {
    return getMainClass(props, componentName$2);
  });
  function update3(val) {
    emit2("update", val);
    emit2(UPDATE_VISIBLE_EVENT, val);
  }
  function closed(action) {
    funInterceptor(props.beforeClose, {
      args: [action],
      done: () => {
        showPopup.value = false;
        update3(false);
        emit2(CLOSED_EVENT);
      }
    });
  }
  function onCancel() {
    emit2(CANCEL_EVENT);
    if (props.cancelAutoClose) {
      showPopup.value = false;
      closed(CANCEL_EVENT);
    }
  }
  function onOk() {
    emit2("ok");
    if (props.okAutoClose)
      closed("ok");
  }
  function onClickOverlay() {
    if (props.closeOnClickOverlay)
      closed("");
  }
  const contentStyle = computed(() => {
    return {
      textAlign: dialogStatus.value.textAlign
    };
  });
  return {
    contentStyle,
    showPopup,
    onClickOverlay,
    onCancel,
    onOk,
    closed,
    classes,
    showDialog,
    dialogStatus
  };
}
const navbarProps = {
  ...commonProps,
  /**
   * @description 图标与字体颜色
   */
  customColor: makeStringProp("#979797"),
  /**
   * @description 图标与字体大小
   */
  size: [Number, String],
  /**
   * @description 是否展示左侧箭头
   */
  leftShow: Boolean,
  // 左侧  是否显示返回icon
  /**
   * @description 中间文字标题
   */
  title: makeStringProp(""),
  /**
   * @description 中间标题icon
   */
  titleIcon: Boolean,
  /**
   * @description 左侧文字
   */
  leftText: makeStringProp(""),
  /**
   * @description 右侧按钮文字
   */
  desc: makeStringProp(""),
  /**
   * @description 是否固定到顶部
   */
  fixed: Boolean,
  /**
   * @description 是否开启顶部安全区适配
   */
  safeAreaInsetTop: Boolean,
  /**
   * @description 是否显示下边框
   */
  border: Boolean,
  /**
   * @description 固定在顶部时，是否在标签位置生成一个等高的占位元素
   */
  placeholder: truthProp,
  /**
   * @description 导航栏 `z-index`
   */
  zIndex: makeNumericProp(10)
};
const navbarEmits = {
  clickBack: () => true,
  clickTitle: () => true,
  clickIcon: () => true,
  clickRight: () => true,
  /**
   * @deprecated This function will be deprecated in future releases. Please migrate to `clickBack`
   */
  onClickBack: () => true,
  /**
   * @deprecated This function will be deprecated in future releases. Please migrate to `clickTitle`
   */
  onClickTitle: () => true,
  /**
   * @deprecated This function will be deprecated in future releases. Please migrate to `clickIcon`
   */
  onClickIcon: () => true,
  /**
   * @deprecated This function will be deprecated in future releases. Please migrate to `clickRight`
   */
  onClickRight: () => true
};
const FORM_KEY = Symbol("Form");
const formProps = {
  ...commonProps,
  /**
   * @description 表单数据对象(使用表单校验时，_必填_)
   */
  modelValue: makeObjectProp({}),
  /**
   * @description 统一配置每个 `FormItem` 的 `rules`
   */
  rules: makeObjectProp({}),
  /**
   * @description 禁用表单下的所有数据录入组件
   */
  disabled: Boolean,
  /**
   * @description 表单项 label 的位置
   */
  labelPosition: makeStringProp("left"),
  /**
   * @description 必填表单项 label 的红色星标位置
   */
  starPosition: makeStringProp("left")
};
const formEmits = {
  validate: (msg) => msg instanceof Object
};
function useFormDisabled(disabled) {
  const { parent } = useInject(FORM_KEY);
  return computed(() => {
    if (disabled.value != null)
      return disabled.value;
    if ((parent == null ? void 0 : parent.props.disabled) != null)
      return parent.props.disabled;
    return false;
  });
}
const searchbarProps = {
  ...commonProps,
  /**
   * @description 当前输入的值
   */
  modelValue: makeNumericProp(""),
  /**
   * @description 输入框类型
   */
  inputType: makeStringProp("text"),
  /**
   * @description 搜索框形状，可选值为 `square` `round`
   */
  shape: makeStringProp("round"),
  /**
   * @description 最大输入长度
   */
  maxLength: numericProp,
  /**
   * @description 输入框默认占位符
   */
  placeholder: String,
  /**
   * @description 是否展示清除按钮
   */
  clearable: truthProp,
  /**
   * @description 自定义清除按钮图标
   */
  clearIcon: makeStringProp("circle-close"),
  /**
   * @description 输入框外部背景
   */
  background: String,
  /**
   * @description 输入框内部背景
   */
  inputBackground: String,
  /**
   * @description 聚焦时搜索框样式
   */
  focusStyle: makeObjectProp({}),
  /**
   * @description 是否自动聚焦
   */
  autofocus: Boolean,
  /**
   * @description 是否禁用输入框
   */
  disabled: nullableBooleanProp,
  /**
   * @description 输入框只读
   */
  readonly: Boolean,
  /**
   * @description 对齐方式，可选 `left` `center` `right`
   */
  inputAlign: makeStringProp("left"),
  /**
   * @description 键盘右下角按钮的文字，仅在`type='text'`时生效，可选值 `send`：发送、`search`：搜索、`next`：下一个、`go`：前往、`done`：完成
   */
  confirmType: makeStringProp("done"),
  /**
   * @description 是否开启 iphone 系列全面屏底部安全区适配
   */
  safeAreaInsetBottom: Boolean,
  /**
   * @description 指定的距离的最小值作为光标与键盘的距离
   */
  cursorSpacing: makeNumberProp(0)
};
const searchbarEmits = {
  [UPDATE_MODEL_EVENT]: (val, event) => (isString(val) || val === void 0) && event instanceof Object,
  [CHANGE_EVENT]: (val, event) => (isString(val) || val === void 0) && event instanceof Object,
  [BLUR_EVENT]: (val, event) => (isString(val) || val === void 0) && event instanceof Object,
  [FOCUS_EVENT]: (val, event) => (isString(val) || val === void 0) && event instanceof Object,
  [CLEAR_EVENT]: (val) => isString(val) || val === void 0,
  [SEARCH_EVENT]: (val) => isString(val) || val === void 0,
  clickInput: (val, event) => (isString(val) || val === void 0) && event instanceof Object,
  clickLeftIcon: (val, event) => (isString(val) || val === void 0) && event instanceof Object,
  clickRightIcon: (val, event) => (isString(val) || val === void 0) && event instanceof Object
};
const textareaProps = {
  ...commonProps,
  /**
   * @description 输入值，支持双向绑定
   */
  modelValue: String,
  /**
   * @description 文本位置,可选值left,center,right
   */
  textAlign: String,
  /**
   * @description textarea是否展示输入字符。须配合max-length使用
   */
  limitShow: Boolean,
  /**
   * @description 限制最长输入字符
   */
  maxLength: [String, Number],
  /**
   * @description textarea的高度，优先级高于autosize属性 仅支持 H5
   */
  rows: [String, Number],
  /**
   * @description 文本域自定义类名
   */
  textareaClass: {
    type: [String, Object, Array],
    default: ""
  },
  /**
   * @description 文本域自定义样式
   */
  textareaStyle: {
    type: [String, Object, Array],
    default: ""
  },
  /**
   * @description 设置占位提示文字
   */
  placeholder: String,
  /**
   * @description 指定 placeholder 的样式
   */
  placeholderStyle: makeStringProp(""),
  /**
   * @description 指定 placeholder 的样式类
   */
  placeholderClass: makeStringProp("textarea-placeholder"),
  /**
   * @description 只读属性
   */
  readonly: Boolean,
  /**
   * @description 禁用属性
   */
  disabled: nullableBooleanProp,
  /**
   * @description 是否自适应内容高度，也可传入对象
   */
  autosize: {
    type: [Boolean, Object],
    default: false
  },
  /**
   * @description 自动获取焦点
   */
  autofocus: Boolean,
  /**
   * @description 指定光标与键盘的距离。取textarea距离底部的距离和cursor-spacing指定的距离的最小值作为光标与键盘的距离
   */
  cursorSpacing: makeNumberProp(0),
  /**
   * @description 指定focus时的光标位置
   */
  cursor: makeNumberProp(-1),
  /**
   * @description 是否显示键盘上方带有”完成“按钮那一栏
   */
  showConfirmBar: truthProp,
  /**
   * @description 光标起始位置，自动聚集时有效，需与selection-end搭配使用
   */
  selectionStart: makeNumberProp(-1),
  /**
   * @description 光标结束位置，自动聚集时有效，需与selection-start搭配使用
   */
  selectionEnd: makeNumberProp(-1),
  /**
   * @description 键盘弹起时，是否自动上推页面
   */
  adjustPosition: truthProp,
  /**
   * @description focus时，点击页面的时候不收起键盘
   */
  holdKeyboard: Boolean,
  /**
   * @description 是否去掉 iOS 下的默认内边距
   */
  disableDefaultPadding: Boolean,
  /**
   * @description 设置键盘右下角按钮的文字，可选值 `send` `search` `next` `go` `done` `return`
   */
  confirmType: makeStringProp("return"),
  /**
   * @description 点击键盘右下角按钮时是否保持键盘不收起
   */
  confirmHold: Boolean,
  /**
   * @description 键盘对齐位置，可选值 `cursor` `bottom`
   */
  adjustKeyboardTo: makeStringProp("cursor")
};
const textareaEmits = {
  [BLUR_EVENT]: (evt) => evt instanceof Object,
  [FOCUS_EVENT]: (evt) => evt instanceof Object,
  [CHANGE_EVENT]: (val1, val2) => isString(val1) && (isString(val2) || val2 instanceof Object),
  [UPDATE_MODEL_EVENT]: (val1, val2) => isString(val1) && (isString(val2) || val2 instanceof Object),
  [CONFIRM_EVENT]: (evt) => evt instanceof Object,
  [INPUT_EVENT]: (val, evt) => isString(val) && evt instanceof Object
};
const pickerProps = {
  ...commonProps,
  /**
   * @description 默认选中项
   */
  modelValue: makeArrayProp([]),
  /**
   * @description 对象数组，配置每一列显示的数据
   */
  columns: makeArrayProp([]),
  /**
   * @description 是否显示顶部导航
   */
  showToolbar: truthProp,
  /**
   * @description 设置标题
   */
  title: makeStringProp(""),
  /**
   * @description 确定按钮文案
   */
  okText: makeStringProp(""),
  /**
   * @description 取消按钮文案
   */
  cancelText: makeStringProp(""),
  /**
   * @description 是否开启3D效果
   */
  threeDimensional: Boolean,
  /**
   * @description 惯性滚动时长
   */
  swipeDuration: makeNumericProp(1e3),
  /**
   * @description 可见的选项个数
   */
  visibleOptionNum: makeNumericProp(7),
  /**
   * @description 选项高度
   */
  optionHeight: makeNumericProp(36),
  /**
   * @description 自定义 columns 中的字段
   */
  fieldNames: makeObjectProp({})
};
const pickerEmits = {
  [UPDATE_MODEL_EVENT]: (val) => val instanceof Object,
  [CHANGE_EVENT]: (evt) => evt instanceof Object,
  [CONFIRM_EVENT]: (evt) => evt instanceof Object,
  [CANCEL_EVENT]: (evt) => evt instanceof Object
};
const DEFAULT_FILED_NAMES = {
  text: "text",
  value: "value",
  children: "children",
  className: ""
};
const componentName$1 = `${PREFIX}-picker`;
function usePicker(props, emit2) {
  const classes = computed(() => {
    return getMainClass(props, componentName$1);
  });
  const state = reactive({
    formattedColumns: props.columns
  });
  const columnFieldNames = computed(() => {
    return {
      ...DEFAULT_FILED_NAMES,
      ...props.fieldNames
    };
  });
  const defaultValues = ref([]);
  const columnsType = computed(() => {
    const firstColumn = state.formattedColumns[0];
    const fields = columnFieldNames.value;
    if (firstColumn) {
      if (Array.isArray(firstColumn))
        return "multiple";
      if (fields.children in firstColumn)
        return "cascade";
    }
    return "single";
  });
  const formatCascade = (columns, defaultValues2) => {
    const formatted = [];
    const fields = columnFieldNames.value;
    let cursor = {
      text: "",
      value: "",
      [fields.children]: columns
    };
    let columnIndex = 0;
    while (cursor && cursor[fields.children]) {
      const options = cursor[fields.children];
      const value = defaultValues2[columnIndex];
      let index2 = options.findIndex((columnItem) => columnItem[fields.value] === value);
      if (index2 === -1)
        index2 = 0;
      cursor = cursor[fields.children][index2];
      columnIndex += 1;
      formatted.push(options);
    }
    return formatted;
  };
  const columnsList = computed(() => {
    switch (columnsType.value) {
      case "single":
        return [state.formattedColumns];
      case "multiple":
        return state.formattedColumns;
      case "cascade":
        return formatCascade(
          state.formattedColumns,
          defaultValues.value ? defaultValues.value : []
        );
    }
    return [];
  });
  const defaultIndexes = computed(() => {
    const fields = columnFieldNames.value;
    return columnsList.value.map((column, index2) => {
      const targetIndex = column.findIndex((item) => item[fields.value] === defaultValues.value[index2]);
      return targetIndex === -1 ? 0 : targetIndex;
    });
  });
  const delayDefaultIndexes = ref(columnsList.value.map(() => 0));
  watch(defaultIndexes, async (value) => {
    await nextTick$1();
    delayDefaultIndexes.value = value;
  }, { immediate: true });
  const columnRefs = ref([]);
  const columnRef = (el) => {
    if (el && columnRefs.value.length < columnsList.value.length)
      columnRefs.value.push(el);
  };
  const selectedOptions = computed(() => {
    const fields = columnFieldNames.value;
    return columnsList.value.map((column, index2) => {
      return column.find((item) => item[fields.value] === defaultValues.value[index2]) || column[0];
    });
  });
  const cancel = () => {
    emit2(CANCEL_EVENT, {
      selectedValue: defaultValues.value,
      selectedOptions: selectedOptions.value
    });
  };
  const changeHandler = (columnIndex, option) => {
    const fields = columnFieldNames.value;
    if (option && Object.keys(option).length) {
      defaultValues.value = defaultValues.value ? defaultValues.value : [];
      if (columnsType.value === "cascade") {
        defaultValues.value[columnIndex] = option[fields.value] ? option[fields.value] : "";
        let index2 = columnIndex;
        let cursor = option;
        while (cursor && cursor[fields.children] && cursor[fields.children][0]) {
          defaultValues.value[index2 + 1] = cursor[fields.children][0][fields.value];
          index2 += 1;
          cursor = cursor[fields.children][0];
        }
        if (cursor && cursor[fields.children] && cursor[fields.children].length === 0)
          defaultValues.value = defaultValues.value.slice(0, index2 + 1);
      } else {
        defaultValues.value[columnIndex] = Object.prototype.hasOwnProperty.call(option, fields.value) ? option[fields.value] : "";
      }
      emit2(CHANGE_EVENT, {
        columnIndex,
        selectedValue: defaultValues.value,
        selectedOptions: selectedOptions.value
      });
    }
  };
  const confirm = () => {
    const fields = columnFieldNames.value;
    if (defaultValues.value && !defaultValues.value.length) {
      columnsList.value.forEach((columns) => {
        defaultValues.value.push(columns[0][fields.value]);
      });
    }
    emit2(CONFIRM_EVENT, {
      selectedValue: defaultValues.value,
      selectedOptions: selectedOptions.value
    });
  };
  const confirmHandler = () => {
    if (columnRefs.value.length > 0) {
      columnRefs.value.forEach((column) => {
        column.stopMomentum();
      });
    }
    confirm();
  };
  watch(
    () => props.modelValue,
    (value) => {
      if (!isEqualValue(value, defaultValues.value))
        defaultValues.value = cloneDeep(value);
    },
    { deep: true, immediate: true }
  );
  watch(
    defaultValues,
    (value) => {
      if (!isEqualValue(value, props.modelValue))
        emit2(UPDATE_MODEL_EVENT, value);
    },
    { deep: true }
  );
  watch(
    () => props.columns,
    (value) => {
      state.formattedColumns = value;
    }
  );
  return {
    classes,
    ...toRefs(state),
    columnsType,
    columnsList,
    columnFieldNames,
    cancel,
    changeHandler,
    confirmHandler,
    confirm,
    defaultValues,
    defaultIndexes,
    delayDefaultIndexes,
    columnRefs,
    columnRef,
    selectedOptions
  };
}
const datepickerProps = {
  /**
   * @description 初始值
   */
  modelValue: {
    type: [Number, String, Object]
  },
  /**
   * @description 时间类型，可选值 `date`(年月日) `time`(时分秒) `year-month`(年月) `month-day`(月日) `datehour`(年月日时) `hour-minute`
   */
  type: makeStringProp("date"),
  /**
   * @description 是否显示顶部导航
   */
  showToolbar: truthProp,
  /**
   * @description 设置标题
   */
  title: makeStringProp(""),
  /**
   * @description 确定按钮文案
   */
  okText: makeStringProp(""),
  /**
   * @description 取消按钮文案
   */
  cancelText: makeStringProp(""),
  /**
   * @description 每列是否展示中文
   */
  isShowChinese: Boolean,
  /**
   * @description 分钟步进值
   */
  minuteStep: makeNumberProp(1),
  /**
   * @description 开始日期
   */
  minDate: {
    type: [Number, String, Object],
    default: () => new Date((/* @__PURE__ */ new Date()).getFullYear() - 10, 0, 1)
  },
  /**
   * @description 结束日期
   */
  maxDate: {
    type: [Number, String, Object],
    default: () => new Date((/* @__PURE__ */ new Date()).getFullYear() + 10, 11, 31)
  },
  /**
   * @description 选项格式化函数
   */
  formatter: Function,
  /**
   * @description 选项过滤函数
   */
  filter: Function,
  /**
   * @description 是否开启3D效果
   */
  threeDimensional: Boolean,
  /**
   * @description 惯性滚动时长
   */
  swipeDuration: makeNumericProp(1e3),
  /**
   * @description 可见的选项个数
   */
  visibleOptionNum: makeNumericProp(7),
  /**
   * @description 选项高度
   */
  optionHeight: makeNumericProp(36)
};
const datepickerEmits = {
  [UPDATE_MODEL_EVENT]: (val) => val instanceof Object,
  [CHANGE_EVENT]: (evt) => evt instanceof Object,
  [CONFIRM_EVENT]: (evt) => evt instanceof Object,
  [CANCEL_EVENT]: (evt) => evt instanceof Object
};
const inputProps = {
  ...commonProps,
  /**
   * @description 输入框类型，支持原生 `input` 标签的所有 `type` 属性，另外还支持 `number` `digit`
   */
  type: makeStringProp("text"),
  /**
   * @description 输入值，双向绑定
   */
  modelValue: makeNumericProp(""),
  /**
   * @description 输入框自定义类名
   */
  inputClass: {
    type: [String, Object, Array],
    default: ""
  },
  /**
   * @description 输入框自定义样式
   */
  inputStyle: {
    type: [String, Object, Array],
    default: ""
  },
  /**
   * @description 输入框为空时占位符
   */
  placeholder: makeStringProp(""),
  /**
   * @description 指定 placeholder 的样式
   */
  placeholderStyle: makeStringProp(""),
  /**
   * @description 指定 placeholder 的样式类
   */
  placeholderClass: makeStringProp("input-placeholder"),
  /**
   * @description 输入框内容对齐方式，可选值 `left`、`center`、`right`
   */
  inputAlign: makeStringProp("left"),
  /**
   * @description 是否显示必填字段的标签旁边的红色星号
   */
  required: Boolean,
  /**
   * @description 是否禁用
   */
  disabled: nullableBooleanProp,
  /**
   * @description 是否只读
   */
  readonly: Boolean,
  /**
   * @description 是否标红
   */
  error: Boolean,
  /**
   * @description 限制最长输入字符
   */
  maxLength: makeNumericProp(140),
  /**
   * @description 展示清除 `Icon`
   */
  clearable: Boolean,
  /**
   * @description 清除图标的 `font-size` 大小
   */
  clearSize: makeNumericProp("14"),
  /**
   * @description 是否显示下边框
   */
  border: truthProp,
  /**
   * @description 格式化函数触发的时机，可选值为 `onChange`、`onBlur`
   */
  formatTrigger: makeStringProp("onChange"),
  /**
   * @description 输入内容格式化函数
   */
  formatter: {
    type: Function,
    default: null
  },
  /**
   * @description 是否显示限制最长输入字符，需要设置 `max-length` 属性
   */
  showWordLimit: Boolean,
  /**
   * @description 是否自动获得焦点，`iOS` 系统不支持该属性
   */
  autofocus: Boolean,
  /**
   * @description 键盘右下角按钮的文字，仅在`type='text'`时生效,可选值 `send`：发送、`search`：搜索、`next`：下一个、`go`：前往、`done`：完成
   */
  confirmType: makeStringProp("done"),
  /**
   * @description  键盘弹起时，是否自动上推页面
   */
  adjustPosition: truthProp,
  /**
   * @description 是否强制使用系统键盘和 `Web-view` 创建的 `input` 元素。为 `true` 时，`confirm-type`、`confirm-hold` 可能失效
   */
  alwaysSystem: Boolean,
  /**
   * @description 是否在失去焦点后，继续展示清除按钮，在设置 `clearable` 时生效
   */
  showClearIcon: Boolean,
  /**
   * @description 输入框模式
   */
  inputMode: makeStringProp("text"),
  /**
   * @description 指定光标与键盘的距离，取 input 距离底部的距离和 cursor-spacing 指定的距离的最小值作为光标与键盘的距离
   */
  cursorSpacing: makeNumberProp(0),
  /**
   * @description 强制 input 处于同层状态，默认 focus 时 input 会切到非同层状态 (仅在 iOS 下生效)
   */
  alwaysEmbed: Boolean,
  /**
   * @description 点击键盘右下角按钮时是否保持键盘不收起
   */
  confirmHold: Boolean,
  /**
   * @description 指定focus时的光标位置
   */
  cursor: Number,
  /**
   * @description 光标起始位置，自动聚集时有效，需与selection-end搭配使用
   */
  selectionStart: makeNumberProp(-1),
  /**
   * @description 光标结束位置，自动聚集时有效，需与selection-start搭配使用
   */
  selectionEnd: makeNumberProp(-1),
  /**
   * @description focus时，点击页面的时候不收起键盘
   */
  holdKeyboard: Boolean
};
const inputEmits = {
  [CLICK_EVENT]: (evt) => evt instanceof Object,
  clickInput: (evt) => evt instanceof Object,
  [BLUR_EVENT]: (evt) => evt instanceof Object,
  [FOCUS_EVENT]: (evt) => evt instanceof Object,
  [CLEAR_EVENT]: () => true,
  [CONFIRM_EVENT]: (evt) => evt instanceof Object,
  [UPDATE_MODEL_EVENT]: (val1, val2) => (isString(val1) || isNumber(val1)) && (val2 instanceof Object || val2 === void 0),
  [INPUT_EVENT]: (val, evt) => (isString(val) || isNumber(val)) && evt instanceof Object
};
function trimExtraChar(value, char, regExp) {
  const index2 = value.indexOf(char);
  if (index2 === -1)
    return value;
  if (char === "-" && index2 !== 0)
    return value.slice(0, index2);
  return value.slice(0, index2 + 1) + value.slice(index2).replace(regExp, "");
}
function formatNumber(value, allowDot = true, allowMinus = true) {
  if (allowDot)
    value = trimExtraChar(value, ".", /\./g);
  else
    value = value.split(".")[0];
  if (allowMinus)
    value = trimExtraChar(value, "-", /-/g);
  else
    value = value.replace(/-/, "");
  const regExp = allowDot ? /[^-0-9.]/g : /[^-0-9]/g;
  return value.replace(regExp, "");
}
const rangeProps = {
  ...commonProps,
  /**
   * @description 当前进度百分比
   */
  modelValue: {
    type: [Number, Array],
    default: 0
  },
  /**
   * @description 是否开启双滑块模式
   */
  range: Boolean,
  /**
   * @description 最大值
   */
  max: makeNumericProp(100),
  /**
   * @description 最小值
   */
  min: makeNumericProp(0),
  /**
   * @description 步长
   */
  step: makeNumericProp(1),
  /**
   * @description 是否禁用滑块
   */
  disabled: nullableBooleanProp,
  /**
   * @description 是否竖向展示
   */
  vertical: Boolean,
  /**
   * @description 是否隐藏范围值
   */
  hiddenRange: Boolean,
  /**
   * @description 是否隐藏标签
   */
  hiddenTag: Boolean,
  /**
   * @description 进度条激活态颜色
   */
  activeColor: String,
  /**
   * @description 进度条非激活态颜色
   */
  inactiveColor: String,
  /**
   * @description 按钮颜色
   */
  buttonColor: String,
  /**
   * @description 刻度标示
   */
  marks: makeObjectProp({})
};
const rangeEmits = {
  [UPDATE_MODEL_EVENT]: (val) => isNumber(val) || val instanceof Object,
  dragStart: () => true,
  [CHANGE_EVENT]: (val) => isNumber(val) || val instanceof Object,
  dragEnd: () => true
};
const uploaderProps = {
  ...commonProps,
  /**
   * @description 发到后台的文件参数名
   * - 类型为 `string`
   * - 默认值为 `'file'`
   */
  name: makeStringProp("file"),
  /**
   * @description 上传服务器的接口地址
   */
  url: String,
  /**
   * @description 选择文件的来源
   * - 类型为 `Array<SourceType>`
   * - 默认值为 `['album', 'camera']`
   */
  sourceType: makeArrayProp(["album", "camera"]),
  /**
   * @description 选择文件类型
   * - 类型为 `Array<MediaType>`
   * - 默认值为 `['image', 'video', 'mix']`
   */
  mediaType: makeArrayProp(["image", "video", "mix"]),
  /**
   * @description 超时时间，单位为毫秒
   * - 类型为 `number | string`
   * - 默认值为 `1000 * 30`
   */
  timeout: makeNumericProp(1e3 * 30),
  /**
   * @description 默认已经上传的文件列表
   */
  fileList: makeArrayProp([]),
  /**
   * @description 是否上传成功后展示预览图
   * - 类型为 `boolean`
   * - 默认值为 `true`
   */
  isPreview: truthProp,
  /**
   * @description 上传列表的内建样式，支持两种基础样式 `picture`、`list`
   * - 类型为 `string`
   * - 默认值为 `'picture'`
   */
  listType: makeStringProp("picture"),
  /**
   * @description 是否展示删除按钮
   */
  isDeletable: truthProp,
  /**
   * @description 上传请求的 http method
   * - 类型为 `string`
   * - 默认值为 `'post'`
   */
  method: makeStringProp("post"),
  capture: Boolean,
  /**
   * @description 可以设定最大上传文件的大小（字节）
   */
  maximize: makeNumericProp(Number.MAX_VALUE),
  /**
   * @description 最多可以选择的文件个数，微信基础库2.25.0前，最多可支持9个文件，2.25.0及以后最多可支持20个文件
   */
  maximum: makeNumericProp(9),
  accept: makeStringProp("image"),
  /**
   * @description 设置上传的请求头部
   */
  headers: { type: Object, default: {} },
  /**
   * @description 附加上传的信息 formData
   */
  data: { type: Object, default: {} },
  /**
   * @description 接口响应的成功状态（status）值
   */
  xhrState: makeNumericProp(200),
  /**
   * @description 是否支持文件多选
   */
  multiple: truthProp,
  /**
   * @description 是否禁用文件上传
   */
  disabled: nullableBooleanProp,
  /**
   * @description 是否在选取文件后立即进行上传，false 时需要手动执行ref的`submit`方法进行上传
   */
  autoUpload: truthProp,
  /**
   * @description 执行 `uni.uploadFile` 上传时，自定义方法
   */
  beforeUpload: {
    type: Function,
    default: null
  },
  /**
   * @description 除文件时的回调，返回值为 false 时不移除。支持返回一个 Promise 对象，Promise 对象 resolve(false) 或 reject 时不移除
   */
  beforeDelete: {
    type: Function,
    default: null
  },
  /**
   * @description 当accept为video时生效，是否压缩视频，默认为true（默认 true ）
   * - compressed: { type: Boolean, default: true },
   * - 当accept为video时生效，拍摄视频最长拍摄时间，单位秒（默认 60 ）
   */
  maxDuration: makeNumericProp(60),
  /**
   * @description 所选的图片的尺寸, 可选值为original compressed
   */
  sizeType: makeArrayProp(["compressed", "original"]),
  /**
   * 当accept为video时生效，可选值为back或front
   */
  camera: makeStringProp("back"),
  /**
   * @description 预览图片的 mode 属性
   */
  mode: makeStringProp("aspectFit")
};
const uploaderEmits = {
  "start": (option) => option instanceof Object,
  "progress": (val) => val instanceof Object,
  "update:fileList": (val) => val instanceof Object,
  "oversize": (val) => val instanceof Object,
  "success": (val) => val instanceof Object,
  "failure": (err) => err instanceof Object,
  "change": (val) => val instanceof Object,
  "delete": (val) => val instanceof Object,
  "fileItemClick": (val) => val instanceof Object
};
function omitProps(obj, keys) {
  if (!["[object Object]", "[object File]"].includes(Object.prototype.toString.call(obj)))
    return {};
  return omit(obj, keys);
}
function formatMedia(res) {
  return res.tempFiles.map((item) => ({
    ...omitProps(item, ["fileType", "thumbTempFilePath", "tempFilePath"]),
    type: res.type,
    url: item.tempFilePath,
    thumb: res.type === "video" ? item.thumbTempFilePath : item.tempFilePath,
    size: item.size,
    name: (res == null ? void 0 : res.name) || "media"
  }));
}
function chooseFile({
  accept,
  multiple,
  maxDuration,
  sizeType,
  camera
}, props, fileList) {
  return new Promise((resolve2, reject) => {
    index.chooseMedia({
      /** 最多可以选择的文件个数 */
      count: multiple ? Number(props.maximum) * 1 - fileList.length : 1,
      /** 文件类型 */
      mediaType: props.mediaType,
      /** 图片和视频选择的来源 */
      sourceType: props.sourceType,
      /** 拍摄视频最长拍摄时间，单位秒。时间范围为 3s 至 30s 之间 */
      maxDuration,
      /** 仅对 mediaType 为 image 时有效，是否压缩所选文件 */
      sizeType,
      /** 仅在 sourceType 为 camera 时生效，使用前置或后置摄像头 */
      camera,
      /** 接口调用失败的回调函数 */
      fail: reject,
      /** 接口调用成功的回调函数 */
      success: (res) => resolve2(formatMedia(res))
    });
  });
}
function createUploader(options) {
  const upload = () => {
    var _a;
    const uploadTask = index.uploadFile({
      url: options.url,
      fileType: options.fileType,
      file: options.file,
      filePath: options.filePath,
      name: options.name,
      header: options.header,
      timeout: options.timeout,
      formData: options.formData,
      success: (result) => {
        var _a2, _b;
        if (options.xhrState === result.statusCode)
          (_a2 = options.onSuccess) == null ? void 0 : _a2.call(options, result, options);
        else
          (_b = options.onFailure) == null ? void 0 : _b.call(options, result, options);
      },
      fail: (result) => {
        var _a2;
        (_a2 = options.onFailure) == null ? void 0 : _a2.call(options, result, options);
      }
    });
    (_a = options.onStart) == null ? void 0 : _a.call(options, options);
    uploadTask.onProgressUpdate((event) => {
      var _a2;
      (_a2 = options.onProgress) == null ? void 0 : _a2.call(options, event, options);
    });
  };
  return { upload };
}
const addressProps = {
  ...popupProps,
  ...commonProps,
  /**
   * @description 设置默认选中值
   */
  modelValue: makeArrayProp([]),
  /**
   * @description 是否打开地址选择
   */
  visible: Boolean,
  /**
   * @description 地址选择类型：'exist' | 'custom' | 'custom2'
   */
  type: makeStringProp("custom"),
  /**
   * @description 自定义地址选择标题
   */
  customAddressTitle: makeStringProp(""),
  /**
   * @description 省份数据
   */
  province: makeArrayProp([]),
  /**
   * @description 城市数据
   */
  city: makeArrayProp([]),
  /**
   * @description 县区数据
   */
  country: makeArrayProp([]),
  /**
   * @description 乡镇数据
   */
  town: makeArrayProp([]),
  /**
   * @description 是否显示 '选择其他地区' 按钮。仅在类型为 'exist' 时生效
   */
  isShowCustomAddress: truthProp,
  /**
   * @description 现存地址列表
   */
  existAddress: makeArrayProp([]),
  /**
   * @description 已有地址标题
   */
  existAddressTitle: makeStringProp(""),
  /**
   * @description 切换自定义地址和已有地址的按钮标题
   */
  customAndExistTitle: makeStringProp(""),
  /**
   * @description 弹层中内容容器的高度
   */
  height: makeNumericProp("200"),
  /**
   * @description 列提示文字
   */
  columnsPlaceholder: {
    type: [String, Array],
    default: ""
  }
};
const addressEmits = {
  [UPDATE_VISIBLE_EVENT]: (val) => isBoolean(val),
  [UPDATE_MODEL_EVENT]: () => true,
  [CLOSE_EVENT]: (val) => val instanceof Object,
  [CHANGE_EVENT]: (val) => val instanceof Object,
  switchModule: (val) => val instanceof Object,
  closeMask: (val) => val instanceof Object,
  [SELECTED_EVENT]: (prevExistAdd, item, copyExistAdd) => prevExistAdd instanceof Object && item instanceof Object && copyExistAdd instanceof Object
};
const cellgroupProps = {
  ...commonProps,
  /**
   * @description 标题名称
   */
  title: String,
  /**
   * @description 右侧描述
   */
  desc: String
};
const colProps = {
  ...commonProps,
  /**
   * @description 列元素宽度（共分为 24 份，例如设置一行3个，那么 `span` 值为 8）
   */
  span: makeNumericProp(24),
  /**
   * @description 列元素偏移距离
   */
  offset: makeNumericProp(0)
};
const rowProps = {
  ...commonProps,
  /**
   * @description 布局方式，可选值为 `flex`
   */
  type: makeStringProp(""),
  /**
   * @description 列元素之间的间距（单位为 `px`）
   */
  gutter: makeNumericProp(""),
  /**
   * @description `Flex` 主轴对齐方式，可选值为 `start` `end` `center` `space-around` `space-between` `space-evenly`
   */
  justify: makeStringProp("start"),
  /**
   * @description `Flex` 交叉轴对齐方式，可选值为 `flex-start` `center` `flex-end`
   */
  align: makeStringProp("flex-start"),
  /**
   * @description `Flex` 是否换行，可选值为 `nowrap` `wrap` `reverse`
   */
  flexWrap: makeStringProp("nowrap")
};
const collapseitemProps = {
  ...commonProps,
  /**
   * @description 折叠面板的引用对象
   */
  collapseRef: Object,
  /**
   * @description 标题栏左侧内容，支持插槽传入（`props` 传入的优先级更高）
   */
  title: makeStringProp(""),
  /**
   * @description 唯一标识符，必填
   */
  name: {
    ...makeRequiredProp([String, Number]),
    default: -1
  },
  /**
   * @description 标题栏右侧内容，支持插槽传入（`props` 传入的优先级更高）
   */
  value: makeStringProp(""),
  /**
   * @description 标题栏描述信息
   */
  label: makeStringProp(""),
  /**
   * @description 标题栏是否禁用
   */
  disabled: Boolean,
  /**
   * @description 是否显示边框
   * @type boolean
   * @default true
   */
  border: truthProp,
  /**
   * @description 标题栏左侧图标组件，等同于 `nutui-icon` 组件
   */
  icon: makeStringProp("down-arrow"),
  /**
   * @description 点击折叠和展开的旋转角度，在自定义图标模式下生效
   */
  rotate: makeNumericProp(180)
};
const collapseProps = {
  ...commonProps,
  /**
   * @description 当前展开面板的 `name`
   */
  modelValue: { type: [String, Number, Array] },
  /**
   * @description 是否开启手风琴模式
   */
  accordion: Boolean
};
const collapseEmits = {
  [CHANGE_EVENT]: (val, name, status) => isString(val) || isNumber(val) || val instanceof Object && isNumber(name) || isString(name) && isBoolean(status),
  [UPDATE_MODEL_EVENT]: (val) => isString(val) || isNumber(val) || val instanceof Object
};
const actionsheetProps = {
  ...popupProps,
  ...commonProps,
  /**
   * @description 是否显示圆角
   */
  round: truthProp,
  /**
   * @description 是否开启 iPhone 系列全面屏底部安全区适配，仅当 `position` 为 `bottom` 时有效
   */
  safeAreaInsetBottom: truthProp,
  /**
   * @description 遮罩显示时的背景是否锁定
   */
  lockScroll: truthProp,
  /**
   * @description 自定义 popup 弹框样式
   */
  popStyle: {
    type: Object
  },
  /**
   * @description 取消文案
   */
  cancelTxt: makeStringProp(""),
  /**
   * @description 设置列表项标题展示使用参数
   */
  optionTag: makeStringProp("name"),
  /**
   * @description 设置列表项二级标题展示使用参数
   */
  optionSubTag: makeStringProp("subname"),
  /**
   * @description 设置选中项的值，和 'option-tag' 的值对应
   */
  chooseTagValue: makeStringProp(""),
  /**
   * @description 设置列表项标题
   */
  title: makeStringProp(""),
  /**
   * @description 选中项颜色，当 choose-tag-value == option-tag 的值 生效
   */
  customColor: makeStringProp("#ee0a24"),
  /**
   * @description 设置列表项副标题/描述
   */
  description: makeStringProp(""),
  /**
   * @description 列表项
   */
  menuItems: makeArrayProp([]),
  /**
   * @description 遮罩层是否可关闭
   */
  closeAbled: truthProp
};
const actionsheetEmits = {
  [CLOSE_EVENT]: () => true,
  [UPDATE_VISIBLE_EVENT]: (val) => isBoolean(val),
  [CANCEL_EVENT]: () => true,
  [CHOOSE_EVENT]: (item, index2) => item instanceof Object && isNumber(index2)
};
const formitemProps = {
  ...commonProps,
  /**
   * @description 是否显示必填字段的标签旁边的红色星号
   */
  required: nullableBooleanProp,
  /**
   * @description 表单域 `v-model` 字段，在使用表单校验功能的情况下，该属性是必填的
   */
  prop: makeStringProp(""),
  /**
   * @description
   */
  label: makeStringProp(""),
  /**
   * @description 定义校验规则
   */
  rules: makeArrayProp([]),
  /**
   * @description 表单项 `label` 宽度，默认单位为 `px`
   */
  labelWidth: makeNumericProp(""),
  /**
   * @description 表单项 `label` 对齐方式，可选值为 `center`、`right`
   */
  labelAlign: makeStringProp("left"),
  /**
   * @description 右侧插槽对齐方式，可选值为 `center`、`right`
   */
  bodyAlign: makeStringProp("left"),
  /**
   * @description 错误提示文案对齐方式，可选值为 `center`、`right`
   */
  errorMessageAlign: makeStringProp("left"),
  /**
   * @description 是否在校验不通过时标红输入框
   */
  showErrorLine: truthProp,
  /**
   * @description 是否在校验不通过时在输入框下方展示错误提示
   * @type {boolean}
   * @default true
   */
  showErrorMessage: truthProp,
  /**
   * @description 表单项 label 的位置，优先级高于 form 中的 `label-position`
   */
  labelPosition: makeStringProp(void 0),
  /**
   * @description 必填表单项 label 的红色星标位置，优先级高于 form 中的 `star-position`
   */
  starPosition: makeStringProp(void 0)
};
const radioProps = {
  ...commonProps,
  /**
   * @description 是否禁用选择
   */
  disabled: nullableBooleanProp,
  /**
   * @description 图标尺寸
   */
  iconSize: makeNumericProp(""),
  /**
   * @description 单选框标识
   */
  label: {
    type: [String, Number, Boolean],
    default: ""
  },
  /**
   * @description 形状，可选值为 button、round
   */
  shape: makeStringProp("round"),
  /**
   * @description 尺寸，可选值为 `large` `small` `mini` `normal`，仅在 shape 为 `button` 时生效
   */
  size: makeStringProp("normal")
};
const RADIO_KEY = Symbol("nut-radio");
const radiogroupProps = {
  ...commonProps,
  /**
   * @description 当前选中项的标识符，与 `label` 值一致时呈选中状态
   */
  modelValue: {
    type: [Number, String, Boolean],
    default: ""
  },
  /**
   * @description 使用横纵方向，可选值 `horizontal`、`vertical`
   */
  direction: makeStringProp("vertical"),
  /**
   * @description 文本所在的位置，可选值：`left`,`right`
   */
  textPosition: makeStringProp("right")
};
const radiogroupEmits = {
  [CHANGE_EVENT]: (val) => isString(val) || isNumber(val) || isBoolean(val),
  [UPDATE_MODEL_EVENT]: (val) => isString(val) || isNumber(val) || isBoolean(val)
};
const addresslistProps = {
  ...commonProps,
  /**
   * @description 地址数组
   */
  data: makeArrayProp([]),
  /**
   * @description 长按功能
   */
  longPress: Boolean,
  /**
   * @description 右滑功能
   */
  swipeEdition: Boolean,
  /**
   * @description 是否展示底部按钮
   */
  showBottomButton: truthProp,
  /**
   * @description 自定义 `key` 值时，设置映射关系
   */
  options: makeObjectProp({})
};
const addresslistEmits = {
  delIcon: (val, item, index2) => val instanceof Object && item instanceof Object && (isNumber(index2) || isString(index2)),
  editIcon: (val, item, index2) => val instanceof Object && item instanceof Object && (isNumber(index2) || isString(index2)),
  clickItem: (val, item, index2) => val instanceof Object && item instanceof Object && (isNumber(index2) || isString(index2)),
  longCopy: (val, item, index2) => val instanceof Object && item instanceof Object && (isNumber(index2) || isString(index2)),
  longSet: (val, item, index2) => val instanceof Object && item instanceof Object && (isNumber(index2) || isString(index2)),
  longDel: (val, item, index2) => val instanceof Object && item instanceof Object && (isNumber(index2) || isString(index2)),
  swipeDel: (val, item, index2) => val instanceof Object && item instanceof Object && (isNumber(index2) || isString(index2)),
  add: (val) => val instanceof Object
};
const checkboxProps = {
  ...commonProps,
  /**
   * @description 是否处于选中状态
   */
  modelValue: {
    type: [Boolean, Number, String],
    default: false
  },
  /**
   * @description 是否禁用选择
   */
  disabled: nullableBooleanProp,
  /**
   * @description 文本所在的位置，可选值：`left`,`right`
   */
  textPosition: makeStringProp("right"),
  /**
   * @description 图标大小，如 20px 2em 2rem
   */
  iconSize: makeNumericProp(""),
  /**
   * @description 复选框标识
   */
  label: [Boolean, Number, String],
  /**
   * @description 当前是否支持半选状态，一般用在全选操作中
   */
  indeterminate: Boolean,
  /**
   * @description 形状，可选值：`button`、`round`
   */
  shape: makeStringProp("round"),
  /**
   * @description 选中状态的值
   */
  checkedValue: {
    type: [Boolean, Number, String],
    default: true
  },
  /**
   * @description 未选中状态的值
   */
  uncheckedValue: {
    type: [Boolean, Number, String],
    default: false
  }
};
const checkboxEmits = {
  [UPDATE_MODEL_EVENT]: (value) => true,
  [CHANGE_EVENT]: (checked, value) => true
};
const CHECKBOX_KEY = Symbol("nut-checkbox");
const MENU_KEY = Symbol("nut-menu");
const menuProps = {
  ...commonProps,
  /**
   * @description 选项的选中态图标颜色
   */
  activeColor: makeStringProp(""),
  /**
   * @description 是否显示遮罩
   */
  overlay: truthProp,
  /**
   * @description 是否锁定滚动
   */
  lockScroll: truthProp,
  /**
   * @description 动画时长
   */
  duration: {
    type: [Number, String],
    default: 300
  },
  /**
   * @description 标题图标
   */
  titleIcon: String,
  /**
   * @description 是否在点击遮罩层后关闭菜单
   */
  closeOnClickOverlay: truthProp,
  /**
   * @description 展开方向
   */
  direction: makeStringProp("down"),
  /**
   * @description 滚动后是否固定，可设置固定位置（需要配合 `scrollTop` 使用）
   */
  scrollFixed: {
    type: [Boolean, String, Number],
    default: false
  },
  /**
   * @description 页面的滚动距离，通过 `onPageScroll` 获取
   */
  scrollTop: makeNumberProp(0),
  /**
   * @description 标题样式类名
   */
  titleClass: [String],
  /**
   * @description 收起的图标
   */
  upIcon: makeStringProp("rect-up"),
  /**
   * @description 展开时的图标
   */
  downIcon: makeStringProp("rect-down")
};
const menuitemProps = {
  ...commonProps,
  /**
   * @@description 菜单项标题
   */
  title: String,
  /**
   * @description 选项数组
   */
  options: makeArrayProp([]),
  /**
   * @description 是否禁用菜单
   */
  disabled: Boolean,
  modelValue: [String, Number],
  /**
   * @description 可以设置一行展示多少列 `options`
   */
  cols: makeNumberProp(1),
  /**
   * @description 选项选中时自定义标题样式类
   */
  activeTitleClass: String,
  /**
   * @description 选项非选中时自定义标题样式类
   */
  inactiveTitleClass: String,
  /**
   * @description 选项选中时选中图标
   */
  optionIcon: makeStringProp("Check")
};
const menuitemEmits = {
  [UPDATE_MODEL_EVENT]: (value) => true,
  [CHANGE_EVENT]: (value) => true,
  [OPEN_EVENT]: () => true,
  [CLOSE_EVENT]: () => true,
  itemClick: (item) => true
};
const calendarProps = {
  ...popupProps,
  ...commonProps,
  /**
   * @description 是否可见
   */
  visible: Boolean,
  /**
   * @description 类型，日期单选 `one`，区间选择 `range`，日期多选 `multiple`，周选择 `week`
   */
  type: makeStringProp("one"),
  /**
   * @description 是否弹窗状态展示
   */
  poppable: truthProp,
  /**
   * @description 自动回填
   */
  isAutoBackFill: Boolean,
  /**
   * @description 显示标题
   */
  title: makeStringProp("日期选择"),
  /**
   * @description 默认值，单个日期选择为 `string`，其他为 `string[]`
   */
  defaultValue: {
    type: [String, Array]
  },
  /**
   * @description 开始日期
   */
  startDate: makeStringProp(getDay(0)),
  /**
   * @description 结束日期
   */
  endDate: makeStringProp(getDay(365)),
  /**
   * @description 范围选择，开始信息文案
   */
  startText: makeStringProp("开始"),
  /**
   * @description 范围选择，结束信息文案
   */
  endText: makeStringProp("结束"),
  /**
   * @description 底部确认按钮文案
   */
  confirmText: makeStringProp("确认"),
  /**
   * @description 是否展示今天标记
   */
  showToday: truthProp,
  /**
   * @description 是否在展示日历标题
   */
  showTitle: truthProp,
  /**
   * @description 是否展示日期标题
   */
  showSubTitle: truthProp,
  /**
   * @description 是否启动滚动动画
   */
  toDateAnimation: truthProp,
  /**
   * @description 设置周起始日
   */
  firstDayOfWeek: makeNumberProp(0),
  /**
   * @description 一个用来判断该日期是否被禁用的函数，接受一个 `年 - 月 - 日` 作为参数。 应该返回一个 Boolean 值。
   * @default undefined
   */
  disabledDate: Function,
  /**
   * @description 是否使用 footer 插槽，如果使用,此值必须为 true
   */
  footerSlot: Boolean,
  /**
   * @description 是否使用 btn 插槽，如果使用,此值必须为 true
   */
  btnSlot: Boolean,
  /**
   * @description 自定义弹窗样式
   */
  popStyle: {
    type: [String, Object, Array],
    default: ""
  },
  /**
   * @description 遮罩显示时的背景是否锁定
   */
  lockScroll: truthProp
};
const calendarEmits = {
  [UPDATE_VISIBLE_EVENT]: (value) => true,
  [CHOOSE_EVENT]: (value) => true,
  [SELECT_EVENT]: (value) => true,
  clickCloseIcon: () => true,
  clickOverlay: () => true,
  [OPEN_EVENT]: () => true,
  [OPENED_EVENT]: () => true,
  [CLOSE_EVENT]: () => true,
  [CLOSED_EVENT]: () => true
};
const countdownProps = {
  ...commonProps,
  /**
   * @description 当前时间，自定义展示内容时生效
   */
  modelValue: makeObjectProp({}),
  /**
   * @description 开始时间
   */
  startTime: {
    type: [Number, String],
    validator(v) {
      const dateStr = new Date(v).toString().toLowerCase();
      return dateStr !== "invalid date";
    }
  },
  /**
   * @description 结束时间
   */
  endTime: {
    type: [Number, String],
    validator(v) {
      const dateStr = new Date(v).toString().toLowerCase();
      return dateStr !== "invalid date";
    }
  },
  /**
   * @description 是否开启毫秒级渲染
   */
  millisecond: Boolean,
  /**
   * @description 时间格式
   */
  format: makeStringProp("HH:mm:ss"),
  /**
   * @description 是否自动开始倒计时
   */
  autoStart: truthProp,
  /**
   * @description 倒计时显示时间，单位是毫秒。`auto-start` 为 `false` 时生效
   */
  time: makeNumericProp(0),
  /**
   * @description 是否暂停
   */
  paused: Boolean
};
const countdownEmits = {
  [INPUT_EVENT]: (val) => val instanceof Object || isString(val),
  [UPDATE_MODEL_EVENT]: (val) => val instanceof Object || isString(val),
  onEnd: () => true,
  onRestart: (val) => isNumber(val) || isString(val) || val === void 0,
  onPaused: (val) => isNumber(val) || isString(val) || val === void 0
};
const ellipsisProps = {
  ...commonProps,
  /**
   * @description 文本内容
   */
  content: makeStringProp(""),
  /**
   * @description 省略位置，可选值 `start` \| `end` \| `middle`
   */
  direction: makeStringProp("end"),
  /**
   * @description 展示几行
   */
  rows: makeNumericProp(1),
  /**
   * @description 展开操作的文案
   */
  expandText: makeStringProp(""),
  /**
   * @description 收起操作的文案
   */
  collapseText: makeStringProp(""),
  /**
   * @description 省略的符号
   */
  symbol: makeStringProp("..."),
  /**
   * @description 容器的行高
   */
  lineHeight: makeNumericProp("20")
};
const ellipsisEmits = {
  change: (val) => val,
  [CLICK_EVENT]: () => true
};
const loadingpageProps = {
  ...commonProps,
  /**
   * @description 提示内容
   */
  loadingText: makeStringProp("正在加载"),
  /**
   * @description 文字上方用于替换loading动画的图片
   */
  image: makeStringProp(""),
  /**
   * @description 是否加载中
   */
  loading: Boolean,
  /**
   * @description 背景颜色
   */
  bgColor: makeStringProp("#ffffff"),
  /**
   * @description 字体颜色
   */
  customColor: makeStringProp("#C8C8C8"),
  /**
   * @description 字体大小
   */
  fontSize: makeNumericProp(19),
  /**
   * @description 图标大小
   */
  iconSize: makeNumericProp(28),
  /**
   * @@description 边框和线条颜色
   */
  loadingColor: makeStringProp("#C8C8C8"),
  /**
   * @description 层级
   */
  zIndex: makeNumberProp(9999)
};
const transitionProps = {
  ...commonProps,
  /**
   * @description 内置动画名称，可选值为 `fade` `fade-up` `fade-down` f`ade-left` `fade-right` `slide-up` `slide-down` `slide-left` `slide-right`
   */
  name: makeStringProp("fade"),
  /**
   * @description 是否展示过渡动画级
   */
  show: Boolean,
  /**
   * @description 动画时长，单位为毫秒
   */
  duration: makeNumberProp(300),
  /**
   * @description 动画函数
   */
  timingFunction: makeStringProp("ease"),
  destroyOnClose: Boolean,
  /**
   * @description 进入动画前的类名
   */
  enterFromClass: String,
  /**
   * @description 进入动画时的类名
   */
  enterActiveClass: String,
  /**
   * @description 进入动画后的类名
   */
  enterToClass: String,
  /**
   * @description 离开动画前的类名
   */
  leaveFromClass: String,
  /**
   * @description 离开动画时的类名
   */
  leaveActiveClass: String,
  /**
   * @description 离开动画后的类名
   */
  leaveToClass: String
};
const transitionEmits = {
  beforeEnter: () => true,
  enter: () => true,
  afterEnter: () => true,
  beforeLeave: () => true,
  leave: () => true,
  afterLeave: () => true,
  [CLICK_EVENT]: (evt) => evt instanceof Object
};
const defaultAnimations = {
  "fade": {
    enter: "nutFadeIn",
    leave: "nutFadeOut"
  },
  "fade-up": {
    enter: "nutFadeUpIn",
    leave: "nutFadeUpOut"
  },
  "fade-down": {
    enter: "nutFadeDownIn",
    leave: "nutFadeDownOut"
  },
  "fade-left": {
    enter: "nutFadeLeftIn",
    leave: "nutFadeLeftOut"
  },
  "fade-right": {
    enter: "nutFadeRightIn",
    leave: "nutFadeRightOut"
  },
  "slide-up": {
    enter: "nutSlideUpIn",
    leave: "nutSlideDownOut"
  },
  "slide-down": {
    enter: "nutSlideDownIn",
    leave: "nutSlideUpOut"
  },
  "slide-left": {
    enter: "nutSlideLeftIn",
    leave: "nutSlideLeftOut"
  },
  "slide-right": {
    enter: "nutSlideRightIn",
    leave: "nutSlideRightOut"
  },
  "zoom": {
    enter: "nutZoomIn",
    leave: "nutZoomOut"
  }
};
const componentName = `${PREFIX}-transition`;
function isKeyOfAnimations(value) {
  const keys = Object.keys(defaultAnimations);
  return keys.includes(value);
}
function getDefaultClassNames(name) {
  return {
    enter: `${name}-enter-from`,
    enterActive: `${name}-enter-active`,
    enterTo: `${name}-enter-to ${name}-enter-active`,
    leave: `${name}-leave-from`,
    leaveActive: `${name}-leave-active`,
    leaveTo: `${name}-leave-to ${name}-leave-active`
  };
}
function getClassNames(name, {
  enterClass,
  enterActiveClass,
  enterToClass,
  leaveClass,
  leaveActiveClass,
  leaveToClass
}) {
  const defaultClassNames = getDefaultClassNames(name);
  return {
    enter: enterClass || defaultClassNames.enter,
    enterActive: enterActiveClass || defaultClassNames.enterActive,
    enterTo: enterToClass || defaultClassNames.enterTo,
    leave: leaveClass || defaultClassNames.leave,
    leaveActive: leaveActiveClass || defaultClassNames.leaveActive,
    leaveTo: leaveToClass || defaultClassNames.leaveTo
  };
}
function useTransition(props, emit2) {
  const display = ref(false);
  const name = computed(() => props.name || "fade");
  const duration = computed(() => props.duration || 200);
  const animationClass = ref("");
  const classNames = computed(
    () => getClassNames(props.name, {
      enterClass: props.enterFromClass,
      enterActiveClass: props.enterActiveClass,
      enterToClass: props.enterToClass,
      leaveClass: props.leaveFromClass,
      leaveActiveClass: props.leaveActiveClass,
      leaveToClass: props.leaveToClass
    })
  );
  async function enter() {
    var _a, _b;
    if (display.value)
      return;
    emit2("beforeEnter");
    display.value = true;
    animationClass.value = ((_a = defaultAnimations[name.value]) == null ? void 0 : _a.enter) ? (_b = defaultAnimations[name.value]) == null ? void 0 : _b.enter : `${classNames.value.enter} ${classNames.value.enterActive}`;
    await nextTick$1();
    emit2("enter");
    setTimeout(() => {
      if (!isKeyOfAnimations(props.name))
        animationClass.value = classNames.value.enterTo;
      emit2("afterEnter");
    }, duration.value);
  }
  async function leave() {
    var _a, _b;
    if (!display.value)
      return;
    emit2("beforeLeave");
    animationClass.value = ((_a = defaultAnimations[name.value]) == null ? void 0 : _a.leave) ? (_b = defaultAnimations[name.value]) == null ? void 0 : _b.leave : `${classNames.value.leave} ${classNames.value.leaveActive}`;
    await nextTick$1();
    emit2("leave");
    setTimeout(() => {
      if (!props.show && display.value)
        display.value = false;
      if (!isKeyOfAnimations(props.name))
        animationClass.value = classNames.value.leaveTo;
      emit2("afterLeave");
    }, duration.value);
  }
  watch(
    () => props.show,
    (val) => {
      val ? enter() : leave();
    },
    { immediate: true }
  );
  function clickHandler(evt) {
    emit2(CLICK_EVENT, evt);
  }
  const classes = computed(() => {
    return getMainClass(props, componentName, {
      [animationClass.value]: true,
      "nut-hidden": !display.value
    });
  });
  const styles = computed(() => {
    return getMainStyle(props, {
      "animation-duration": isKeyOfAnimations(props.name) ? `${props.duration}ms` : "",
      "animation-timing-function": isKeyOfAnimations(props.name) ? props.timingFunction : ""
    });
  });
  return {
    display,
    classes,
    styles,
    clickHandler
  };
}
const AVATAR_GROUP_KEY = Symbol("avatarGroup");
const avatarProps = {
  ...commonProps,
  /**
   * @description 头像的大小，可选值为：`large`、`normal`、`small`，支持直接输入数字
   */
  size: makeNumericProp(void 0),
  /**
   * @description 头像的形状，可选值为：`square`、`round`
   */
  shape: makeStringProp(void 0),
  /**
   * @description 背景色
   */
  bgColor: makeStringProp("#eee"),
  /**
   * @description 字体颜色
   */
  customColor: makeStringProp("#666")
};
const avatarSize = ["large", "normal", "small"];
const progressProps = {
  ...commonProps,
  /**
   * @description 百分比
   */
  percentage: {
    type: [Number, String],
    default: 0,
    required: true
  },
  /**
   * 是否需要展示百分号
   *
   * @description 是否需要展示百分号
   */
  isShowPercentage: truthProp,
  /**
   * @description 进度条背景色
   */
  strokeColor: makeStringProp(""),
  /**
   * @description 进度条宽度
   */
  strokeWidth: makeNumericProp(""),
  /**
   * @description 进度条及文字尺寸,可选值 `small` `base` `large`
   */
  size: makeStringProp("base"),
  /**
   * @description 是否显示进度条文字内容
   */
  showText: truthProp,
  /**
   * @description 进度条文字显示位置(false:外显，true:内显)
   */
  textInside: Boolean,
  /**
   * @description 进度条文字颜色设置
   */
  textColor: makeStringProp(""),
  /**
   * @description 进度条文字背景颜色设置
   */
  textBackground: makeStringProp(""),
  /**
   * @description 进度条当前状态，可选值`active(展示动画效果)` `icon(展示icon标签)`
   */
  status: makeStringProp("text")
};
const elevatorProps = {
  ...commonProps,
  /**
   * @description 电梯区域的高度
   */
  height: makeNumericProp("200px"),
  /**
   * @description 索引 key 值
   */
  acceptKey: makeStringProp("title"),
  /**
   * @description 索引列表
   */
  indexList: makeArrayProp([]),
  /**
   * @description 索引是否吸顶
   */
  isSticky: Boolean,
  /**
   * @description 右侧锚点的上下间距
   */
  spaceHeight: makeNumberProp(23),
  /**
   * @description 左侧索引的高度
   */
  titleHeight: makeNumberProp(35)
};
const elevatorEmits = {
  clickItem: (key, item) => isString(key) && item instanceof Object,
  clickIndex: (key) => isString(key),
  change: (val) => isNumber(val)
};
const calendaritemProps = {
  ...commonProps,
  /**
   * @description 是否可见
   */
  visible: Boolean,
  /**
   * @description 类型，日期单选 `one`，区间选择 `range`，日期多选 `multiple`，周选择 `week`
   */
  type: makeStringProp("one"),
  /**
   * @description 是否弹窗状态展示
   */
  poppable: truthProp,
  /**
   * @description 自动回填
   */
  isAutoBackFill: Boolean,
  /**
   * @description 显示标题
   */
  title: makeStringProp("日期选择"),
  /**
   * @description 默认值，单个日期选择为 `string`，其他为 `string[]`
   */
  defaultValue: {
    type: [String, Array]
  },
  /**
   * @description 开始日期
   */
  startDate: makeStringProp(getDay(0)),
  /**
   * @description 结束日期
   */
  endDate: makeStringProp(getDay(365)),
  /**
   * @description 范围选择，开始信息文案
   */
  startText: makeStringProp("开始"),
  /**
   * @description 范围选择，结束信息文案
   */
  endText: makeStringProp("结束"),
  /**
   * @description 底部确认按钮文案
   */
  confirmText: makeStringProp("确认"),
  /**
   * @description 是否展示今天标记
   */
  showToday: truthProp,
  /**
   * @description 是否在展示日历标题
   */
  showTitle: truthProp,
  /**
   * @description 是否展示日期标题
   */
  showSubTitle: truthProp,
  /**
   * @description 是否启动滚动动画
   */
  toDateAnimation: truthProp,
  /**
   * @description 设置周起始日
   */
  firstDayOfWeek: makeNumberProp(0),
  /**
   * @description 一个用来判断该日期是否被禁用的函数，接受一个 `年 - 月 - 日` 作为参数。 应该返回一个 Boolean 值。
   * @default undefined
   */
  disabledDate: Function,
  /**
   * @description 是否使用 footer 插槽，如果使用,此值必须为 true
   */
  footerSlot: Boolean,
  /**
   * @description 是否使用 btn 插槽，如果使用,此值必须为 true
   */
  btnSlot: Boolean
};
const calendaritemEmits = {
  [CHOOSE_EVENT]: (value) => true,
  [SELECT_EVENT]: (value) => true,
  update: () => true,
  close: () => true
};
const swipeProps = {
  ...commonProps,
  /**
   * @description 唯一标识
   */
  name: String,
  /**
   * @description 是否阻止滑动事件冒泡
   */
  touchMoveStopPropagation: Boolean,
  /**
   * @description 是否阻止滑动事件行为
   */
  touchMovePreventDefault: Boolean,
  /**
   * @description 是否禁用滑动
   */
  disabled: Boolean,
  /**
   * @description 点击自动关闭的部分
   */
  closeOnClick: makeArrayProp(["left", "content", "right"])
};
const swipeEmits = {
  open: (event) => event instanceof Object,
  close: (event) => event instanceof Object,
  [CLICK_EVENT]: (val) => isString(val)
};
exports.AVATAR_GROUP_KEY = AVATAR_GROUP_KEY;
exports.BLUR_EVENT = BLUR_EVENT;
exports.CANCEL_EVENT = CANCEL_EVENT;
exports.CHANGE_EVENT = CHANGE_EVENT;
exports.CHECKBOX_KEY = CHECKBOX_KEY;
exports.CHOOSE_EVENT = CHOOSE_EVENT;
exports.CLEAR_EVENT = CLEAR_EVENT;
exports.CLICK_EVENT = CLICK_EVENT;
exports.CLOSED_EVENT = CLOSED_EVENT;
exports.CLOSE_EVENT = CLOSE_EVENT;
exports.CONFIRM_EVENT = CONFIRM_EVENT;
exports.FOCUS_EVENT = FOCUS_EVENT;
exports.FORM_KEY = FORM_KEY;
exports.INPUT_EVENT = INPUT_EVENT;
exports.MENU_KEY = MENU_KEY;
exports.OPENED_EVENT = OPENED_EVENT;
exports.OPEN_EVENT = OPEN_EVENT;
exports.PREFIX = PREFIX;
exports.RADIO_KEY = RADIO_KEY;
exports.SEARCH_EVENT = SEARCH_EVENT;
exports.SELECTED_EVENT = SELECTED_EVENT;
exports.SELECT_EVENT = SELECT_EVENT;
exports.TAB_KEY = TAB_KEY;
exports.Title = Title;
exports.TypeOfFun = TypeOfFun;
exports.UPDATE_MODEL_EVENT = UPDATE_MODEL_EVENT;
exports.UPDATE_VISIBLE_EVENT = UPDATE_VISIBLE_EVENT;
exports._export_sfc = _export_sfc;
exports.actionsheetEmits = actionsheetEmits;
exports.actionsheetProps = actionsheetProps;
exports.addressEmits = addressEmits;
exports.addressProps = addressProps;
exports.addresslistEmits = addresslistEmits;
exports.addresslistProps = addresslistProps;
exports.avatarProps = avatarProps;
exports.avatarSize = avatarSize;
exports.buttonEmits = buttonEmits;
exports.buttonProps = buttonProps;
exports.calendarEmits = calendarEmits;
exports.calendarProps = calendarProps;
exports.calendaritemEmits = calendaritemEmits;
exports.calendaritemProps = calendaritemProps;
exports.cellEmits = cellEmits;
exports.cellProps = cellProps;
exports.cellgroupProps = cellgroupProps;
exports.checkboxEmits = checkboxEmits;
exports.checkboxProps = checkboxProps;
exports.chooseFile = chooseFile;
exports.cloneDeep = cloneDeep;
exports.colProps = colProps;
exports.collapseEmits = collapseEmits;
exports.collapseProps = collapseProps;
exports.collapseitemProps = collapseitemProps;
exports.compareDate = compareDate;
exports.componentName = componentName$1;
exports.computed = computed;
exports.countdownEmits = countdownEmits;
exports.countdownProps = countdownProps;
exports.createSSRApp = createSSRApp;
exports.createStore = createStore;
exports.createUploader = createUploader;
exports.date2Str = date2Str;
exports.datepickerEmits = datepickerEmits;
exports.datepickerProps = datepickerProps;
exports.dayjs = dayjs;
exports.defineComponent = defineComponent;
exports.dialogEmits = dialogEmits;
exports.dialogProps = dialogProps;
exports.dividerProps = dividerProps;
exports.e = e;
exports.elevatorEmits = elevatorEmits;
exports.elevatorProps = elevatorProps;
exports.ellipsisEmits = ellipsisEmits;
exports.ellipsisProps = ellipsisProps;
exports.emptyProps = emptyProps;
exports.f = f;
exports.floatData = floatData;
exports.formEmits = formEmits;
exports.formProps = formProps;
exports.formatNumber = formatNumber;
exports.formatResultDate = formatResultDate;
exports.formitemProps = formitemProps;
exports.getCurrentInstance = getCurrentInstance;
exports.getDay = getDay;
exports.getMainClass = getMainClass;
exports.getMainStyle = getMainStyle;
exports.getMonthDays = getMonthDays;
exports.getMonthPreDay = getMonthPreDay;
exports.getMonthWeek = getMonthWeek;
exports.getNumTwoBit = getNumTwoBit;
exports.getPropByPath = getPropByPath;
exports.getRandomId = getRandomId;
exports.getTimeStamp = getTimeStamp;
exports.getWeekDate = getWeekDate;
exports.getWhatDay = getWhatDay;
exports.getYearWeek = getYearWeek;
exports.iconEmits = iconEmits;
exports.iconProps = iconProps;
exports.index = index;
exports.inject = inject;
exports.inputEmits = inputEmits;
exports.inputProps = inputProps;
exports.isDate = isDate;
exports.isEqual = isEqual;
exports.isEqualValue = isEqualValue;
exports.isH5 = isH5;
exports.isMpAlipay = isMpAlipay;
exports.isObject = isObject;
exports.isPromise = isPromise;
exports.isRef = isRef;
exports.loadingpageProps = loadingpageProps;
exports.menuProps = menuProps;
exports.menuitemEmits = menuitemEmits;
exports.menuitemProps = menuitemProps;
exports.n = n;
exports.navbarEmits = navbarEmits;
exports.navbarProps = navbarProps;
exports.nextTick$1 = nextTick$1;
exports.notifyDefaultOptions = notifyDefaultOptions;
exports.notifyDefaultOptionsKey = notifyDefaultOptionsKey;
exports.notifyEmits = notifyEmits;
exports.notifyProps = notifyProps;
exports.o = o;
exports.onActivated = onActivated;
exports.onBeforeMount = onBeforeMount;
exports.onBeforeUnmount = onBeforeUnmount;
exports.onMounted = onMounted;
exports.overlayEmits = overlayEmits;
exports.overlayProps = overlayProps;
exports.p = p;
exports.padZero = padZero;
exports.pickerEmits = pickerEmits;
exports.pickerProps = pickerProps;
exports.popupEmits = popupEmits;
exports.popupProps = popupProps;
exports.preventDefault = preventDefault;
exports.progressProps = progressProps;
exports.provide = provide;
exports.pxCheck = pxCheck;
exports.r = r;
exports.radioProps = radioProps;
exports.radiogroupEmits = radiogroupEmits;
exports.radiogroupProps = radiogroupProps;
exports.rangeEmits = rangeEmits;
exports.rangeProps = rangeProps;
exports.reactive = reactive;
exports.readonly = readonly;
exports.ref = ref;
exports.relativeTime = relativeTime;
exports.requestAniFrame = requestAniFrame$1;
exports.resolveComponent = resolveComponent;
exports.rowProps = rowProps;
exports.s = s;
exports.safeareaProps = safeareaProps;
exports.searchbarEmits = searchbarEmits;
exports.searchbarProps = searchbarProps;
exports.skeletonProps = skeletonProps;
exports.sr = sr;
exports.swipeEmits = swipeEmits;
exports.swipeProps = swipeProps;
exports.t = t;
exports.tabpaneEmits = tabpaneEmits;
exports.tabpaneProps = tabpaneProps;
exports.tabsEmits = tabsEmits;
exports.tabsProps = tabsProps;
exports.tagEmits = tagEmits;
exports.tagProps = tagProps;
exports.textareaEmits = textareaEmits;
exports.textareaProps = textareaProps;
exports.toRaw = toRaw;
exports.toRef = toRef;
exports.toRefs = toRefs;
exports.toastDefaultOptions = toastDefaultOptions;
exports.toastDefaultOptionsKey = toastDefaultOptionsKey;
exports.toastEmits = toastEmits;
exports.toastProps = toastProps;
exports.transitionEmits = transitionEmits;
exports.transitionProps = transitionProps;
exports.unref = unref;
exports.uploaderEmits = uploaderEmits;
exports.uploaderProps = uploaderProps;
exports.useDialog = useDialog;
exports.useFormDisabled = useFormDisabled;
exports.useInject = useInject;
exports.useNotify = useNotify;
exports.usePicker = usePicker;
exports.usePopup = usePopup;
exports.useProvide = useProvide;
exports.useRect = useRect;
exports.useSelectorQuery = useSelectorQuery;
exports.useSlots = useSlots;
exports.useTabContentTouch = useTabContentTouch;
exports.useTouch = useTouch;
exports.useTransition = useTransition;
exports.useTranslate = useTranslate;
exports.w = w;
exports.watch = watch;
exports.wx$1 = wx$1;
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map
