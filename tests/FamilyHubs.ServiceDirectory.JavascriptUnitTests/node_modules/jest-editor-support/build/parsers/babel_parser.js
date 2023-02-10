"use strict";

require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.object.keys.js");
require("core-js/modules/es.object.get-own-property-descriptor.js");
require("core-js/modules/es.object.get-own-property-descriptors.js");
require("core-js/modules/es.object.define-properties.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.weak-map.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = exports.getASTfor = void 0;
require("core-js/modules/es.date.to-string.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.array.reduce.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.array.is-array.js");
require("core-js/modules/es.array.for-each.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.array.filter.js");
var _fs = require("fs");
var _types = require("@babel/types");
var parser = _interopRequireWildcard(require("@babel/parser"));
var _parser_nodes = require("./parser_nodes");
var _helper = require("./helper");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
// $FlowIgnore[value-as-type]
var _getASTfor = function _getASTfor(file, data, options) {
  var _data = data || (0, _fs.readFileSync)(file).toString();
  var config = _objectSpread(_objectSpread({}, options), {}, {
    sourceType: 'module'
  });
  return [parser.parse(_data, config), _data];
};

// $FlowIgnore[value-as-type]
var getASTfor = function getASTfor(file, data, options) {
  var _getASTfor2 = _getASTfor(file, data, (0, _helper.parseOptions)(file, options)),
    _getASTfor3 = _slicedToArray(_getASTfor2, 1),
    bFile = _getASTfor3[0];
  return bFile;
};

// $FlowIgnore[value-as-type]
exports.getASTfor = getASTfor;
var parse = function parse(file, data, options) {
  var parseResult = new _parser_nodes.ParseResult(file);
  var _getASTfor4 = _getASTfor(file, data, options),
    _getASTfor5 = _slicedToArray(_getASTfor4, 2),
    ast = _getASTfor5[0],
    _data = _getASTfor5[1];

  // $FlowIgnore[value-as-type]
  var deepGet = function deepGet(node) {
    for (var _len = arguments.length, types = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      types[_key - 1] = arguments[_key];
    }
    return (
      // $FlowIgnore[value-as-type]
      types.reduce(function (rootForType, type) {
        while (rootForType[type]) {
          rootForType = rootForType[type];
        }
        return rootForType;
      }, node)
    );
  };

  // $FlowIgnore[value-as-type]
  var updateNameInfo = function updateNameInfo(nBlock, bNode, lastProperty) {
    var arg = bNode.expression.arguments[0];
    var name = arg.value;
    if (!name) {
      switch (arg.type) {
        case 'TemplateLiteral':
          name = _data.substring(arg.start + 1, arg.end - 1);
          break;
        default:
          name = _data.substring(arg.start, arg.end);
          break;
      }
    }
    nBlock.name = name;
    nBlock.nameType = arg.type;
    nBlock.lastProperty = lastProperty;
    nBlock.nameRange = new _parser_nodes.ParsedRange(arg.loc.start.line, arg.loc.start.column + 2, arg.loc.end.line, arg.loc.end.column - 1);
  };

  // $FlowIgnore[value-as-type]
  var updateNode = function updateNode(node, babylonNode, lastProperty) {
    node.start = babylonNode.loc.start;
    node.end = babylonNode.loc.end;
    node.start.column += 1;
    parseResult.addNode(node);
    if (node instanceof _parser_nodes.NamedBlock) {
      updateNameInfo(node, babylonNode, lastProperty);
    }
  };

  // $FlowIgnore[value-as-type]
  var isFunctionCall = function isFunctionCall(node) {
    return node && node.type === 'ExpressionStatement' && node.expression && node.expression.type === 'CallExpression';
  };
  var isFunctionDeclaration = function isFunctionDeclaration(nodeType) {
    return nodeType === 'ArrowFunctionExpression' || nodeType === 'FunctionExpression';
  };

  // Pull out the name of a CallExpression (describe/it) and the last property (each, skip etc)
  var getNameForNode = function getNameForNode(node) {
    if (isFunctionCall(node) && node.expression.callee) {
      var _rootCallee$property, _deepGet$property;
      // Get root callee in case it's a chain of higher-order functions (e.g. .each(table)(name, fn))
      var rootCallee = deepGet(node.expression, 'callee');
      var property = ((_rootCallee$property = rootCallee.property) === null || _rootCallee$property === void 0 ? void 0 : _rootCallee$property.name) || ((_deepGet$property = deepGet(rootCallee, 'tag').property) === null || _deepGet$property === void 0 ? void 0 : _deepGet$property.name);
      var name = rootCallee.name ||
      // handle cases where it's a member expression (e.g .only or .concurrent.only)
      deepGet(rootCallee, 'object').name ||
      // handle cases where it's part of a tag (e.g. .each`table`)
      deepGet(rootCallee, 'tag', 'object').name;
      return [name, property];
    }
    return [];
  };

  // When given a node in the AST, does this represent
  // the start of an it/test block?
  var isAnIt = function isAnIt(name) {
    return name === 'it' || name === 'fit' || name === 'test';
  };
  var isAnDescribe = function isAnDescribe(name) {
    return name === 'describe';
  };

  // When given a node in the AST, does this represent
  // the start of an expect expression?
  // $FlowIgnore[value-as-type]
  var isAnExpect = function isAnExpect(node) {
    if (!isFunctionCall(node)) {
      return false;
    }
    var name = '';
    var element = node && node.expression ? node.expression.callee : undefined;
    while (!name && element) {
      // eslint-disable-next-line prefer-destructuring
      name = element.name;
      // Because expect may have accessors tacked on (.to.be) or nothing
      // (expect()) we have to check multiple levels for the name
      element = element.object || element.callee;
    }
    return name === 'expect';
  };
  var addNode = function addNode(type, parent, babylonNode, lastProperty) {
    var child = parent.addChild(type);
    updateNode(child, babylonNode, lastProperty);
    if (child instanceof _parser_nodes.NamedBlock && child.name == null) {
      // eslint-disable-next-line no-console
      console.warn("block is missing name: ".concat(JSON.stringify(babylonNode)));
    }
    return child;
  };

  // A recursive AST parser
  // $FlowIgnore[value-as-type]
  var searchNodes = function searchNodes(babylonParent, parent) {
    // Look through the node's children
    var child;
    if (!babylonParent.body || !Array.isArray(babylonParent.body)) {
      return;
    }
    babylonParent.body.forEach(function (element) {
      var _element$argument;
      child = undefined;
      // Pull out the node
      // const element = babylonParent.body[node];

      var _getNameForNode = getNameForNode(element),
        _getNameForNode2 = _slicedToArray(_getNameForNode, 2),
        name = _getNameForNode2[0],
        lastProperty = _getNameForNode2[1];
      if (isAnDescribe(name)) {
        child = addNode('describe', parent, element, lastProperty);
      } else if (isAnIt(name)) {
        child = addNode('it', parent, element, lastProperty);
      } else if (isAnExpect(element)) {
        child = addNode('expect', parent, element);
      } else if (element && element.type === 'VariableDeclaration') {
        element.declarations.filter(function (declaration) {
          return declaration.init && isFunctionDeclaration(declaration.init.type);
        }).forEach(function (declaration) {
          return searchNodes(declaration.init.body, parent);
        });
      } else if (element && element.type === 'ExpressionStatement' && element.expression && element.expression.type === 'AssignmentExpression' && element.expression.right && isFunctionDeclaration(element.expression.right.type)) {
        searchNodes(element.expression.right.body, parent);
      } else if (element.type === 'ReturnStatement' && (_element$argument = element.argument) !== null && _element$argument !== void 0 && _element$argument.arguments) {
        element.argument.arguments.filter(function (argument) {
          return isFunctionDeclaration(argument.type);
        }).forEach(function (argument) {
          return searchNodes(argument.body, parent);
        });
      }
      if (isFunctionCall(element)) {
        element.expression.arguments.filter(function (argument) {
          return isFunctionDeclaration(argument.type);
        }).forEach(function (argument) {
          return searchNodes(argument.body, child || parent);
        });
      }
    });
  };
  var program = ast.program;
  searchNodes(program, parseResult.root);
  return parseResult;
};
exports.parse = parse;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZ2V0QVNUZm9yIiwiZmlsZSIsImRhdGEiLCJvcHRpb25zIiwiX2RhdGEiLCJyZWFkRmlsZVN5bmMiLCJ0b1N0cmluZyIsImNvbmZpZyIsInNvdXJjZVR5cGUiLCJwYXJzZXIiLCJwYXJzZSIsImdldEFTVGZvciIsInBhcnNlT3B0aW9ucyIsImJGaWxlIiwicGFyc2VSZXN1bHQiLCJQYXJzZVJlc3VsdCIsImFzdCIsImRlZXBHZXQiLCJub2RlIiwidHlwZXMiLCJyZWR1Y2UiLCJyb290Rm9yVHlwZSIsInR5cGUiLCJ1cGRhdGVOYW1lSW5mbyIsIm5CbG9jayIsImJOb2RlIiwibGFzdFByb3BlcnR5IiwiYXJnIiwiZXhwcmVzc2lvbiIsImFyZ3VtZW50cyIsIm5hbWUiLCJ2YWx1ZSIsInN1YnN0cmluZyIsInN0YXJ0IiwiZW5kIiwibmFtZVR5cGUiLCJuYW1lUmFuZ2UiLCJQYXJzZWRSYW5nZSIsImxvYyIsImxpbmUiLCJjb2x1bW4iLCJ1cGRhdGVOb2RlIiwiYmFieWxvbk5vZGUiLCJhZGROb2RlIiwiTmFtZWRCbG9jayIsImlzRnVuY3Rpb25DYWxsIiwiaXNGdW5jdGlvbkRlY2xhcmF0aW9uIiwibm9kZVR5cGUiLCJnZXROYW1lRm9yTm9kZSIsImNhbGxlZSIsInJvb3RDYWxsZWUiLCJwcm9wZXJ0eSIsImlzQW5JdCIsImlzQW5EZXNjcmliZSIsImlzQW5FeHBlY3QiLCJlbGVtZW50IiwidW5kZWZpbmVkIiwib2JqZWN0IiwicGFyZW50IiwiY2hpbGQiLCJhZGRDaGlsZCIsImNvbnNvbGUiLCJ3YXJuIiwiSlNPTiIsInN0cmluZ2lmeSIsInNlYXJjaE5vZGVzIiwiYmFieWxvblBhcmVudCIsImJvZHkiLCJBcnJheSIsImlzQXJyYXkiLCJmb3JFYWNoIiwiZGVjbGFyYXRpb25zIiwiZmlsdGVyIiwiZGVjbGFyYXRpb24iLCJpbml0IiwicmlnaHQiLCJhcmd1bWVudCIsInByb2dyYW0iLCJyb290Il0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BhcnNlcnMvYmFiZWxfcGFyc2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVyc2NvcmUtZGFuZ2xlICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB7cmVhZEZpbGVTeW5jfSBmcm9tICdmcyc7XG5pbXBvcnQge0ZpbGUgYXMgQmFiZWxGaWxlLCBOb2RlIGFzIEJhYmVsTm9kZX0gZnJvbSAnQGJhYmVsL3R5cGVzJztcbmltcG9ydCAqIGFzIHBhcnNlciBmcm9tICdAYmFiZWwvcGFyc2VyJztcbmltcG9ydCB0eXBlIHtQYXJzZWROb2RlVHlwZX0gZnJvbSAnLi9wYXJzZXJfbm9kZXMnO1xuaW1wb3J0IHtOYW1lZEJsb2NrLCBQYXJzZWRSYW5nZSwgUGFyc2VSZXN1bHQsIFBhcnNlZE5vZGV9IGZyb20gJy4vcGFyc2VyX25vZGVzJztcbmltcG9ydCB7cGFyc2VPcHRpb25zLCBKRVNQYXJzZXJPcHRpb25zfSBmcm9tICcuL2hlbHBlcic7XG5cbi8vICRGbG93SWdub3JlW3ZhbHVlLWFzLXR5cGVdXG5jb25zdCBfZ2V0QVNUZm9yID0gKGZpbGU6IHN0cmluZywgZGF0YTogP3N0cmluZywgb3B0aW9uczogP3BhcnNlci5QYXJzZXJPcHRpb25zKTogW0JhYmVsRmlsZSwgc3RyaW5nXSA9PiB7XG4gIGNvbnN0IF9kYXRhID0gZGF0YSB8fCByZWFkRmlsZVN5bmMoZmlsZSkudG9TdHJpbmcoKTtcbiAgY29uc3QgY29uZmlnID0gey4uLm9wdGlvbnMsIHNvdXJjZVR5cGU6ICdtb2R1bGUnfTtcbiAgcmV0dXJuIFtwYXJzZXIucGFyc2UoX2RhdGEsIGNvbmZpZyksIF9kYXRhXTtcbn07XG5cbi8vICRGbG93SWdub3JlW3ZhbHVlLWFzLXR5cGVdXG5leHBvcnQgY29uc3QgZ2V0QVNUZm9yID0gKGZpbGU6IHN0cmluZywgZGF0YTogP3N0cmluZywgb3B0aW9uczogP0pFU1BhcnNlck9wdGlvbnMpOiBCYWJlbEZpbGUgPT4ge1xuICBjb25zdCBbYkZpbGVdID0gX2dldEFTVGZvcihmaWxlLCBkYXRhLCBwYXJzZU9wdGlvbnMoZmlsZSwgb3B0aW9ucykpO1xuICByZXR1cm4gYkZpbGU7XG59O1xuXG4vLyAkRmxvd0lnbm9yZVt2YWx1ZS1hcy10eXBlXVxuZXhwb3J0IGNvbnN0IHBhcnNlID0gKGZpbGU6IHN0cmluZywgZGF0YTogP3N0cmluZywgb3B0aW9uczogP3BhcnNlci5QYXJzZXJPcHRpb25zKTogUGFyc2VSZXN1bHQgPT4ge1xuICBjb25zdCBwYXJzZVJlc3VsdCA9IG5ldyBQYXJzZVJlc3VsdChmaWxlKTtcbiAgY29uc3QgW2FzdCwgX2RhdGFdID0gX2dldEFTVGZvcihmaWxlLCBkYXRhLCBvcHRpb25zKTtcblxuICAvLyAkRmxvd0lnbm9yZVt2YWx1ZS1hcy10eXBlXVxuICBjb25zdCBkZWVwR2V0ID0gKG5vZGU6IEJhYmVsTm9kZSwgLi4udHlwZXM6IHN0cmluZ1tdKSA9PlxuICAgIC8vICRGbG93SWdub3JlW3ZhbHVlLWFzLXR5cGVdXG4gICAgdHlwZXMucmVkdWNlPEJhYmVsTm9kZT4oKHJvb3RGb3JUeXBlLCB0eXBlKSA9PiB7XG4gICAgICB3aGlsZSAocm9vdEZvclR5cGVbdHlwZV0pIHtcbiAgICAgICAgcm9vdEZvclR5cGUgPSByb290Rm9yVHlwZVt0eXBlXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByb290Rm9yVHlwZTtcbiAgICB9LCBub2RlKTtcblxuICAvLyAkRmxvd0lnbm9yZVt2YWx1ZS1hcy10eXBlXVxuICBjb25zdCB1cGRhdGVOYW1lSW5mbyA9IChuQmxvY2s6IE5hbWVkQmxvY2ssIGJOb2RlOiBCYWJlbE5vZGUsIGxhc3RQcm9wZXJ0eT86IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IGFyZyA9IGJOb2RlLmV4cHJlc3Npb24uYXJndW1lbnRzWzBdO1xuICAgIGxldCBuYW1lID0gYXJnLnZhbHVlO1xuXG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICBzd2l0Y2ggKGFyZy50eXBlKSB7XG4gICAgICAgIGNhc2UgJ1RlbXBsYXRlTGl0ZXJhbCc6XG4gICAgICAgICAgbmFtZSA9IF9kYXRhLnN1YnN0cmluZyhhcmcuc3RhcnQgKyAxLCBhcmcuZW5kIC0gMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgbmFtZSA9IF9kYXRhLnN1YnN0cmluZyhhcmcuc3RhcnQsIGFyZy5lbmQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5CbG9jay5uYW1lID0gbmFtZTtcbiAgICBuQmxvY2submFtZVR5cGUgPSBhcmcudHlwZTtcbiAgICBuQmxvY2subGFzdFByb3BlcnR5ID0gbGFzdFByb3BlcnR5O1xuICAgIG5CbG9jay5uYW1lUmFuZ2UgPSBuZXcgUGFyc2VkUmFuZ2UoXG4gICAgICBhcmcubG9jLnN0YXJ0LmxpbmUsXG4gICAgICBhcmcubG9jLnN0YXJ0LmNvbHVtbiArIDIsXG4gICAgICBhcmcubG9jLmVuZC5saW5lLFxuICAgICAgYXJnLmxvYy5lbmQuY29sdW1uIC0gMVxuICAgICk7XG4gIH07XG5cbiAgLy8gJEZsb3dJZ25vcmVbdmFsdWUtYXMtdHlwZV1cbiAgY29uc3QgdXBkYXRlTm9kZSA9IChub2RlOiBQYXJzZWROb2RlLCBiYWJ5bG9uTm9kZTogQmFiZWxOb2RlLCBsYXN0UHJvcGVydHk/OiBzdHJpbmcpID0+IHtcbiAgICBub2RlLnN0YXJ0ID0gYmFieWxvbk5vZGUubG9jLnN0YXJ0O1xuICAgIG5vZGUuZW5kID0gYmFieWxvbk5vZGUubG9jLmVuZDtcbiAgICBub2RlLnN0YXJ0LmNvbHVtbiArPSAxO1xuXG4gICAgcGFyc2VSZXN1bHQuYWRkTm9kZShub2RlKTtcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIE5hbWVkQmxvY2spIHtcbiAgICAgIHVwZGF0ZU5hbWVJbmZvKG5vZGUsIGJhYnlsb25Ob2RlLCBsYXN0UHJvcGVydHkpO1xuICAgIH1cbiAgfTtcblxuICAvLyAkRmxvd0lnbm9yZVt2YWx1ZS1hcy10eXBlXVxuICBjb25zdCBpc0Z1bmN0aW9uQ2FsbCA9IChub2RlOiBCYWJlbE5vZGUpID0+XG4gICAgbm9kZSAmJiBub2RlLnR5cGUgPT09ICdFeHByZXNzaW9uU3RhdGVtZW50JyAmJiBub2RlLmV4cHJlc3Npb24gJiYgbm9kZS5leHByZXNzaW9uLnR5cGUgPT09ICdDYWxsRXhwcmVzc2lvbic7XG5cbiAgY29uc3QgaXNGdW5jdGlvbkRlY2xhcmF0aW9uID0gKG5vZGVUeXBlOiBzdHJpbmcpID0+XG4gICAgbm9kZVR5cGUgPT09ICdBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbicgfHwgbm9kZVR5cGUgPT09ICdGdW5jdGlvbkV4cHJlc3Npb24nO1xuXG4gIC8vIFB1bGwgb3V0IHRoZSBuYW1lIG9mIGEgQ2FsbEV4cHJlc3Npb24gKGRlc2NyaWJlL2l0KSBhbmQgdGhlIGxhc3QgcHJvcGVydHkgKGVhY2gsIHNraXAgZXRjKVxuICBjb25zdCBnZXROYW1lRm9yTm9kZSA9IChub2RlOiBhbnkpID0+IHtcbiAgICBpZiAoaXNGdW5jdGlvbkNhbGwobm9kZSkgJiYgbm9kZS5leHByZXNzaW9uLmNhbGxlZSkge1xuICAgICAgLy8gR2V0IHJvb3QgY2FsbGVlIGluIGNhc2UgaXQncyBhIGNoYWluIG9mIGhpZ2hlci1vcmRlciBmdW5jdGlvbnMgKGUuZy4gLmVhY2godGFibGUpKG5hbWUsIGZuKSlcbiAgICAgIGNvbnN0IHJvb3RDYWxsZWUgPSBkZWVwR2V0KG5vZGUuZXhwcmVzc2lvbiwgJ2NhbGxlZScpO1xuICAgICAgY29uc3QgcHJvcGVydHkgPSByb290Q2FsbGVlLnByb3BlcnR5Py5uYW1lIHx8IGRlZXBHZXQocm9vdENhbGxlZSwgJ3RhZycpLnByb3BlcnR5Py5uYW1lO1xuICAgICAgY29uc3QgbmFtZSA9XG4gICAgICAgIHJvb3RDYWxsZWUubmFtZSB8fFxuICAgICAgICAvLyBoYW5kbGUgY2FzZXMgd2hlcmUgaXQncyBhIG1lbWJlciBleHByZXNzaW9uIChlLmcgLm9ubHkgb3IgLmNvbmN1cnJlbnQub25seSlcbiAgICAgICAgZGVlcEdldChyb290Q2FsbGVlLCAnb2JqZWN0JykubmFtZSB8fFxuICAgICAgICAvLyBoYW5kbGUgY2FzZXMgd2hlcmUgaXQncyBwYXJ0IG9mIGEgdGFnIChlLmcuIC5lYWNoYHRhYmxlYClcbiAgICAgICAgZGVlcEdldChyb290Q2FsbGVlLCAndGFnJywgJ29iamVjdCcpLm5hbWU7XG5cbiAgICAgIHJldHVybiBbbmFtZSwgcHJvcGVydHldO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH07XG5cbiAgLy8gV2hlbiBnaXZlbiBhIG5vZGUgaW4gdGhlIEFTVCwgZG9lcyB0aGlzIHJlcHJlc2VudFxuICAvLyB0aGUgc3RhcnQgb2YgYW4gaXQvdGVzdCBibG9jaz9cbiAgY29uc3QgaXNBbkl0ID0gKG5hbWU/OiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gbmFtZSA9PT0gJ2l0JyB8fCBuYW1lID09PSAnZml0JyB8fCBuYW1lID09PSAndGVzdCc7XG4gIH07XG5cbiAgY29uc3QgaXNBbkRlc2NyaWJlID0gKG5hbWU/OiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gbmFtZSA9PT0gJ2Rlc2NyaWJlJztcbiAgfTtcblxuICAvLyBXaGVuIGdpdmVuIGEgbm9kZSBpbiB0aGUgQVNULCBkb2VzIHRoaXMgcmVwcmVzZW50XG4gIC8vIHRoZSBzdGFydCBvZiBhbiBleHBlY3QgZXhwcmVzc2lvbj9cbiAgLy8gJEZsb3dJZ25vcmVbdmFsdWUtYXMtdHlwZV1cbiAgY29uc3QgaXNBbkV4cGVjdCA9IChub2RlOiBCYWJlbE5vZGUpID0+IHtcbiAgICBpZiAoIWlzRnVuY3Rpb25DYWxsKG5vZGUpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGxldCBuYW1lID0gJyc7XG4gICAgbGV0IGVsZW1lbnQgPSBub2RlICYmIG5vZGUuZXhwcmVzc2lvbiA/IG5vZGUuZXhwcmVzc2lvbi5jYWxsZWUgOiB1bmRlZmluZWQ7XG4gICAgd2hpbGUgKCFuYW1lICYmIGVsZW1lbnQpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBwcmVmZXItZGVzdHJ1Y3R1cmluZ1xuICAgICAgbmFtZSA9IGVsZW1lbnQubmFtZTtcbiAgICAgIC8vIEJlY2F1c2UgZXhwZWN0IG1heSBoYXZlIGFjY2Vzc29ycyB0YWNrZWQgb24gKC50by5iZSkgb3Igbm90aGluZ1xuICAgICAgLy8gKGV4cGVjdCgpKSB3ZSBoYXZlIHRvIGNoZWNrIG11bHRpcGxlIGxldmVscyBmb3IgdGhlIG5hbWVcbiAgICAgIGVsZW1lbnQgPSBlbGVtZW50Lm9iamVjdCB8fCBlbGVtZW50LmNhbGxlZTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWUgPT09ICdleHBlY3QnO1xuICB9O1xuXG4gIGNvbnN0IGFkZE5vZGUgPSAoXG4gICAgdHlwZTogUGFyc2VkTm9kZVR5cGUsXG4gICAgcGFyZW50OiBQYXJzZWROb2RlLFxuICAgIC8vICRGbG93SWdub3JlW3ZhbHVlLWFzLXR5cGVdXG4gICAgYmFieWxvbk5vZGU6IEJhYmVsTm9kZSxcbiAgICBsYXN0UHJvcGVydHk/OiBzdHJpbmdcbiAgKTogUGFyc2VkTm9kZSA9PiB7XG4gICAgY29uc3QgY2hpbGQgPSBwYXJlbnQuYWRkQ2hpbGQodHlwZSk7XG4gICAgdXBkYXRlTm9kZShjaGlsZCwgYmFieWxvbk5vZGUsIGxhc3RQcm9wZXJ0eSk7XG5cbiAgICBpZiAoY2hpbGQgaW5zdGFuY2VvZiBOYW1lZEJsb2NrICYmIGNoaWxkLm5hbWUgPT0gbnVsbCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUud2FybihgYmxvY2sgaXMgbWlzc2luZyBuYW1lOiAke0pTT04uc3RyaW5naWZ5KGJhYnlsb25Ob2RlKX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGNoaWxkO1xuICB9O1xuXG4gIC8vIEEgcmVjdXJzaXZlIEFTVCBwYXJzZXJcbiAgLy8gJEZsb3dJZ25vcmVbdmFsdWUtYXMtdHlwZV1cbiAgY29uc3Qgc2VhcmNoTm9kZXMgPSAoYmFieWxvblBhcmVudDogQmFiZWxOb2RlLCBwYXJlbnQ6IFBhcnNlZE5vZGUpID0+IHtcbiAgICAvLyBMb29rIHRocm91Z2ggdGhlIG5vZGUncyBjaGlsZHJlblxuICAgIGxldCBjaGlsZDogP1BhcnNlZE5vZGU7XG5cbiAgICBpZiAoIWJhYnlsb25QYXJlbnQuYm9keSB8fCAhQXJyYXkuaXNBcnJheShiYWJ5bG9uUGFyZW50LmJvZHkpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYmFieWxvblBhcmVudC5ib2R5LmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGNoaWxkID0gdW5kZWZpbmVkO1xuICAgICAgLy8gUHVsbCBvdXQgdGhlIG5vZGVcbiAgICAgIC8vIGNvbnN0IGVsZW1lbnQgPSBiYWJ5bG9uUGFyZW50LmJvZHlbbm9kZV07XG5cbiAgICAgIGNvbnN0IFtuYW1lLCBsYXN0UHJvcGVydHldID0gZ2V0TmFtZUZvck5vZGUoZWxlbWVudCk7XG4gICAgICBpZiAoaXNBbkRlc2NyaWJlKG5hbWUpKSB7XG4gICAgICAgIGNoaWxkID0gYWRkTm9kZSgnZGVzY3JpYmUnLCBwYXJlbnQsIGVsZW1lbnQsIGxhc3RQcm9wZXJ0eSk7XG4gICAgICB9IGVsc2UgaWYgKGlzQW5JdChuYW1lKSkge1xuICAgICAgICBjaGlsZCA9IGFkZE5vZGUoJ2l0JywgcGFyZW50LCBlbGVtZW50LCBsYXN0UHJvcGVydHkpO1xuICAgICAgfSBlbHNlIGlmIChpc0FuRXhwZWN0KGVsZW1lbnQpKSB7XG4gICAgICAgIGNoaWxkID0gYWRkTm9kZSgnZXhwZWN0JywgcGFyZW50LCBlbGVtZW50KTtcbiAgICAgIH0gZWxzZSBpZiAoZWxlbWVudCAmJiBlbGVtZW50LnR5cGUgPT09ICdWYXJpYWJsZURlY2xhcmF0aW9uJykge1xuICAgICAgICBlbGVtZW50LmRlY2xhcmF0aW9uc1xuICAgICAgICAgIC5maWx0ZXIoKGRlY2xhcmF0aW9uKSA9PiBkZWNsYXJhdGlvbi5pbml0ICYmIGlzRnVuY3Rpb25EZWNsYXJhdGlvbihkZWNsYXJhdGlvbi5pbml0LnR5cGUpKVxuICAgICAgICAgIC5mb3JFYWNoKChkZWNsYXJhdGlvbikgPT4gc2VhcmNoTm9kZXMoZGVjbGFyYXRpb24uaW5pdC5ib2R5LCBwYXJlbnQpKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGVsZW1lbnQgJiZcbiAgICAgICAgZWxlbWVudC50eXBlID09PSAnRXhwcmVzc2lvblN0YXRlbWVudCcgJiZcbiAgICAgICAgZWxlbWVudC5leHByZXNzaW9uICYmXG4gICAgICAgIGVsZW1lbnQuZXhwcmVzc2lvbi50eXBlID09PSAnQXNzaWdubWVudEV4cHJlc3Npb24nICYmXG4gICAgICAgIGVsZW1lbnQuZXhwcmVzc2lvbi5yaWdodCAmJlxuICAgICAgICBpc0Z1bmN0aW9uRGVjbGFyYXRpb24oZWxlbWVudC5leHByZXNzaW9uLnJpZ2h0LnR5cGUpXG4gICAgICApIHtcbiAgICAgICAgc2VhcmNoTm9kZXMoZWxlbWVudC5leHByZXNzaW9uLnJpZ2h0LmJvZHksIHBhcmVudCk7XG4gICAgICB9IGVsc2UgaWYgKGVsZW1lbnQudHlwZSA9PT0gJ1JldHVyblN0YXRlbWVudCcgJiYgZWxlbWVudC5hcmd1bWVudD8uYXJndW1lbnRzKSB7XG4gICAgICAgIGVsZW1lbnQuYXJndW1lbnQuYXJndW1lbnRzXG4gICAgICAgICAgLmZpbHRlcigoYXJndW1lbnQpID0+IGlzRnVuY3Rpb25EZWNsYXJhdGlvbihhcmd1bWVudC50eXBlKSlcbiAgICAgICAgICAuZm9yRWFjaCgoYXJndW1lbnQpID0+IHNlYXJjaE5vZGVzKGFyZ3VtZW50LmJvZHksIHBhcmVudCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNGdW5jdGlvbkNhbGwoZWxlbWVudCkpIHtcbiAgICAgICAgZWxlbWVudC5leHByZXNzaW9uLmFyZ3VtZW50c1xuICAgICAgICAgIC5maWx0ZXIoKGFyZ3VtZW50KSA9PiBpc0Z1bmN0aW9uRGVjbGFyYXRpb24oYXJndW1lbnQudHlwZSkpXG4gICAgICAgICAgLmZvckVhY2goKGFyZ3VtZW50KSA9PiBzZWFyY2hOb2Rlcyhhcmd1bWVudC5ib2R5LCBjaGlsZCB8fCBwYXJlbnQpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCB7cHJvZ3JhbX0gPSBhc3Q7XG4gIHNlYXJjaE5vZGVzKHByb2dyYW0sIHBhcnNlUmVzdWx0LnJvb3QpO1xuXG4gIHJldHVybiBwYXJzZVJlc3VsdDtcbn07XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFXQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQXdEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRXhEO0FBQ0EsSUFBTUEsVUFBVSxHQUFHLFNBQWJBLFVBQVUsQ0FBSUMsSUFBWSxFQUFFQyxJQUFhLEVBQUVDLE9BQThCLEVBQTBCO0VBQ3ZHLElBQU1DLEtBQUssR0FBR0YsSUFBSSxJQUFJLElBQUFHLGdCQUFZLEVBQUNKLElBQUksQ0FBQyxDQUFDSyxRQUFRLEVBQUU7RUFDbkQsSUFBTUMsTUFBTSxtQ0FBT0osT0FBTztJQUFFSyxVQUFVLEVBQUU7RUFBUSxFQUFDO0VBQ2pELE9BQU8sQ0FBQ0MsTUFBTSxDQUFDQyxLQUFLLENBQUNOLEtBQUssRUFBRUcsTUFBTSxDQUFDLEVBQUVILEtBQUssQ0FBQztBQUM3QyxDQUFDOztBQUVEO0FBQ08sSUFBTU8sU0FBUyxHQUFHLFNBQVpBLFNBQVMsQ0FBSVYsSUFBWSxFQUFFQyxJ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