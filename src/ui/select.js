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
