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

  attr: function(name, val) {
    return this.each(function(i, o) {
      if (val) o.setAttribute(name, val);
      return o.getAttribute(name);
    });
  },

  find: function(selector) {
    return this.each(function(i, o) {
      return A(selector, o);
    });
  },

  css: function(cssjson, val) {
    return this.each(function(i, o) {
      var s = o.style || {}, a = cssjson;
      if (A.isString(a)) {
        if (!val) return s[a];
        if (s.hasOwnProperty(a)) s[a] = val;
      } else {
        for (a in cssjson) {
          if (s.hasOwnProperty(a)) s[a] = cssjson[a];
        }
      }
    });
  }

};
