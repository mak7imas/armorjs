/*
  Armorjs.js
*/

(function(){

"use strict";

var A = function(selector , context /*optional*/) {
  context = context || document;
  var r, i, t = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, p;
  try {
    if (A.isObject(selector)) {
      r = selector;
    } else if ((p = t.exec(selector))) {
      r = context.createElement(p[1]);
    } else {
      r = context.querySelectorAll(selector);
      if (A.isArrayType(r) && r.length == 1 && selector.substr(0, 1) == "#") r = r[0];
    }
    A.ext(r, A.domlst);
  } catch (e) {
    r = null;
  }
  return r;
};

window.A = window.armorjs = A;

A.ui = {};

A.each = function(o, callback) {
  var i = 0,
    l = o.length;
  if (A.isArrayType(o)) {
    for (; i < l; i++) {
      if (callback.call(o[i], i, o[i]) === false) break;
    }
  } else {
    return callback.call(o, i, o);
  }
  return o;
};

A.clone = function(obj) {
  //obj = obj || {};
  var c, i = 0,
    l = obj.length;
  if (!obj || "object" != typeof obj) return obj;
  if (obj instanceof Date) {
    c = new Date();
    c.setTime(obj.getTime());
    return c;
  }
  if (obj instanceof Array) {
    c = [];
    for (; i < l; i++) {
      c[i] = A.clone(obj[i]);
    }
    return c;
  }
  if (obj instanceof Object) {
    c = {};
    for (var a in obj) {
      if (obj.hasOwnProperty(a)) c[a] = A.clone(obj[a]);
    }
    return c;
  }
  return obj;
};

A.ext = function(dest) {
  var ss = Array.prototype.slice.call(arguments, 1),
    p, i, s;
  for (i = 0; i < ss.length; i++) {
    s = ss[i] || {};
    for (p in s) {
      if (s.hasOwnProperty(p)) {
        dest[p] = A.clone(s[p]);
      }
    }
  }
  return dest;
};

})();