/*
  Armorjs.js
  javascript library
*/

(function() {

  "use strict";

  var me = this;

  var _istag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
  var prevarmorjs = me.armorjs;
  var prevA = me.A;

  /**
   * [A factory function]
   * @selector {String}
   * @context {[Object]}
   */
  var A = function(selector, context) {
    var r, p, c = context || document;
    try {
      if (A.isObject(selector)) {
        r = selector;
      } else if ((p = _istag.exec(selector))) {
        r = document.createElement(p[1]);
        if (A.isObject((c = context))) {
          for (p in c) {
            r.setAttribute(p, c[p]);
          }
        }
      } else {
        r = c.querySelectorAll(selector);
        if (!r || !r.length) r = {_emptyObj: true};
        else if (A.isArrayType(r) && r.length == 1 && selector.substr(0, 1) == "#") r = r[0];
      }
      A.ext(r, A.domlst);
    } catch (e) {
      r = null;
    }
    return r;
  };

  A.noConflict = function() {
    if (me.A === armorjs) {
      me.A = prevA;
    }

    if (me.armorjs === armorjs) {
      me.armorjs = prevarmorjs;
    }

    return A;
  };

  A.VERSION = '0.0.1';

  A.ui = {};

  me.A = me.armorjs = A;
  /**
   * [uid create unique id value]
   * @return {[Number]}
   */
  A.uid = function() {
    if (!this._sequence) this._sequence = (new Date()).valueOf();
    this._sequence++;
    return this._sequence;
  };
  /**
   * [forEach description]
   * @o  {Array}
   * @callback  {Function}
   * @return {Array}
   */
  A.each = A.forEach = function(o, callback) {
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
  /**
   * [clone object]
   * @param  {Object}
   * @return {Object}
   */
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
  /**
   * [ext description]
   * @param  {[type]}
   * @return {[type]}
   */
  A.ext = function(dest) {
    dest = dest || {};
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

}.call(this));