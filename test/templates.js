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

  templates['header'] = function(it) {
    var locals = it, __output = "";
    ;__output += "<p>";;__output += escape(it.name || 'gulp');__output += " module</p>\n";
    return __output.trim();
  };
  
  templates['user-list'] = function(it) {
    var locals = it, __output = "";
    ;__output += "<ul>\n  ";; users.forEach(function(user) { ;__output += "    <li>\n      ";;__output += escape(user.name);__output += "\n    </li>\n  ";; }) ;__output += "</ul>\n";
    return __output.trim();
  };
  
  templates['user'] = function(it) {
    var locals = it, __output = "";
    ;__output += "<h1>";;__output += escape(it.name);__output += "</h1>\n";
    return __output.trim();
  };

  return templates;

  function escape(markup) {
    if (!markup) return '';
    return String(markup)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');
  }
}));
