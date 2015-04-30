armorjs.env = {};

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

})();