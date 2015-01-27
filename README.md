gulp-ejs-template
====
> Precompile EJS templates to a JS file.

## Install

Install with [npm](https://npmjs.org/package/gulp-ejs-template)

```
npm install --save-dev gulp-ejs-template
```

## Usage

```js
var ejsTemplate = require('gulp-ejs-template');

gulp.task('ejsTemplate', function () {
  return gulp.src('test/fixtures/*.html')
  .pipe(ejsTemplate({
    moduleName: 'templates'
  }))
  .pipe(gulp.dest('test'));
});
```

## Demo

`test/fixtures/header.html`:
```html
<p><%= it.name || 'gulp' %> module</p>
```
`test/fixtures/user-list.html`:
```html
<ul>
  <% users.forEach(function(user) { -%>
    <li>
      <%= user.name %>
    </li>
  <% }) -%>
</ul>
```
`test/fixtures/user.html`:
```html
<h1><%= it.name %></h1>
```

precompile to `test/templates.js`:
```js
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
```


## Options

### moduleName

*Optional*, Type: `String`, Default: `'templates'`.

Name of the templates module.

### delimiter

*Optional*, Type: `String`, Default: `%`.

ejs's delimiter.

## License

MIT © [Teambition](http://teambition.com)
