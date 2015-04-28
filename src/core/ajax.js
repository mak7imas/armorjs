/* ajax */
A.xhr = function() {
  return new XMLHttpRequest();
};

A.stor = function() {
  return window.localStorage;
};

A.json = function(method, url, par, cb, cbe) {
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
			  if (cbe) cbe(e);
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
