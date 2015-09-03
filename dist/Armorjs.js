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

}.call(this));;/* ajax */
A.xhr = function() {
  return new XMLHttpRequest();
};

A.stor = function() {
  return window.localStorage;
};

A.ajson = function(method, url, par, cb, cbe) {
  var x = A.xhr();
  x.onreadystatechange = function() {
    if (x.readyState == 4 && x.status == 200) {
      var rj, rr = x.responseText;
			try {
				if(window.JSON) {
					rj = JSON.parse(rr);
				} else {
          /*jslint evil: true */
					rj = eval("("+rr+")");
				}
        cb(rj);
			} catch (e) {
			  if (cbe) cbe(e, rr);
			}
    }
  };
  if (par instanceof Object) { //json param
    var s='';
    for (var p in par) {
      if (s) s+="&";
      s += p + "=" + encodeURIComponent(par[p]);
    }
    par = s;
  }
  x.open(method, url, true);
  if (method === "POST") {
    x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    x.send(par);
  } else if (method === "GET") {
    if (par) url += (url.indexOf("?") == -1 ? "?" : "&") + par;
    x.open("GET", url);
    x.send();
  }
  return x;
};
;/* common */
A.isArray = function (o) {
  return Array.isArray?Array.isArray(o):(Object.prototype.toString.call(o) === '[object Array]');
};

A.isArrayType = function(o) {
	return (typeof o.length === "number" && o.tagName === undefined);
};

A.isObject = function(o) {
  return (!!o) && (o.constructor === Object);
};

A.isString = function(o) {
  return (!!o) && (o.constructor === String);
};

A.nvl = function (val, defval) { // null to "" || defval
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

A.curStyle = function(o, name){
	if (o.currentStyle)
		return x.currentStyle[name];
	else if (window.getComputedStyle)
		return window.getComputedStyle(o ,null).getPropertyValue(name);
};

A.onload = function(fn) {
  A.on(window, "load", fn);
};
;/* dict */
A.dict = {
  params: {
    url:'armorjs_dict.php',
    dctlst: [],
  },

  load: function (name, hash, cb, cbl) {
    var _this = this, dct, dctlst = this.params.dctlst;
    dct = _this._getStorDct(name, hash);
    if (!dct) {
      if (cbl) cbl();
      A.ajson("GET", this.params.url, {"NAME": name, "HASH": hash}, function (dct) { // dct = {NAME, HASH, ITEMS}
        _this._setStorDct(dct);
        if (cb) cb(dct);
      }, function (e, t){
        alert("error load dict '" + name + "': " + e);
      });
    } else {
      if (cb) cb(dct);
    }
  },

  _setStorDct: function(dct) { 
    var stor = A.stor(), dctlst = this.params.dctlst;
    if (stor) {
      try {
        stor.setItem(dct.NAME, JSON.stringify(dct));
        dctlst[dct.NAME] = dct; 
      } catch (e) {
        console.log("storage is full");
        stor.clear();
      }
    }
  },

  _getStorDct: function(name, hash) {
    var dct, stor = A.stor(), dctlst = this.params.dctlst;
    dct = dctlst[name];
    if (!dct) {
      if (stor) {
        try {
          dct = JSON.parse(stor.getItem(name));
          if (!dct || (hash && dct.HASH != hash)) 
            dct = null;
          else
            dctlst[name] = dct;
        } catch(e) {
          stor.removeItem(name);
          return null;
        }
      }
    }
    return dct;
  }
};
;/* domlst */
A.domlst = {
  each: function(callback) {
    return A.each(this, callback);
  },

  ext: function(obj) {
    if (!this.isNull()) {
      this.each(function(i, o) {
        var r = A.ext(o, A.domlst, obj);
        if (o.init) o.init();
        return r;
      });
    }
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
  },

  // is empty object
  isNull: function() {
    return this._emptyObj === true;
  }
};
;armorjs.env = {};

(function(){

  "use strict";

  if (navigator.userAgent.indexOf("Mobile")!=-1 || navigator.userAgent.indexOf("Windows Phone")!=-1)
    armorjs.env.mobile = true;
  if (armorjs.env.mobile || navigator.userAgent.indexOf("iPad")!=-1 || navigator.userAgent.indexOf("Android")!=-1)
    armorjs.env.touch = true;
  if (navigator.userAgent.indexOf('Opera')!=-1)
    armorjs.env.isOpera=true;
  else {
    armorjs.env.isIE=!!document.all || (navigator.userAgent.indexOf("Trident") !== -1);
    armorjs.env.isFF=(navigator.userAgent.indexOf("Firefox")!=-1);
    armorjs.env.isWebKit=(navigator.userAgent.indexOf("KHTML")!=-1);
    armorjs.env.isSafari=armorjs.env.isWebKit && (navigator.userAgent.indexOf('Mac')!=-1);
  }

  if(navigator.userAgent.toLowerCase().indexOf("android")!=-1){
    armorjs.env.isAndroid = true;
    if(navigator.userAgent.toLowerCase().indexOf("trident")){
      armorjs.env.isAndroid = false;
      armorjs.env.isIEMobile = true;
    }
  }

  armorjs.env.set = function(name, val){
    armorjs.env[name] = val;
  };

  armorjs.env.unset = function(name){
    delete armorjs.env[name];
  };

})();;/* select  */
A.ui.dialog = {
  params: {
    title: ''
  },

  init: function() {
    var _this = this;
    this._initParams();
    this._initDialog();
  },            

  _initParams: function() {
    var p = this.params; 
  },

  _initDialog: function() {
    var z = A.curStyle(this, "z-index");
    z = isNaN(z) ? 10000 : z;
    this.css({
      zIndex: z,
  	  display: "none"
    });

    var b = this._backing = A("<div>");
    b.css({
      position: "fixed",
      display: "none",
      zIndex: --z,
      top: 0, left: 0, right: 0, bottom: 0,
      background:"rgba(0,0,0,0)",
      pointerEvents: "none"
    });
    document.body.appendChild(b);
    b.appendChild(this);
    // create title
    this._ctitle();
    //create close button
    this._cclose();
  },

  _ctitle: function () {
    var o = this._title = A("<div>", {"class": "am-dialog-title"});
    this.insertBefore(o, this.firstChild);
  },

  _cclose: function () {
    var _this = this,  
      o = this._close = A("<div>", {"class": "am-dialog-close"});
    o.innerHTML = "x";
    this.appendChild(o, this.firstChild);
    o.on("click", function() {
      _this.close();
    });
  },     

  show: function(show) {
    show = show ? "block": "none";
    var b = this._backing, 
        m = this._isModal, 
        bpev = m ? "auto" : "none",
        bkgc = m ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0)";
    b.css({display: show, pointerEvents:bpev, background:bkgc});
    this.css({"display": show, pointerEvents: "auto"});
  },

  open: function(modal) {
    var p = this.params, t = this.attr("title");
    if (t) {
      p.title = t;
      this.removeAttribute("title");
    }
    this._title.innerHTML = p.title;
    this._isModal = !!modal;
    this.show(true);
    this._isOpen = true;
  },

  close: function() {
    this.show(false);
    this._isModal = false;
    this._isOpen = false;
  }
};
;/* edit  */

