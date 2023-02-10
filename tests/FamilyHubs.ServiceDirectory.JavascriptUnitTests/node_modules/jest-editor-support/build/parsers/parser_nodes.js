"use strict";

require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.object.set-prototype-of.js");
require("core-js/modules/es.function.bind.js");
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/es.reflect.construct.js");
require("core-js/modules/es.object.create.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParsedRange = exports.ParsedNodeTypes = exports.ParsedNode = exports.ParseResult = exports.NamedBlock = exports.ItBlock = exports.Expect = exports.DescribeBlock = void 0;
require("core-js/modules/es.array.for-each.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.array.some.js");
require("core-js/modules/es.array.concat.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
/* eslint-disable no-use-before-define */
/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
/**
 * range and location here are 1-based position.
 */
var ParsedRange = /*#__PURE__*/_createClass(function ParsedRange(startLine, startCol, endLine, endCol) {
  _classCallCheck(this, ParsedRange);
  this.start = {
    column: startCol,
    line: startLine
  };
  this.end = {
    column: endCol,
    line: endLine
  };
}); // export type ParsedNodeType = 'expect' | 'describe' | 'it' | 'ROOT';
exports.ParsedRange = ParsedRange;
var ParsedNodeTypes = {
  describe: 'describe',
  expect: 'expect',
  it: 'it',
  root: 'root'
};
exports.ParsedNodeTypes = ParsedNodeTypes;
var ParsedNode = /*#__PURE__*/function () {
  function ParsedNode(type, file) {
    _classCallCheck(this, ParsedNode);
    this.type = type;
    this.file = file;
  }
  _createClass(ParsedNode, [{
    key: "addChild",
    value: function addChild(type) {
      var child;
      switch (type) {
        case ParsedNodeTypes.describe:
          child = new DescribeBlock(this.file);
          break;
        case ParsedNodeTypes.it:
          child = new ItBlock(this.file);
          break;
        case ParsedNodeTypes.expect:
          child = new Expect(this.file);
          break;
        default:
          throw TypeError("unexpected child node type: ".concat(type));
      }
      if (!this.children) {
        this.children = [child];
      } else {
        this.children.push(child);
      }
      return child;
    }
  }, {
    key: "filter",
    value: function filter(f) {
      var filterSelf = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var filtered = [];
      var _filter = function _filter(node, _filterSelf) {
        if (_filterSelf && f(node)) {
          filtered.push(node);
        }
        if (node.children) {
          node.children.forEach(function (c) {
            return _filter(c, true);
          });
        }
      };
      _filter(this, filterSelf);
      return filtered;
    }
  }]);
  return ParsedNode;
}();
exports.ParsedNode = ParsedNode;
var Expect = /*#__PURE__*/function (_ParsedNode) {
  _inherits(Expect, _ParsedNode);
  var _super = _createSuper(Expect);
  function Expect(file) {
    _classCallCheck(this, Expect);
    return _super.call(this, ParsedNodeTypes.expect, file);
  }
  return _createClass(Expect);
}(ParsedNode);
exports.Expect = Expect;
var NamedBlock = /*#__PURE__*/function (_ParsedNode2) {
  _inherits(NamedBlock, _ParsedNode2);
  var _super2 = _createSuper(NamedBlock);
  /**
   * type of the name, it's the babel Node["type"], such as "Literal", "TemplateLiteral" etc
   *
   * TODO babel parser currently returns "Literal" for the it/describe name argument, which is not part of its "type" definition, therefore declare a string type for now until it is fixed in babel.
   * */

  function NamedBlock(type, file, name) {
    var _this;
    _classCallCheck(this, NamedBlock);
    _this = _super2.call(this, type, file);
    if (name) {
      _this.name = name;
    }
    return _this;
  }
  return _createClass(NamedBlock);
}(ParsedNode);
exports.NamedBlock = NamedBlock;
var ItBlock = /*#__PURE__*/function (_NamedBlock) {
  _inherits(ItBlock, _NamedBlock);
  var _super3 = _createSuper(ItBlock);
  function ItBlock(file, name) {
    _classCallCheck(this, ItBlock);
    return _super3.call(this, ParsedNodeTypes.it, file, name);
  }
  return _createClass(ItBlock);
}(NamedBlock);
exports.ItBlock = ItBlock;
var DescribeBlock = /*#__PURE__*/function (_NamedBlock2) {
  _inherits(DescribeBlock, _NamedBlock2);
  var _super4 = _createSuper(DescribeBlock);
  function DescribeBlock(file, name) {
    _classCallCheck(this, DescribeBlock);
    return _super4.call(this, ParsedNodeTypes.describe, file, name);
  }
  return _createClass(DescribeBlock);
}(NamedBlock); // export type NodeClass = Node | Expect | ItBlock | DescribeBlock;
exports.DescribeBlock = DescribeBlock;
var ParseResult = /*#__PURE__*/function () {
  function ParseResult(file) {
    _classCallCheck(this, ParseResult);
    this.file = file;
    this.root = new ParsedNode(ParsedNodeTypes.root, file);
    this.describeBlocks = [];
    this.expects = [];
    this.itBlocks = [];
  }
  _createClass(ParseResult, [{
    key: "addNode",
    value: function addNode(node) {
      var dedup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (node instanceof DescribeBlock) {
        this.describeBlocks.push(node);
      } else if (node instanceof ItBlock) {
        this.itBlocks.push(node);
      } else if (node instanceof Expect) {
        if (dedup && this.expects.some(function (e) {
          return e.start.line === node.start.line && e.start.column === node.start.column;
        })) {
          // found dup, return
          return;
        }
        this.expects.push(node);
      } else {
        throw new TypeError("unexpected node class '".concat(_typeof(node), "': ").concat(JSON.stringify(node)));
      }
    }
  }]);
  return ParseResult;
}();
exports.ParseResult = ParseResult;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQYXJzZWRSYW5nZSIsInN0YXJ0TGluZSIsInN0YXJ0Q29sIiwiZW5kTGluZSIsImVuZENvbCIsInN0YXJ0IiwiY29sdW1uIiwibGluZSIsImVuZCIsIlBhcnNlZE5vZGVUeXBlcyIsImRlc2NyaWJlIiwiZXhwZWN0IiwiaXQiLCJyb290IiwiUGFyc2VkTm9kZSIsInR5cGUiLCJmaWxlIiwiY2hpbGQiLCJEZXNjcmliZUJsb2NrIiwiSXRCbG9jayIsIkV4cGVjdCIsIlR5cGVFcnJvciIsImNoaWxkcmVuIiwicHVzaCIsImYiLCJmaWx0ZXJTZWxmIiwiZmlsdGVyZWQiLCJfZmlsdGVyIiwibm9kZSIsIl9maWx0ZXJTZWxmIiwiZm9yRWFjaCIsImMiLCJOYW1lZEJsb2NrIiwibmFtZSIsIlBhcnNlUmVzdWx0IiwiZGVzY3JpYmVCbG9ja3MiLCJleHBlY3RzIiwiaXRCbG9ja3MiLCJkZWR1cCIsInNvbWUiLCJlIiwiSlNPTiIsInN0cmluZ2lmeSJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXJzL3BhcnNlcl9ub2Rlcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby11c2UtYmVmb3JlLWRlZmluZSAqL1xuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB0eXBlIHtMb2NhdGlvbn0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIHJhbmdlIGFuZCBsb2NhdGlvbiBoZXJlIGFyZSAxLWJhc2VkIHBvc2l0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgUGFyc2VkUmFuZ2Uge1xuICBzdGFydDogTG9jYXRpb247XG5cbiAgZW5kOiBMb2NhdGlvbjtcblxuICBjb25zdHJ1Y3RvcihzdGFydExpbmU6IG51bWJlciwgc3RhcnRDb2w6IG51bWJlciwgZW5kTGluZTogbnVtYmVyLCBlbmRDb2w6IG51bWJlcikge1xuICAgIHRoaXMuc3RhcnQgPSB7Y29sdW1uOiBzdGFydENvbCwgbGluZTogc3RhcnRMaW5lfTtcbiAgICB0aGlzLmVuZCA9IHtjb2x1bW46IGVuZENvbCwgbGluZTogZW5kTGluZX07XG4gIH1cbn1cblxuLy8gZXhwb3J0IHR5cGUgUGFyc2VkTm9kZVR5cGUgPSAnZXhwZWN0JyB8ICdkZXNjcmliZScgfCAnaXQnIHwgJ1JPT1QnO1xuXG5leHBvcnQgY29uc3QgUGFyc2VkTm9kZVR5cGVzID0ge1xuICBkZXNjcmliZTogJ2Rlc2NyaWJlJyxcbiAgZXhwZWN0OiAnZXhwZWN0JyxcbiAgaXQ6ICdpdCcsXG4gIHJvb3Q6ICdyb290Jyxcbn07XG5cbmV4cG9ydCB0eXBlIFBhcnNlZE5vZGVUeXBlID0gJEtleXM8dHlwZW9mIFBhcnNlZE5vZGVUeXBlcz47XG5cbmV4cG9ydCBjbGFzcyBQYXJzZWROb2RlIHtcbiAgdHlwZTogUGFyc2VkTm9kZVR5cGU7XG5cbiAgc3RhcnQ6IExvY2F0aW9uO1xuXG4gIGVuZDogTG9jYXRpb247XG5cbiAgZmlsZTogc3RyaW5nO1xuXG4gIGNoaWxkcmVuOiA/QXJyYXk8UGFyc2VkTm9kZT47XG5cbiAgY29uc3RydWN0b3IodHlwZTogUGFyc2VkTm9kZVR5cGUsIGZpbGU6IHN0cmluZykge1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5maWxlID0gZmlsZTtcbiAgfVxuXG4gIGFkZENoaWxkKHR5cGU6IFBhcnNlZE5vZGVUeXBlKTogUGFyc2VkTm9kZSB7XG4gICAgbGV0IGNoaWxkOiBQYXJzZWROb2RlO1xuXG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIFBhcnNlZE5vZGVUeXBlcy5kZXNjcmliZTpcbiAgICAgICAgY2hpbGQgPSBuZXcgRGVzY3JpYmVCbG9jayh0aGlzLmZpbGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUGFyc2VkTm9kZVR5cGVzLml0OlxuICAgICAgICBjaGlsZCA9IG5ldyBJdEJsb2NrKHRoaXMuZmlsZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBQYXJzZWROb2RlVHlwZXMuZXhwZWN0OlxuICAgICAgICBjaGlsZCA9IG5ldyBFeHBlY3QodGhpcy5maWxlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoYHVuZXhwZWN0ZWQgY2hpbGQgbm9kZSB0eXBlOiAke3R5cGV9YCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5jaGlsZHJlbikge1xuICAgICAgdGhpcy5jaGlsZHJlbiA9IFtjaGlsZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgfVxuICAgIHJldHVybiBjaGlsZDtcbiAgfVxuXG4gIGZpbHRlcihmOiAobm9kZTogUGFyc2VkTm9kZSkgPT4gYm9vbGVhbiwgZmlsdGVyU2VsZjogYm9vbGVhbiA9IGZhbHNlKTogQXJyYXk8UGFyc2VkTm9kZT4ge1xuICAgIGNvbnN0IGZpbHRlcmVkOiBBcnJheTxQYXJzZWROb2RlPiA9IFtdO1xuXG4gICAgY29uc3QgX2ZpbHRlciA9IChub2RlOiBQYXJzZWROb2RlLCBfZmlsdGVyU2VsZjogYm9vbGVhbikgPT4ge1xuICAgICAgaWYgKF9maWx0ZXJTZWxmICYmIGYobm9kZSkpIHtcbiAgICAgICAgZmlsdGVyZWQucHVzaChub2RlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKChjKSA9PiBfZmlsdGVyKGMsIHRydWUpKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX2ZpbHRlcih0aGlzLCBmaWx0ZXJTZWxmKTtcbiAgICByZXR1cm4gZmlsdGVyZWQ7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV4cGVjdCBleHRlbmRzIFBhcnNlZE5vZGUge1xuICBjb25zdHJ1Y3RvcihmaWxlOiBzdHJpbmcpIHtcbiAgICBzdXBlcihQYXJzZWROb2RlVHlwZXMuZXhwZWN0LCBmaWxlKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTmFtZWRCbG9jayBleHRlbmRzIFBhcnNlZE5vZGUge1xuICBuYW1lOiBzdHJpbmc7XG5cbiAgbmFtZVJhbmdlOiBQYXJzZWRSYW5nZTtcblxuICBsYXN0UHJvcGVydHk6ID9zdHJpbmc7XG5cbiAgLyoqXG4gICAqIHR5cGUgb2YgdGhlIG5hbWUsIGl0J3MgdGhlIGJhYmVsIE5vZGVbXCJ0eXBlXCJdLCBzdWNoIGFzIFwiTGl0ZXJhbFwiLCBcIlRlbXBsYXRlTGl0ZXJhbFwiIGV0Y1xuICAgKlxuICAgKiBUT0RPIGJhYmVsIHBhcnNlciBjdXJyZW50bHkgcmV0dXJucyBcIkxpdGVyYWxcIiBmb3IgdGhlIGl0L2Rlc2NyaWJlIG5hbWUgYXJndW1lbnQsIHdoaWNoIGlzIG5vdCBwYXJ0IG9mIGl0cyBcInR5cGVcIiBkZWZpbml0aW9uLCB0aGVyZWZvcmUgZGVjbGFyZSBhIHN0cmluZyB0eXBlIGZvciBub3cgdW50aWwgaXQgaXMgZml4ZWQgaW4gYmFiZWwuXG4gICAqICovXG4gIG5hbWVUeXBlOiA/c3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHR5cGU6IFBhcnNlZE5vZGVUeXBlLCBmaWxlOiBzdHJpbmcsIG5hbWU/OiBzdHJpbmcpIHtcbiAgICBzdXBlcih0eXBlLCBmaWxlKTtcbiAgICBpZiAobmFtZSkge1xuICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEl0QmxvY2sgZXh0ZW5kcyBOYW1lZEJsb2NrIHtcbiAgY29uc3RydWN0b3IoZmlsZTogc3RyaW5nLCBuYW1lPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoUGFyc2VkTm9kZVR5cGVzLml0LCBmaWxlLCBuYW1lKTtcbiAgfVxufVxuZXhwb3J0IGNsYXNzIERlc2NyaWJlQmxvY2sgZXh0ZW5kcyBOYW1lZEJsb2NrIHtcbiAgY29uc3RydWN0b3IoZmlsZTogc3RyaW5nLCBuYW1lPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoUGFyc2VkTm9kZVR5cGVzLmRlc2NyaWJlLCBmaWxlLCBuYW1lKTtcbiAgfVxufVxuXG4vLyBleHBvcnQgdHlwZSBOb2RlQ2xhc3MgPSBOb2RlIHwgRXhwZWN0IHwgSXRCbG9jayB8IERlc2NyaWJlQmxvY2s7XG5cbmV4cG9ydCBjbGFzcyBQYXJzZVJlc3VsdCB7XG4gIGRlc2NyaWJlQmxvY2tzOiBBcnJheTxEZXNjcmliZUJsb2NrPjtcblxuICBleHBlY3RzOiBBcnJheTxFeHBlY3Q+O1xuXG4gIGl0QmxvY2tzOiBBcnJheTxJdEJsb2NrPjtcblxuICByb290OiBQYXJzZWROb2RlO1xuXG4gIGZpbGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihmaWxlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmZpbGUgPSBmaWxlO1xuICAgIHRoaXMucm9vdCA9IG5ldyBQYXJzZWROb2RlKFBhcnNlZE5vZGVUeXBlcy5yb290LCBmaWxlKTtcblxuICAgIHRoaXMuZGVzY3JpYmVCbG9ja3MgPSBbXTtcbiAgICB0aGlzLmV4cGVjdHMgPSBbXTtcbiAgICB0aGlzLml0QmxvY2tzID0gW107XG4gIH1cblxuICBhZGROb2RlKG5vZGU6IFBhcnNlZE5vZGUsIGRlZHVwOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIERlc2NyaWJlQmxvY2spIHtcbiAgICAgIHRoaXMuZGVzY3JpYmVCbG9ja3MucHVzaChub2RlKTtcbiAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBJdEJsb2NrKSB7XG4gICAgICB0aGlzLml0QmxvY2tzLnB1c2gobm9kZSk7XG4gICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgRXhwZWN0KSB7XG4gICAgICBpZiAoZGVkdXAgJiYgdGhpcy5leHBlY3RzLnNvbWUoKGUpID0+IGUuc3RhcnQubGluZSA9PT0gbm9kZS5zdGFydC5saW5lICYmIGUuc3RhcnQuY29sdW1uID09PSBub2RlLnN0YXJ0LmNvbHVtbikpIHtcbiAgICAgICAgLy8gZm91bmQgZHVwLCByZXR1cm5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmV4cGVjdHMucHVzaChub2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgdW5leHBlY3RlZCBub2RlIGNsYXNzICcke3R5cGVvZiBub2RlfSc6ICR7SlNPTi5zdHJpbmdpZnkobm9kZSl9YCk7XG4gICAgfVxuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFGQSxJQUdhQSxXQUFXLDZCQUt0QixxQkFBWUMsU0FBaUIsRUFBRUMsUUFBZ0IsRUFBRUMsT0FBZSxFQUFFQyxNQUFjLEVBQUU7RUFBQTtFQUNoRixJQUFJLENBQUNDLEtBQUssR0FBRztJQUFDQyxNQUFNLEVBQUVKLFFBQVE7SUFBRUssSUFBSSxFQUFFTjtFQUFTLENBQUM7RUFDaEQsSUFBSSxDQUFDTyxHQUFHLEdBQUc7SUFBQ0YsTUFBTSxFQUFFRixNQUFNO0lBQUVHLElBQUksRUFBRUo7RUFBTyxDQUFDO0FBQzVDLENBQUMsR0FHSDtBQUFBO0FBRU8sSUFBTU0sZUFBZSxHQUFHO0VBQzdCQyxRQUFRLEVBQUUsVUFBVTtFQUNwQkMsTUFBTSxFQUFFLFFBQVE7RUFDaEJDLEVBQUUsRUFBRSxJQUFJO0VBQ1JDLElBQUksRUFBRTtBQUNSLENBQUM7QUFBQztBQUFBLElBSVdDLFVBQVU7RUFXckIsb0JBQVlDLElBQW9CLEVBQUVDLElBQVksRUFBRTtJQUFBO0lBQzlDLElBQUksQ0FBQ0QsSUFBSSxHQUFHQSxJQUFJO0lBQ2hCLElBQUksQ0FB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