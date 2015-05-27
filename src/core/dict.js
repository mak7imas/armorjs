/* dict */
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
