/* select  */
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
