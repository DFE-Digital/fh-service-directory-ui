"use strict";

require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.symbol.async-iterator.js");
require("core-js/modules/es.symbol.to-string-tag.js");
require("core-js/modules/es.json.to-string-tag.js");
require("core-js/modules/es.math.to-string-tag.js");
require("core-js/modules/es.object.get-prototype-of.js");
require("core-js/modules/es.object.set-prototype-of.js");
require("core-js/modules/es.array.reverse.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.array.is-array.js");
require("core-js/modules/es.array.from.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
require("core-js/modules/es.object.assign.js");
require("core-js/modules/es.object.create.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.array.join.js");
require("core-js/modules/es.array.map.js");
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.array.index-of.js");
require("core-js/modules/es.array.filter.js");
require("core-js/modules/es.array.for-each.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.object.entries.js");
require("core-js/modules/es.regexp.exec.js");
var _traverse = _interopRequireDefault(require("@babel/traverse"));
var _jestSnapshot = require("jest-snapshot");
var _babel_parser = require("./parsers/babel_parser");
var _parsers = require("./parsers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0) { ; } } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var describeVariants = Object.assign(Object.create(null), {
  describe: true,
  fdescribe: true,
  xdescribe: true
});
var base = Object.assign(Object.create(null), {
  describe: true,
  it: true,
  test: true
});
var decorators = Object.assign(Object.create(null), {
  only: true,
  skip: true
});
var validParents = Object.assign(Object.create(null), base, describeVariants, Object.assign(Object.create(null), {
  fit: true,
  xit: true,
  xtest: true
}));
var isValidMemberExpression = function isValidMemberExpression(node) {
  return node.object && base[node.object.name] && node.property && decorators[node.property.name];
};
var isDescribe = function isDescribe(node) {
  return describeVariants[node.name] || isValidMemberExpression(node) && node.object.name === 'describe';
};
var isValidParent = function isValidParent(parent) {
  return parent.callee && (validParents[parent.callee.name] || isValidMemberExpression(parent.callee));
};
var getArrayOfParents = function getArrayOfParents(path) {
  var result = [];
  var parent = path.parentPath;
  while (parent) {
    result.unshift(parent.node);
    parent = parent.parentPath;
  }
  return result;
};
var buildName = function buildName(snapshotNode, parents, position) {
  var fullName = parents.map(function (parent) {
    return parent.arguments[0].value;
  }).join(' ');
  return _jestSnapshot.utils.testNameToKey(fullName, position);
};
var Snapshot = /*#__PURE__*/function () {
  // $FlowIgnore[value-as-type]

  // $FlowIgnore[value-as-type]

  function Snapshot(parser, customMatchers, projectConfig) {
    var _this = this;
    _classCallCheck(this, Snapshot);
    this._parser = parser || _babel_parser.getASTfor;
    this._matchers = ['toMatchSnapshot', 'toThrowErrorMatchingSnapshot'].concat(customMatchers || []);
    this._projectConfig = projectConfig;
    this._resolverPromise = (0, _jestSnapshot.buildSnapshotResolver)(this._projectConfig || {}, function () {
      return Promise.resolve();
    }).then(function (resolver) {
      _this.snapshotResolver = resolver;
    });
  }
  _createClass(Snapshot, [{
    key: "parse",
    value: function parse(filePath, options) {
      var _this2 = this;
      var fileNode;
      try {
        fileNode = this._parser(filePath, undefined, options === null || options === void 0 ? void 0 : options.parserOptions);
      } catch (error) {
        if (options !== null && options !== void 0 && options.verbose) {
          // eslint-disable-next-line no-console
          console.warn(error);
        }
        return [];
      }
      var Visitors = {
        Identifier: function Identifier(path, found, matchers) {
          if (matchers.indexOf(path.node.name) >= 0) {
            found.push({
              node: path.node,
              parents: getArrayOfParents(path)
            });
          }
        }
      };
      var found = [];
      (0, _traverse["default"])(fileNode, {
        enter: function enter(path) {
          var visitor = Visitors[path.node.type];
          if (visitor != null) {
            visitor(path, found, _this2._matchers);
          }
        }
      });
      return found.map(function (f) {
        return {
          node: f.node,
          parents: f.parents.filter(isValidParent)
        };
      });
    }

    // $FlowIgnore[value-as-type]
  }, {
    key: "_getSnapshotResolver",
    value: function () {
      var _getSnapshotResolver2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.snapshotResolver) {
                  _context.next = 3;
                  break;
                }
                _context.next = 3;
                return this._resolverPromise;
              case 3:
                return _context.abrupt("return", this.snapshotResolver);
              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));
      function _getSnapshotResolver() {
        return _getSnapshotResolver2.apply(this, arguments);
      }
      return _getSnapshotResolver;
    }()
    /**
     * look for snapshot content for the given test.
     * @param {*} filePath
     * @param {*} name can be a literal string or a regex pattern.
     * @returns the content of the snapshot, if exist. If name is a string, a string will be returned. If name is a RegExp,
     * a SnapshotData object will be returned with all matched snapshots. If nothing matched, null will be returned.
     * @throws throws exception if the snapshot version mismatched or any other unexpected error.
     */
    // $FlowIgnore[value-as-type]
  }, {
    key: "getSnapshotContent",
    value: function () {
      var _getSnapshotContent = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(filePath, name) {
        var snapshotResolver, snapshotPath, snapshots, regex, data;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this._getSnapshotResolver();
              case 2:
                snapshotResolver = _context2.sent;
                snapshotPath = snapshotResolver.resolveSnapshotPath(filePath);
                snapshots = _jestSnapshot.utils.getSnapshotData(snapshotPath, 'none').data;
                if (!(typeof name === 'string')) {
                  _context2.next = 7;
                  break;
                }
                return _context2.abrupt("return", snapshots[name]);
              case 7:
                regex = name; // $FlowIgnore[value-as-type]
                data = {};
                Object.entries(snapshots).forEach(function (_ref) {
                  var _ref2 = _slicedToArray(_ref, 2),
                    key = _ref2[0],
                    value = _ref2[1];
                  if (regex.test(key)) {
                    data[key] = value;
                  }
                });
                return _context2.abrupt("return", Object.entries(data).length > 0 ? data : null);
              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));
      function getSnapshotContent(_x, _x2) {
        return _getSnapshotContent.apply(this, arguments);
      }
      return getSnapshotContent;
    }()
  }, {
    key: "getMetadataAsync",
    value: function () {
      var _getMetadataAsync = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(filePath, options) {
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._getSnapshotResolver();
              case 2:
                return _context3.abrupt("return", this.getMetadata(filePath, options));
              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));
      function getMetadataAsync(_x3, _x4) {
        return _getMetadataAsync.apply(this, arguments);
      }
      return getMetadataAsync;
    }()
  }, {
    key: "getMetadata",
    value: function getMetadata(filePath, options) {
      if (!this.snapshotResolver) {
        throw new Error('snapshotResolver is not ready yet, consider migrating to "getMetadataAsync" instead');
      }
      var snapshotPath = this.snapshotResolver.resolveSnapshotPath(filePath);
      var snapshotNodes = this.parse(filePath, options);
      var snapshots = _jestSnapshot.utils.getSnapshotData(snapshotPath, 'none').data;
      var lastParent = null;
      var count = 1;
      return snapshotNodes.map(function (snapshotNode) {
        var parents = snapshotNode.parents;
        var innerAssertion = parents[parents.length - 1];
        if (lastParent !== innerAssertion) {
          lastParent = innerAssertion;
          count = 1;
        }
        var result = {
          content: undefined,
          count: count,
          exists: false,
          name: '',
          node: snapshotNode.node
        };
        count += 1;
        if (!innerAssertion || isDescribe(innerAssertion.callee)) {
          // An expectation inside describe never gets executed.
          return result;
        }
        result.name = buildName(snapshotNode, parents, result.count);
        if (snapshots[result.name]) {
          result.exists = true;
          result.content = snapshots[result.name];
        }
        return result;
      });
    }
  }]);
  return Snapshot;
}();
exports["default"] = Snapshot;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJkZXNjcmliZVZhcmlhbnRzIiwiT2JqZWN0IiwiYXNzaWduIiwiY3JlYXRlIiwiZGVzY3JpYmUiLCJmZGVzY3JpYmUiLCJ4ZGVzY3JpYmUiLCJiYXNlIiwiaXQiLCJ0ZXN0IiwiZGVjb3JhdG9ycyIsIm9ubHkiLCJza2lwIiwidmFsaWRQYXJlbnRzIiwiZml0IiwieGl0IiwieHRlc3QiLCJpc1ZhbGlkTWVtYmVyRXhwcmVzc2lvbiIsIm5vZGUiLCJvYmplY3QiLCJuYW1lIiwicHJvcGVydHkiLCJpc0Rlc2NyaWJlIiwiaXNWYWxpZFBhcmVudCIsInBhcmVudCIsImNhbGxlZSIsImdldEFycmF5T2ZQYXJlbnRzIiwicGF0aCIsInJlc3VsdCIsInBhcmVudFBhdGgiLCJ1bnNoaWZ0IiwiYnVpbGROYW1lIiwic25hcHNob3ROb2RlIiwicGFyZW50cyIsInBvc2l0aW9uIiwiZnVsbE5hbWUiLCJtYXAiLCJhcmd1bWVudHMiLCJ2YWx1ZSIsImpvaW4iLCJ1dGlscyIsInRlc3ROYW1lVG9LZXkiLCJTbmFwc2hvdCIsInBhcnNlciIsImN1c3RvbU1hdGNoZXJzIiwicHJvamVjdENvbmZpZyIsIl9wYXJzZXIiLCJnZXRBU1Rmb3IiLCJfbWF0Y2hlcnMiLCJjb25jYXQiLCJfcHJvamVjdENvbmZpZyIsIl9yZXNvbHZlclByb21pc2UiLCJidWlsZFNuYXBzaG90UmVzb2x2ZXIiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRoZW4iLCJyZXNvbHZlciIsInNuYXBzaG90UmVzb2x2ZXIiLCJmaWxlUGF0aCIsIm9wdGlvbnMiLCJmaWxlTm9kZSIsInVuZGVmaW5lZCIsInBhcnNlck9wdGlvbnMiLCJlcnJvciIsInZlcmJvc2UiLCJjb25zb2xlIiwid2FybiIsIlZpc2l0b3JzIiwiSWRlbnRpZmllciIsImZvdW5kIiwibWF0Y2hlcnMiLCJpbmRleE9mIiwicHVzaCIsInRyYXZlcnNlIiwiZW50ZXIiLCJ2aXNpdG9yIiwidHlwZSIsImYiLCJmaWx0ZXIiLCJfZ2V0U25hcHNob3RSZXNvbHZlciIsInNuYXBzaG90UGF0aCIsInJlc29sdmVTbmFwc2hvdFBhdGgiLCJzbmFwc2hvdHMiLCJnZXRTbmFwc2hvdERhdGEiLCJkYXRhIiwicmVnZXgiLCJlbnRyaWVzIiwiZm9yRWFjaCIsImtleSIsImxlbmd0aCIsImdldE1ldGFkYXRhIiwiRXJyb3IiLCJzbmFwc2hvdE5vZGVzIiwicGFyc2UiLCJsYXN0UGFyZW50IiwiY291bnQiLCJpbm5lckFzc2VydGlvbiIsImNvbnRlbnQiLCJleGlzdHMiXSwic291cmNlcyI6WyIuLi9zcmMvU25hcHNob3QuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQGZsb3dcbiAqL1xuXG5pbXBvcnQgdHJhdmVyc2UgZnJvbSAnQGJhYmVsL3RyYXZlcnNlJztcbmltcG9ydCB0eXBlIHtTbmFwc2hvdFJlc29sdmVyLCBTbmFwc2hvdERhdGF9IGZyb20gJ2plc3Qtc25hcHNob3QnO1xuaW1wb3J0IHtidWlsZFNuYXBzaG90UmVzb2x2ZXIsIHV0aWxzfSBmcm9tICdqZXN0LXNuYXBzaG90JztcbmltcG9ydCB0eXBlIHtQcm9qZWN0Q29uZmlnfSBmcm9tICcuLi90eXBlcy9Db25maWcnO1xuXG5pbXBvcnQge2dldEFTVGZvcn0gZnJvbSAnLi9wYXJzZXJzL2JhYmVsX3BhcnNlcic7XG5pbXBvcnQge0pFU1BhcnNlck9wdGlvbnN9IGZyb20gJy4vcGFyc2Vycyc7XG5cbnR5cGUgTm9kZSA9IGFueTtcblxudHlwZSBTbmFwc2hvdE1ldGFkYXRhID0ge1xuICBleGlzdHM6IHRydWUgfCBmYWxzZSxcbiAgbmFtZTogc3RyaW5nLFxuICBub2RlOiBOb2RlLFxuICBjb250ZW50Pzogc3RyaW5nLFxufTtcblxuY29uc3QgZGVzY3JpYmVWYXJpYW50cyA9IE9iamVjdC5hc3NpZ24oKE9iamVjdC5jcmVhdGUobnVsbCk6IHtbc3RyaW5nXTogYm9vbGVhbiwgX19wcm90b19fOiBudWxsfSksIHtcbiAgZGVzY3JpYmU6IHRydWUsXG4gIGZkZXNjcmliZTogdHJ1ZSxcbiAgeGRlc2NyaWJlOiB0cnVlLFxufSk7XG5jb25zdCBiYXNlID0gT2JqZWN0LmFzc2lnbigoT2JqZWN0LmNyZWF0ZShudWxsKToge1tzdHJpbmddOiBib29sZWFuLCBfX3Byb3RvX186IG51bGx9KSwge1xuICBkZXNjcmliZTogdHJ1ZSxcbiAgaXQ6IHRydWUsXG4gIHRlc3Q6IHRydWUsXG59KTtcbmNvbnN0IGRlY29yYXRvcnMgPSBPYmplY3QuYXNzaWduKChPYmplY3QuY3JlYXRlKG51bGwpOiB7W3N0cmluZ106IGJvb2xlYW4sIF9fcHJvdG9fXzogbnVsbH0pLCB7XG4gIG9ubHk6IHRydWUsXG4gIHNraXA6IHRydWUsXG59KTtcblxuY29uc3QgdmFsaWRQYXJlbnRzID0gT2JqZWN0LmFzc2lnbihcbiAgKE9iamVjdC5jcmVhdGUobnVsbCk6IGFueSksXG4gIGJhc2UsXG4gIGRlc2NyaWJlVmFyaWFudHMsXG4gIE9iamVjdC5hc3NpZ24oKE9iamVjdC5jcmVhdGUobnVsbCk6IHtbc3RyaW5nXTogYm9vbGVhbiwgX19wcm90b19fOiBudWxsfSksIHtcbiAgICBmaXQ6IHRydWUsXG4gICAgeGl0OiB0cnVlLFxuICAgIHh0ZXN0OiB0cnVlLFxuICB9KVxuKTtcblxuY29uc3QgaXNWYWxpZE1lbWJlckV4cHJlc3Npb24gPSAobm9kZTogYW55KSA9PlxuICBub2RlLm9iamVjdCAmJiBiYXNlW25vZGUub2JqZWN0Lm5hbWVdICYmIG5vZGUucHJvcGVydHkgJiYgZGVjb3JhdG9yc1tub2RlLnByb3BlcnR5Lm5hbWVdO1xuXG5jb25zdCBpc0Rlc2NyaWJlID0gKG5vZGU6IGFueSkgPT5cbiAgZGVzY3JpYmVWYXJpYW50c1tub2RlLm5hbWVdIHx8IChpc1ZhbGlkTWVtYmVyRXhwcmVzc2lvbihub2RlKSAmJiBub2RlLm9iamVjdC5uYW1lID09PSAnZGVzY3JpYmUnKTtcblxuY29uc3QgaXNWYWxpZFBhcmVudCA9IChwYXJlbnQ6IGFueSkgPT5cbiAgcGFyZW50LmNhbGxlZSAmJiAodmFsaWRQYXJlbnRzW3BhcmVudC5jYWxsZWUubmFtZV0gfHwgaXNWYWxpZE1lbWJlckV4cHJlc3Npb24ocGFyZW50LmNhbGxlZSkpO1xuXG5jb25zdCBnZXRBcnJheU9mUGFyZW50cyA9IChwYXRoOiBhbnkpID0+IHtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGxldCBwYXJlbnQgPSBwYXRoLnBhcmVudFBhdGg7XG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICByZXN1bHQudW5zaGlmdChwYXJlbnQubm9kZSk7XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudFBhdGg7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmNvbnN0IGJ1aWxkTmFtZTogKHNuYXBzaG90Tm9kZTogTm9kZSwgcGFyZW50czogQXJyYXk8Tm9kZT4sIHBvc2l0aW9uOiBudW1iZXIpID0+IHN0cmluZyA9IChcbiAgc25hcHNob3ROb2RlLFxuICBwYXJlbnRzLFxuICBwb3NpdGlvblxuKSA9PiB7XG4gIGNvbnN0IGZ1bGxOYW1lID0gcGFyZW50cy5tYXAoKHBhcmVudCkgPT4gcGFyZW50LmFyZ3VtZW50c1swXS52YWx1ZSkuam9pbignICcpO1xuXG4gIHJldHVybiB1dGlscy50ZXN0TmFtZVRvS2V5KGZ1bGxOYW1lLCBwb3NpdGlvbik7XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFNuYXBzaG90Tm9kZSB7XG4gIG5vZGU6IE5vZGU7XG4gIHBhcmVudHM6IE5vZGVbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTbmFwc2hvdFBhcnNlck9wdGlvbnMge1xuICB2ZXJib3NlPzogYm9vbGVhbjtcbiAgLy8gJEZsb3dJZ25vcmVbdmFsdWUtYXMtdHlwZV1cbiAgcGFyc2VyT3B0aW9ucz86IEpFU1BhcnNlck9wdGlvbnM7XG59XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTbmFwc2hvdCB7XG4gIF9wYXJzZXI6IEZ1bmN0aW9uO1xuXG4gIF9tYXRjaGVyczogQXJyYXk8c3RyaW5nPjtcblxuICBfcHJvamVjdENvbmZpZzogP1Byb2plY3RDb25maWc7XG5cbiAgLy8gJEZsb3dJZ25vcmVbdmFsdWUtYXMtdHlwZV1cbiAgc25hcHNob3RSZXNvbHZlcjogP1NuYXBzaG90UmVzb2x2ZXI7XG5cbiAgLy8gJEZsb3dJZ25vcmVbdmFsdWUtYXMtdHlwZV1cbiAgX3Jlc29sdmVyUHJvbWlzZTogUHJvbWlzZTxTbmFwc2hvdFJlc29sdmVyPjtcblxuICBjb25zdHJ1Y3RvcihwYXJzZXI6IGFueSwgY3VzdG9tTWF0Y2hlcnM/OiBBcnJheTxzdHJpbmc+LCBwcm9qZWN0Q29uZmlnPzogUHJvamVjdENvbmZpZykge1xuICAgIHRoaXMuX3BhcnNlciA9IHBhcnNlciB8fCBnZXRBU1Rmb3I7XG4gICAgdGhpcy5fbWF0Y2hlcnMgPSBbJ3RvTWF0Y2hTbmFwc2hvdCcsICd0b1Rocm93RXJyb3JNYXRjaGluZ1NuYXBzaG90J10uY29uY2F0KGN1c3RvbU1hdGNoZXJzIHx8IFtdKTtcbiAgICB0aGlzLl9wcm9qZWN0Q29uZmlnID0gcHJvamVjdENvbmZpZztcbiAgICB0aGlzLl9yZXNvbHZlclByb21pc2UgPSBidWlsZFNuYXBzaG90UmVzb2x2ZXIodGhpcy5fcHJvamVjdENvbmZpZyB8fCB7fSwgKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCkpLnRoZW4oXG4gICAgICAocmVzb2x2ZXIpID0+IHtcbiAgICAgICAgdGhpcy5zbmFwc2hvdFJlc29sdmVyID0gcmVzb2x2ZXI7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIHBhcnNlKGZpbGVQYXRoOiBzdHJpbmcsIG9wdGlvbnM/OiBTbmFwc2hvdFBhcnNlck9wdGlvbnMpOiBTbmFwc2hvdE5vZGVbXSB7XG4gICAgbGV0IGZpbGVOb2RlO1xuICAgIHRyeSB7XG4gICAgICBmaWxlTm9kZSA9IHRoaXMuX3BhcnNlcihmaWxlUGF0aCwgdW5kZWZpbmVkLCBvcHRpb25zPy5wYXJzZXJPcHRpb25zKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKG9wdGlvbnM/LnZlcmJvc2UpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgY29uc29sZS53YXJuKGVycm9yKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBWaXNpdG9ycyA9IHtcbiAgICAgIElkZW50aWZpZXIocGF0aDogYW55LCBmb3VuZDogYW55LCBtYXRjaGVyczogYW55KSB7XG4gICAgICAgIGlmIChtYXRjaGVycy5pbmRleE9mKHBhdGgubm9kZS5uYW1lKSA+PSAwKSB7XG4gICAgICAgICAgZm91bmQucHVzaCh7XG4gICAgICAgICAgICBub2RlOiBwYXRoLm5vZGUsXG4gICAgICAgICAgICBwYXJlbnRzOiBnZXRBcnJheU9mUGFyZW50cyhwYXRoKSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgY29uc3QgZm91bmQgPSBbXTtcblxuICAgIHRyYXZlcnNlKGZpbGVOb2RlLCB7XG4gICAgICBlbnRlcjogKHBhdGgpID0+IHtcbiAgICAgICAgY29uc3QgdmlzaXRvciA9IFZpc2l0b3JzW3BhdGgubm9kZS50eXBlXTtcbiAgICAgICAgaWYgKHZpc2l0b3IgIT0gbnVsbCkge1xuICAgICAgICAgIHZpc2l0b3IocGF0aCwgZm91bmQsIHRoaXMuX21hdGNoZXJzKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiBmb3VuZC5tYXAoKGYpID0+ICh7XG4gICAgICBub2RlOiBmLm5vZGUsXG4gICAgICBwYXJlbnRzOiBmLnBhcmVudHMuZmlsdGVyKGlzVmFsaWRQYXJlbnQpLFxuICAgIH0pKTtcbiAgfVxuXG4gIC8vICRGbG93SWdub3JlW3ZhbHVlLWFzLXR5cGVdXG4gIGFzeW5jIF9nZXRTbmFwc2hvdFJlc29sdmVyKCk6IFByb21pc2U8U25hcHNob3RSZXNvbHZlcj4ge1xuICAgIGlmICghdGhpcy5zbmFwc2hvdFJlc29sdmVyKSB7XG4gICAgICBhd2FpdCB0aGlzLl9yZXNvbHZlclByb21pc2U7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnNuYXBzaG90UmVzb2x2ZXI7XG4gIH1cblxuICAvKipcbiAgICogbG9vayBmb3Igc25hcHNob3QgY29udGVudCBmb3IgdGhlIGdpdmVuIHRlc3QuXG4gICAqIEBwYXJhbSB7Kn0gZmlsZVBhdGhcbiAgICogQHBhcmFtIHsqfSBuYW1lIGNhbiBiZSBhIGxpdGVyYWwgc3RyaW5nIG9yIGEgcmVnZXggcGF0dGVybi5cbiAgICogQHJldHVybnMgdGhlIGNvbnRlbnQgb2YgdGhlIHNuYXBzaG90LCBpZiBleGlzdC4gSWYgbmFtZSBpcyBhIHN0cmluZywgYSBzdHJpbmcgd2lsbCBiZSByZXR1cm5lZC4gSWYgbmFtZSBpcyBhIFJlZ0V4cCxcbiAgICogYSBTbmFwc2hvdERhdGEgb2JqZWN0IHdpbGwgYmUgcmV0dXJuZWQgd2l0aCBhbGwgbWF0Y2hlZCBzbmFwc2hvdHMuIElmIG5vdGhpbmcgbWF0Y2hlZCwgbnVsbCB3aWxsIGJlIHJldHVybmVkLlxuICAgKiBAdGhyb3dzIHRocm93cyBleGNlcHRpb24gaWYgdGhlIHNuYXBzaG90IHZlcnNpb24gbWlzbWF0Y2hlZCBvciBhbnkgb3RoZXIgdW5leHBlY3RlZCBlcnJvci5cbiAgICovXG4gIC8vICRGbG93SWdub3JlW3ZhbHVlLWFzLXR5cGVdXG4gIGFzeW5jIGdldFNuYXBzaG90Q29udGVudChmaWxlUGF0aDogc3RyaW5nLCBuYW1lOiBzdHJpbmcgfCBSZWdFeHApOiBQcm9taXNlPHN0cmluZyB8IFNuYXBzaG90RGF0YSB8IG51bGw+IHtcbiAgICBjb25zdCBzbmFwc2hvdFJlc29sdmVyID0gYXdhaXQgdGhpcy5fZ2V0U25hcHNob3RSZXNvbHZlcigpO1xuXG4gICAgY29uc3Qgc25hcHNob3RQYXRoID0gc25hcHNob3RSZXNvbHZlci5yZXNvbHZlU25hcHNob3RQYXRoKGZpbGVQYXRoKTtcbiAgICBjb25zdCBzbmFwc2hvdHMgPSB1dGlscy5nZXRTbmFwc2hvdERhdGEoc25hcHNob3RQYXRoLCAnbm9uZScpLmRhdGE7XG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHNuYXBzaG90c1tuYW1lXTtcbiAgICB9XG4gICAgY29uc3QgcmVnZXggPSBuYW1lO1xuICAgIC8vICRGbG93SWdub3JlW3ZhbHVlLWFzLXR5cGVdXG4gICAgY29uc3QgZGF0YTogU25hcHNob3REYXRhID0ge307XG4gICAgT2JqZWN0LmVudHJpZXMoc25hcHNob3RzKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIGlmIChyZWdleC50ZXN0KGtleSkpIHtcbiAgICAgICAgZGF0YVtrZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKGRhdGEpLmxlbmd0aCA+IDAgPyBkYXRhIDogbnVsbDtcbiAgfVxuXG4gIGFzeW5jIGdldE1ldGFkYXRhQXN5bmMoZmlsZVBhdGg6IHN0cmluZywgb3B0aW9ucz86IFNuYXBzaG90UGFyc2VyT3B0aW9ucyk6IFByb21pc2U8QXJyYXk8U25hcHNob3RNZXRhZGF0YT4+IHtcbiAgICBhd2FpdCB0aGlzLl9nZXRTbmFwc2hvdFJlc29sdmVyKCk7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TWV0YWRhdGEoZmlsZVBhdGgsIG9wdGlvbnMpO1xuICB9XG5cbiAgZ2V0TWV0YWRhdGEoZmlsZVBhdGg6IHN0cmluZywgb3B0aW9ucz86IFNuYXBzaG90UGFyc2VyT3B0aW9ucyk6IEFycmF5PFNuYXBzaG90TWV0YWRhdGE+IHtcbiAgICBpZiAoIXRoaXMuc25hcHNob3RSZXNvbHZlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzbmFwc2hvdFJlc29sdmVyIGlzIG5vdCByZWFkeSB5ZXQsIGNvbnNpZGVyIG1pZ3JhdGluZyB0byBcImdldE1ldGFkYXRhQXN5bmNcIiBpbnN0ZWFkJyk7XG4gICAgfVxuICAgIGNvbnN0IHNuYXBzaG90UGF0aCA9IHRoaXMuc25hcHNob3RSZXNvbHZlci5yZXNvbHZlU25hcHNob3RQYXRoKGZpbGVQYXRoKTtcbiAgICBjb25zdCBzbmFwc2hvdE5vZGVzID0gdGhpcy5wYXJzZShmaWxlUGF0aCwgb3B0aW9ucyk7XG4gICAgY29uc3Qgc25hcHNob3RzID0gdXRpbHMuZ2V0U25hcHNob3REYXRhKHNuYXBzaG90UGF0aCwgJ25vbmUnKS5kYXRhO1xuXG4gICAgbGV0IGxhc3RQYXJlbnQgPSBudWxsO1xuICAgIGxldCBjb3VudCA9IDE7XG5cbiAgICByZXR1cm4gc25hcHNob3ROb2Rlcy5tYXAoKHNuYXBzaG90Tm9kZSkgPT4ge1xuICAgICAgY29uc3Qge3BhcmVudHN9ID0gc25hcHNob3ROb2RlO1xuICAgICAgY29uc3QgaW5uZXJBc3NlcnRpb24gPSBwYXJlbnRzW3BhcmVudHMubGVuZ3RoIC0gMV07XG5cbiAgICAgIGlmIChsYXN0UGFyZW50ICE9PSBpbm5lckFzc2VydGlvbikge1xuICAgICAgICBsYXN0UGFyZW50ID0gaW5uZXJBc3NlcnRpb247XG4gICAgICAgIGNvdW50ID0gMTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgICBjb250ZW50OiB1bmRlZmluZWQsXG4gICAgICAgIGNvdW50LFxuICAgICAgICBleGlzdHM6IGZhbHNlLFxuICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgbm9kZTogc25hcHNob3ROb2RlLm5vZGUsXG4gICAgICB9O1xuICAgICAgY291bnQgKz0gMTtcblxuICAgICAgaWYgKCFpbm5lckFzc2VydGlvbiB8fCBpc0Rlc2NyaWJlKGlubmVyQXNzZXJ0aW9uLmNhbGxlZSkpIHtcbiAgICAgICAgLy8gQW4gZXhwZWN0YXRpb24gaW5zaWRlIGRlc2NyaWJlIG5ldmVyIGdldHMgZXhlY3V0ZWQuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdC5uYW1lID0gYnVpbGROYW1lKHNuYXBzaG90Tm9kZSwgcGFyZW50cywgcmVzdWx0LmNvdW50KTtcblxuICAgICAgaWYgKHNuYXBzaG90c1tyZXN1bHQubmFtZV0pIHtcbiAgICAgICAgcmVzdWx0LmV4aXN0cyA9IHRydWU7XG4gICAgICAgIHJlc3VsdC5jb250ZW50ID0gc25hcHNob3RzW3Jlc3VsdC5uYW1lXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVQTtBQUVBO0FBR0E7QUFDQTtBQUEyQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLCtDQWYzQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBMEJBLElBQU1BLGdCQUFnQixHQUFHQyxNQUFNLENBQUNDLE1BQU0sQ0FBRUQsTUFBTSxDQUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQXlDO0VBQ2xHQyxRQUFRLEVBQUUsSUFBSTtFQUNkQyxTQUFTLEVBQUUsSUFBSTtFQUNmQyxTQUFTLEVBQUU7QUFDYixDQUFDLENBQUM7QUFDRixJQUFNQyxJQUFJLEdBQUdOLE1BQU0sQ0FBQ0MsTUFBTSxDQUFFRCxNQUFNLENBQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBeUM7RUFDdEZDLFFBQVEsRUFBRSxJQUFJO0VBQ2RJLEVBQUUsRUFBRSxJQUFJO0VBQ1JDLElBQUksRUFBRTtBQUNSLENBQUMs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