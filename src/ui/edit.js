/* edit  */

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
