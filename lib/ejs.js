/*
 * EJS Embedded JavaScript templates
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

'use strict';

var _DEFAULT_DELIMITER = '%';
var _REGEX_STRING = '(<%%|<%=|<%-|<%#|<%|%>|-%>)';
var _TRAILING_SEMCOL = /;\s*$/;
var _INCLUDE = / include\(/;
var regExpChars = /[|\\{}()[\]^$+*?.]/g;

module.exports = Template;

function Template(text, delimiter) {
  this.templateText = text;
  this.delimiter = delimiter || _DEFAULT_DELIMITER;
  this.mode = null;
  this.truncate = false;
  this.currentLine = 1;
  this.source = '';
  this.regex = this.createRegex();
}

Template.prototype.modes = {
  EVAL: 'eval',
  ESCAPED: 'escaped',
  RAW: 'raw',
  APPEND: 'append',
  COMMENT: 'comment',
  LITERAL: 'literal'
};

Template.prototype.createRegex = function() {
  var str = _REGEX_STRING;
  var delim = escapeRegExpChars(this.delimiter);
  str = str.replace(/%/g, delim);
  return new RegExp(str);
};

Template.prototype.compile = function() {
  this.generateSource();
  var append = 'var locals = it, __output = "";\n  ';
  if (_INCLUDE.test(this.source))
    append += 'var include = function(tplName, data) { return render(tplName, data); }\n  ';
  var src = append + this.source;
  src += '\n  return __output.trim();';
  return 'function(it) {\n  ' + src + '\n}';
};

Template.prototype.generateSource = function() {
  var self = this;
  var matches = this.parseTemplateText();
  var d = this.delimiter;

  if (!matches.length) return;
  matches.forEach(function(line, index) {
    // If this is an opening tag, check for closing tags
    // FIXME: May end up with some false positives here
    // Better to store modes as k/v with '<' + delimiter as key
    // Then this can simply check against the map
    if (line.indexOf('<' + d) === 0 && line.indexOf('<' + d + d) !== 0) { //  If it is a tag and is not escaped
      var closing = matches[index + 2];
      if (!(closing === d + '>' || closing === '-' + d + '>'))
        throw new Error('Could not find matching close tag for "' + line + '".');
    }
    self.scanLine(line);
  });
};

Template.prototype.parseTemplateText = function() {
  var str = this.templateText;
  var pat = this.regex;
  var result = pat.exec(str);
  var arr = [];
  var firstPos, lastPos;

  while (result) {
    firstPos = result.index;
    lastPos = pat.lastIndex;

    if (firstPos !== 0) {
      arr.push(str.substring(0, firstPos));
      str = str.slice(firstPos);
    }

    arr.push(result[0]);
    str = str.slice(result[0].length);
    result = pat.exec(str);
  }

  if (str) arr.push(str);
  return arr;
};

Template.prototype.scanLine = function(line) {
  var self = this;
  var d = this.delimiter;
  var newLineCount = 0;

  function _addOutput() {
    if (self.truncate) line = line.replace('\n', '');

    // Preserve literal slashes
    line = line.replace(/\\/g, '\\\\');

    // Convert linebreaks
    line = line.replace(/\n/g, '\\n');
    line = line.replace(/\r/g, '\\r');

    // Escape double-quotes
    // - this will be the delimiter during execution
    line = line.replace(/"/g, '\\"');
    self.source += ';__output += "' + line + '";';
  }

  newLineCount = (line.split('\n').length - 1);
  switch (line) {
    case '<' + d:
      this.mode = this.modes.EVAL;
      break;
    case '<' + d + '=':
      this.mode = this.modes.ESCAPED;
      break;
    case '<' + d + '-':
      this.mode = this.modes.RAW;
      break;
    case '<' + d + '#':
      this.mode = this.modes.COMMENT;
      break;
    case '<' + d + d:
      this.mode = this.modes.LITERAL;
      this.source += ';__output += "' + line.replace('<' + d + d, '<' + d) + '";';
      break;
    case d + '>':
    case '-' + d + '>':
      if (this.mode === this.modes.LITERAL) _addOutput();
      this.mode = null;
      this.truncate = line.indexOf('-') === 0;
      break;
    default:
      if (!this.mode) return _addOutput();// In string mode, just add the output
      // In script mode, depends on type of tag
      // If '//' is found without a line break, add a line break.
      switch (this.mode) {
        case this.modes.EVAL:
        case this.modes.ESCAPED:
        case this.modes.RAW:
          if (line.lastIndexOf('//') > line.lastIndexOf('\n')) line += '\n';
      }
      switch (this.mode) {
        // Just executing code
        case this.modes.EVAL:
          this.source += ';' + line;
          break;
          // Exec, esc, and output
        case this.modes.ESCAPED:
          // Add the exec'd, escaped result to the output
          // Have to prevent the string-coercion of `undefined` and `null`
          // in the `escape` function -- making a `join` call like below unnecessary
          this.source += ';__output += escape(' +
            line.replace(_TRAILING_SEMCOL, '').trim() + ')';
          break;
          // Exec and output
        case this.modes.RAW:
          // Add the exec'd result to the output
          // Using `join` here prevents string-coercion of `undefined` and `null`
          // without filtering out falsey values like zero
          this.source += ';__output = [__output, ' +
            line.replace(_TRAILING_SEMCOL, '').trim() + '].join("")';
          break;
        case this.modes.COMMENT:
          // Do nothing
          break;
          // Literal <%% mode, append as raw output
        case this.modes.LITERAL:
          _addOutput();
          break;
      }
  }
};

function escapeRegExpChars(string) {
  // istanbul ignore if
  if (!string) return '';
  return String(string).replace(regExpChars, '\\$&');
}
