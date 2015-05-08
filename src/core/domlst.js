/* domlst */
A.domlst = {
  each: function(callback) {
    return A.each(this, callback);
  },

  ext: function(obj) {
    this.each(function(i, o) {
      var r = A.ext(o, A.domlst, obj);
      if (o.init) o.init();
      return r;
    });
    return this;
  },

  on: function(type, fn, capture) {
    this.each(function(i, o) {
      A.on(o, type, fn, capture);
    });
    return this;
  },

  off: function(type, fn, capture) {
    this.each(function(i, o) {
      A.off(o, type, fn, capture);
    });
    return this;
  },

  find: function(selector) {
    return this.each(function(i, o) {
      return A(selector, o);
    });
  },

  attr: function(namejson, val) {
    return this.each(function(i, o) {
      var a = namejson, p;
      if (A.isString(a)) {
        if (!val) return o.getAttribute(a);
        o.setAttribute(a, val);
      } else {
        for (p in a) {
          o.setAttribute(p, a[p]);
        }
      }
      return o;
    });
  },

  css: function(cssjson, val) {
    return this.each(function(i, o) {
      var s = o.style || {}, a = cssjson, p;
      if (A.isString(a)) {
        if (!val) return s[a];
        if (s.hasOwnProperty(a)) s[a] = val;
      } else {
        for (p in a) {
          if (s.hasOwnProperty(p)) {
            s[p] = a[p];
          }
        }
      }
      return o;
    });
  }

};