A.ui.edit = {
  params: {
    type: 'C' 
  },

  init: function() {
    this._initParams();
    this.on("blur", function(e) {
      this._toCase();
      this._valid();
    });
  },

  _initParams: function() {
    var t;
    switch((t = this.attr("COLTYPE"))) {
    case "C": this.params.type=t; break;
    case "D": this.params.type=t; break;
    case "T": this.params.type=t; break;
    }
  },

  _toCase: function() {
    this.value = this.value.toLocaleUpperCase();
  },

  _valid: function() {
    try {
      switch(this.params.type) {
        case "T":
        case "D": this._validDate(); break;
        case "N": this._validNumber(); break;
        case "I": this._validInteger(); break;
        case "H": this._validHoursMinutes(); break;
      }
    } catch(e) {
      throw new Error("err");
    }
    return true;
  },

  valt: function() {
    return this.value;
  },

  val: function(newv) {
    newv = newv || "";
    var curv = this.value;
    if (curv != newv)
      this.value = newv;
    return this.value;
  },

  _validDate: function() {
    var v = this.valt();
    if (!v) return;
    v = v.split(" ");
    var d = A.nvl(v[0]), t = A.nvl(v[1]), cd = new Date();
    //Date
    d = d.replace(/[\.,/,\:,\-,\,]/g, ".");
    if ((d.indexOf(".") == -1) && (d.length>1)) {
      switch(d.length){
      case 2: d = d+"." + (cd.getMonth() + 1) + "." + cd.getFullYear(); break;
      case 4: d = d.substr(0, 2) + "." + d.substr(2, 2) + "." + cd.getFullYear(); break;
      case 6:
      case 8: d = d.substr(0, 2) + "." + d.substr(2, 2) + "." + d.substr(4); break;
      }
    }
    var a = d.split(".");
    var dd = a[0], mm = a[1], yy = a[2];

    if (!dd) dd = cd.getDate();
    if (!mm) mm = cd.getMonth() + 1;
    if (!yy) yy = cd.getFullYear();
    if (yy.length == 2) yy = yy < 20 ? "20" +yy : "19" + yy;
    //Time
    t = t.replace(/[\.,/,\:,\-,\,]/g, ":");
    if ((t.indexOf(":") == -1) && (t.length > 1)) {
      switch (t.length){
      case 2: t = t + ":" + "00:00"; break;
      case 4: t = t.substr(0,2) + ":" + t.substr(2,2) + ":00"; break;
      case 6: t = t.substr(0,2) + ":" + t.substr(2,2) + ":" + t.substr(4); break;
      }
    }

    a=t.split(":");
    var hh = a[0], mi = a[1], ss = a[2];
    if (!hh) hh = "00";
    if (!mi) mi = "00";
    if (!ss) ss = "00";

    cd = new Date(yy,mm-1,dd,hh,mi,ss);
    dd = cd.getDate();
    mm = cd.getMonth();
    yy = cd.getFullYear();
    hh = cd.getHours();
    mi = cd.getMinutes();
    ss = cd.getSeconds();

    if (isNaN(dd) || isNaN(mm) || isNaN(yy) || isNaN(hh) || isNaN(mi) || isNaN(ss)) {
      throw new Error("Error of date format");
    }
    var z1 = function (s) {
      return (String(s).length < 2 ? "0" : "") + s;
    };

    if (this.params.type === "T")
      this.val(z1(dd) + "." + z1(mm+1) + "." + yy + " " +z1(hh) + ":" + z1(mi) + ":" + z1(ss));
    else
      this.val(z1(dd) + "." + z1(mm+1) + "." + yy);
  },

  _validHoursMinutes: function() {
    var v = this.valt();
    if (!v) return;
    // Time
    var t = v.replace(/[\.,/,\:,\-,\,]/g, ":");
    if ((t.indexOf(":") == -1) && (t.length > 1)) {
      switch (t.length){
        case 2: t = t + ":00"; break;
        case 3: t = t.substr(0,2) + ":" + t.substr(2,1) + "0"; break;
        case 4: t = t.substr(0,2) + ":" + t.substr(2,2); break;
      }
    }
    var a = t.split(":");
    var hh = A.nvl(a[0]), mi = A.nvl(a[1]);
    if (!hh) hh = "00";
    if (parseInt(hh) > 23) hh = "23";
    if (!mi) mi = "00";
    if (parseInt(mi) > 59) mi = "59";

    var z1 = function (s) {
      return String(s).length<2?"0" : "" + s;
    };
    this.val(z1(hh) + ":" + z1(mi));
  },

  _validNumber: function() {
    var v = this.valt();
    if (!v) return;
    v = v.replace(/[\,]/g, ".");
    v = parseFloat(v);
    if (isNaN(v)) throw new Error("Error number format");
    v = String(v).replace(/[\.]/g, ",");
    this.val(v);
  },

  _validInteger: function() {
    var v = this.valt();
    if (!v) return;
    v = parseInt(v);
    if (isNaN(v)) throw new Error("Error number format");
    this.val(v);
  }
};
;/* select  */
A.ui.select = {
  params: {
    dictName: '',
    dictHash: '',
    value: '',
    prefval: '',
    isOptLoaded: false 
  },

  init: function() {
    var _this = this;
    this._initParams();
    this._loadOptions();
  },            

  _initParams: function() {
    var p = this.params; 
    p.dictName = this.attr("DICTNAME");
    p.dictHash = this.attr("DICTHASH");
    p.value = this.attr("VALUE") || '';
    p.prefval = this.attr("PREFVAL") || '';
  },

  _loadOptions: function() {
    var p = this.params, _this = this;
    if (!p.dictName || p.isOptLoaded) return;

    this.options.length = 0; // clear options
    this.options.add(new Option("loading...", '-', 0, true));
    this.selectedIndex = 0;

    A.dict.load(p.dictName, p.dictHash,  function (dct) {
      var apv = p.prefval.split(","), i, itm, a1 = [], a2 = [];
      for (i=0, l=dct.ITEMS.length; i<l; i++) {
        var isp = false;
        itm = dct.ITEMS[i];
        //itm.SEL = itm.VAL == p.value;
        for (var j=0; j<apv.length; j++) {
          if (itm.VAL == apv[j]) {
            a1[j] = itm;
            isp = true;
            break;
          }
        } 
        if (!isp) a2.push(itm);
      }
      a1 = a1.concat(a2);
      _this.setOptions(a1, true);
      p.isOptLoaded = true;
    });
  },

  /*[{VAL:"",TXT:"",SEL:""},...]*/
  setOptions: function(a, eo) { 
    this.options.length = 0; // clear options
    var p = this.params, i = 0, l = a.length, itm, v =  this.val();
    if (eo) this.options.add(new Option(' ', '-', 1));
    for (; i<l; i++) {
      itm = a[i];
      //itm.SEL = itm.VAL == p.value;
      this.options.add(new Option(itm.TXT, itm.VAL, 0, itm.SEL));
    }
    if (!v  && eo) v = "-";
    this.val(v);
  },

  val: function(v) {
    if (v !== undefined) {
      this.value = this.params.value = v;
    }
    return this.options.length && this.selectedIndex>=0 ? this.options[this.selectedIndex].value : (this.value ? this.value : this.params.value);
  }

};
