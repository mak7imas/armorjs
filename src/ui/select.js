/* select  */
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
    A.dict.load(p.dictName, p.dictHash,  function (dct) {
      var apv = p.prefval.split(","), i, itm, a1 = [], a2 = [];
      for (i=0, l=dct.items.length; i<l; i++) {
        var isp = false;
        itm = dct.items[i];
        itm.sel = itm.val == p.value;
        for (var j=0; j<apv.length; j++) {
          if (itm.val == apv[j]) {
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

  /*[{val:"",txt:"",sel:""},...]*/
  setOptions: function(a, eo) { 
    var i = 0, l = a.length, itm;
    this.options.length = 0; // clear options
    if (eo) this.options.add(new Option(' ', '-', 1));
    for (; i<l; i++) {
      itm = a[i];
      this.options.add(new Option(itm.txt, itm.val, 0, itm.sel));
    }
  },

  val: function(v) {
    if (v) {
      this.value = v;
    }
    return !this.options.length ? null: this.options[this.selectedIndex].value;
  }

};
