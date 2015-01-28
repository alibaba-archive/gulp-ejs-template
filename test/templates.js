// **Github:** https://github.com/teambition/gulp-ejs-template
//
// **License:** MIT
/* global module, define, setImmediate, window */

;(function(root, factory) {
  'use strict';

  if (typeof module === 'object' && module.exports) module.exports = factory();
  else if (typeof define === 'function' && define.amd) define([], factory);
  else root.templates = factory();
}(typeof window === 'object' ? window : this, function() {
  'use strict';
  var templates = {};

  templates['header']  = templates['header.html'] = function(it) {
    var locals = it, __output = "";
    var include = function(tplName, data) { return render(tplName, data); }
    ;__output += "<p>";;__output += escape(it.title || 'gulp');__output += " module</p>\n";;__output = [__output, include('user.html', it.user)].join("");__output += "\n";
    return __output.trim();
  };
  
  templates['user-list']  = templates['user-list.html'] = function(it) {
    var locals = it, __output = "";
    ;__output += "<ul>\n  ";; users.forEach(function(user) { ;__output += "    <li>\n      ";;__output += escape(user.name);__output += "\n    </li>\n  ";; }) ;__output += "</ul>\n";
    return __output.trim();
  };
  
  templates['user']  = templates['user.html'] = function(it) {
    var locals = it, __output = "";
    ;__output += "<h1>";;__output += escape(it.name);__output += "</h1>\n";
    return __output.trim();
  };

  var ejs = {
    locals: {},
    get: getTpl,
    render: render
  };
  return ejs;

  function render(tplName, data) {
    var it  = copy({}, ejs.locals);
    return getTpl(tplName)(copy(it, data));
  }

  function getTpl(tplName) {
    return templates[tplName];
  }

  function escape(markup) {
    if (!markup) return '';
    return String(markup)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&quot;');
  }

  function copy(to, from) {
    from = from || {};
    for (var key in from) to[key] = from[key];
    return to;
  }
}));
