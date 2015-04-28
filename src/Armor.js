/*

 Armorjs, a JavaScript library for input form.
 (c) 2014-2015, Maksym Andreev

*/



var A = function(a /*selector*/, b /*optional context*/) {
  var r, i;
  try {
    r = (b || document).querySelectorAll(a);
    if (A.isArrayType(r) && r.length == 1 && a.substr(0 , 1) == "#") r = r[0];
    A.ext(r, A.domlst);
  } catch(e) {
    r = null;
  }
  return r;
};
window.A = A;

A.ui = {};

A.each = function(o, callback) {
  var i = 0, l = o.length;
  if (A.isArrayType(o)) {
    for (; i < l; i++) {
      if (callback.call(o[i], i, o[i]) === false) break;
    }
  } else {
    return callback.call(o, i, o);
  }
  return o;
};

A.clone = function (obj) {
  //obj = obj || {};
  var c, i = 0, l = obj.length;
  if (!obj || "object" != typeof obj) return obj;
  if (obj instanceof Date) {
    c = new Date();
    c.setTime(obj.getTime());
    return c;
  }
  if (obj instanceof Array) {
    c = [];
    for (; i < l; i++) {
      c[i] = clone(obj[i]);
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

A.ext = function (dest) {
  var ss = Array.prototype.slice.call(arguments, 1), p, i, s;
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
