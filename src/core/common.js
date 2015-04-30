/* common */
A.isArray = function (o) {
  return Array.isArray?Array.isArray(o):(Object.prototype.toString.call(o) === '[object Array]');
};

A.isArrayType = function(o) {
	return (typeof o.length === "number" && o.tagName === undefined);
};

A.nvl = function (val, defval) {
  defval = defval || "";
  return val || defval;
};

A.on = function(el, type, fn, capture) {
  if (el.addEventListener) {
    el.addEventListener(type, fn, !!capture);
  } else if (el.attachEvent) {
    el.attachEvent("on" + type, fn);
  }
  return el;
};

A.off = function(el, type, fn, capture) {
  if (el.removeEventListener) {
    el.removeEventListener(type, fn, !!capture);
  } else if (el.detachEvent) {
    el.detachEvent("on" + type, fn);
  }
  return el;
};

A.onload = function(fn) {
  A.on(window, "load", fn);
};
