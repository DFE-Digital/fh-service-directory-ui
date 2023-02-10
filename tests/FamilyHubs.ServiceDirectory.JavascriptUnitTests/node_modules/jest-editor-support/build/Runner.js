"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
require("core-js/modules/es.reflect.construct.js");
require("core-js/modules/es.object.create.js");
require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.array.is-array.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.weak-map.js");
require("core-js/modules/es.object.get-own-property-descriptor.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/es.array.for-each.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.date.to-string.js");
require("core-js/modules/es.regexp.to-string.js");
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.array.find.js");
require("core-js/modules/es.object.set-prototype-of.js");
require("core-js/modules/es.function.bind.js");
require("core-js/modules/es.object.get-prototype-of.js");
var _child_process = require("child_process");
var _fs = require("fs");
var _os = require("os");
var path = _interopRequireWildcard(require("path"));
var _events = _interopRequireDefault(require("events"));
var _types = require("./types");
var _project_workspace = _interopRequireDefault(require("./project_workspace"));
var _Process = require("./Process");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
// This class represents the running process, and
// passes out events when it understands what data is being
// pass sent out of the process
var Runner = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Runner, _EventEmitter);
  var _super = _createSuper(Runner);
  // $FlowIgnore[value-as-type]

  // $FlowIgnore[value-as-type]

  // $FlowIgnore[value-as-type]
  function Runner(workspace, options) {
    var _this;
    _classCallCheck(this, Runner);
    _this = _super.call(this);
    _this._createProcess = options && options.createProcess || _Process.createProcess;
    _this.options = options || {};
    _this.workspace = workspace;
    _this.outputPath = path.join((0, _os.tmpdir)(), "jest_runner_".concat(_this.workspace.outputFileSuffix || '', ".json"));
    _this.prevMessageTypes = [];
    _this._exited = false;
    return _this;
  }
  _createClass(Runner, [{
    key: "_getArgs",
    value: function _getArgs() {
      if (this.options.args && this.options.args.replace) {
        return this.options.args.args;
      }

      // Handle the arg change on v18
      var belowEighteen = this.workspace.localJestMajorVersion < 18;
      var outputArg = belowEighteen ? '--jsonOutputFile' : '--outputFile';
      var args = ['--testLocationInResults', '--json', '--useStderr', outputArg, this.outputPath];
      if (this.watchMode) {
        args.push(this.watchAll ? '--watchAll' : '--watch');
      }
      if (this.options.testNamePattern) {
        args.push('--testNamePattern', this.options.testNamePattern);
      }
      if (this.options.testFileNamePattern) {
        args.push(this.options.testFileNamePattern);
      }
      if (this.workspace.collectCoverage === true) {
        args.push('--coverage');
      }
      if (this.workspace.collectCoverage === false) {
        args.push('--no-coverage');
      }
      if (this.options.noColor === true) {
        args.push('--no-color');
      }
      if (this.options.reporters) {
        this.options.reporters.forEach(function (reporter) {
          args.push('--reporters', reporter);
        });
      }
      if (this.options.args) {
        args.push.apply(args, _toConsumableArray(this.options.args.args));
      }
      return args;
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;
      var watchMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var watchAll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (this.debugprocess) {
        return;
      }
      this.watchMode = watchMode;
      this.watchAll = watchAll;
      var args = this._getArgs();
      var debugprocess = this._createProcess(this.workspace, args);
      this.debugprocess = debugprocess;
      debugprocess.stdout.on('data', function (data) {
        _this2._parseOutput(data, false);
      });
      debugprocess.stderr.on('data', function (data) {
        // jest 23 could send test results message to stderr
        // see https://github.com/facebook/jest/pull/4858
        _this2._parseOutput(data, true);
      });
      debugprocess.on('exit', function (code, signal) {
        _this2._exited = true;

        // this is mainly for backward compatibility, should be deprecated soon
        _this2.emit('debuggerProcessExit');
        _this2.emit('processExit', code, signal);
        _this2.prevMessageTypes.length = 0;
      });
      debugprocess.on('error', function (error) {
        _this2.emit('terminalError', "Process failed: ".concat(error.message));
        _this2.prevMessageTypes.length = 0;
      });
      debugprocess.on('close', function (code, signal) {
        // this is mainly for backward compatibility, should be deprecated soon
        _this2.emit('debuggerProcessExit');
        _this2.emit('processClose', code, signal);
        _this2.prevMessageTypes.length = 0;
      });
    }

    /**
     * parse the stdin/out stream buffer for recognized messages.
     *
     * note: if these messages coming in in separate chucks, we might not be able to
     * resolve it properly. While there haven't been much evidence of such scenario,
     * it's worth to note that it could and we might need to buffer them in that case.
     * see https://github.com/jest-community/jest-editor-support/pull/9#pullrequestreview-231888752
     *
     * @param {Buffer} data
     * @param {boolean} isStdErr
     * @returns {MessageType}
     * @memberof Runner
     */
  }, {
    key: "_parseOutput",
    value: function _parseOutput(data, isStdErr) {
      var _this3 = this;
      var msgType = this.findMessageType(data);
      switch (msgType) {
        case _types.messageTypes.testResults:
          this.emit('executableStdErr', data, {
            type: msgType
          });
          (0, _fs.readFile)(this.outputPath, 'utf8', function (err, _data) {
            if (err) {
              var message = "JSON report not found at ".concat(_this3.outputPath);
              _this3.emit('terminalError', message);
            } else {
              var noTestsFound = _this3.doResultsFollowNoTestsFoundMessage();
              _this3.emit('executableJSON', JSON.parse(_data), {
                noTestsFound: noTestsFound
              });
            }
          });
          this.prevMessageTypes.length = 0;
          break;
        case _types.messageTypes.watchUsage:
        case _types.messageTypes.noTests:
          this.prevMessageTypes.push(msgType);
          this.emit('executableStdErr', data, {
            type: msgType
          });
          break;
        default:
          // no special action needed, just report the output by its source
          if (isStdErr) {
            this.emit('executableStdErr', data, {
              type: msgType
            });
          } else {
            // remove clear screen escape sequence
            this.emit('executableOutput', data.toString().replace('[2J[H', ''));
          }
          this.prevMessageTypes.length = 0;
          break;
      }
      return msgType;
    }
  }, {
    key: "runJestWithUpdateForSnapshots",
    value: function runJestWithUpdateForSnapshots(completion, args) {
      var defaultArgs = ['--updateSnapshot'];
      var updateProcess = this._createProcess(this.workspace, [].concat(defaultArgs, _toConsumableArray(args || [])));
      updateProcess.on('close', function () {
        completion();
      });
    }
  }, {
    key: "closeProcess",
    value: function closeProcess() {
      if (!this.debugprocess || this._exited) {
        // eslint-disable-next-line no-console
        console.log("process has not started or already exited");
        return;
      }
      if (process.platform === 'win32') {
        // Windows doesn't exit the process when it should.
        (0, _child_process.spawn)('taskkill', ['/pid', "".concat(this.debugprocess.pid), '/T', '/F']);
      } else {
        try {
          // kill all process with the same PGID, i.e.
          // as a detached process, it is the same as the PID of the leader process.
          process.kill(-this.debugprocess.pid);
        } catch (e) {
          var _this$debugprocess, _this$debugprocess2;
          // if anything goes wrong, fallback to the old benavior
          // knowing this could leave orphan process...
          // eslint-disable-next-line no-console
          console.warn("failed to kill process group, this could leave some orphan process whose ppid=".concat(((_this$debugprocess = this.debugprocess) === null || _this$debugprocess === void 0 ? void 0 : _this$debugprocess.pid) || 'process-non-exist', ". error="), e);
          (_this$debugprocess2 = this.debugprocess) === null || _this$debugprocess2 === void 0 ? void 0 : _this$debugprocess2.kill();
        }
      }
      this.debugprocess = undefined;
    }

    // eslint-disable-next-line class-methods-use-this
  }, {
    key: "findMessageType",
    value: function findMessageType(buf) {
      var noTestRegex = /No tests found related to files changed since ((last commit)|("[a-z0-9]+"))./;
      var watchUsageRegex = /^\s*Watch Usage\b/;
      var testResultsRegex = /Test results written to/;
      var checks = [{
        regex: testResultsRegex,
        messageType: _types.messageTypes.testResults
      }, {
        regex: noTestRegex,
        messageType: _types.messageTypes.noTests
      }, {
        regex: watchUsageRegex,
        messageType: _types.messageTypes.watchUsage
      }];
      var str = buf.toString('utf8');
      var match = checks.find(function (_ref) {
        var regex = _ref.regex;
        return regex.test(str);
      });
      return match ? match.messageType : _types.messageTypes.unknown;
    }
  }, {
    key: "doResultsFollowNoTestsFoundMessage",
    value: function doResultsFollowNoTestsFoundMessage() {
      if (this.prevMessageTypes.length === 1) {
        return this.prevMessageTypes[0] === _types.messageTypes.noTests;
      }
      if (this.prevMessageTypes.length === 2) {
        return this.prevMessageTypes[0] === _types.messageTypes.noTests && this.prevMessageTypes[1] === _types.messageTypes.watchUsage;
      }
      return false;
    }
  }]);
  return Runner;
}(_events["default"]);
exports["default"] = Runner;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSdW5uZXIiLCJ3b3Jrc3BhY2UiLCJvcHRpb25zIiwiX2NyZWF0ZVByb2Nlc3MiLCJjcmVhdGVQcm9jZXNzIiwib3V0cHV0UGF0aCIsInBhdGgiLCJqb2luIiwidG1wZGlyIiwib3V0cHV0RmlsZVN1ZmZpeCIsInByZXZNZXNzYWdlVHlwZXMiLCJfZXhpdGVkIiwiYXJncyIsInJlcGxhY2UiLCJiZWxvd0VpZ2h0ZWVuIiwibG9jYWxKZXN0TWFqb3JWZXJzaW9uIiwib3V0cHV0QXJnIiwid2F0Y2hNb2RlIiwicHVzaCIsIndhdGNoQWxsIiwidGVzdE5hbWVQYXR0ZXJuIiwidGVzdEZpbGVOYW1lUGF0dGVybiIsImNvbGxlY3RDb3ZlcmFnZSIsIm5vQ29sb3IiLCJyZXBvcnRlcnMiLCJmb3JFYWNoIiwicmVwb3J0ZXIiLCJkZWJ1Z3Byb2Nlc3MiLCJfZ2V0QXJncyIsInN0ZG91dCIsIm9uIiwiZGF0YSIsIl9wYXJzZU91dHB1dCIsInN0ZGVyciIsImNvZGUiLCJzaWduYWwiLCJlbWl0IiwibGVuZ3RoIiwiZXJyb3IiLCJtZXNzYWdlIiwiaXNTdGRFcnIiLCJtc2dUeXBlIiwiZmluZE1lc3NhZ2VUeXBlIiwibWVzc2FnZVR5cGVzIiwidGVzdFJlc3VsdHMiLCJ0eXBlIiwicmVhZEZpbGUiLCJlcnIiLCJfZGF0YSIsIm5vVGVzdHNGb3VuZCIsImRvUmVzdWx0c0ZvbGxvd05vVGVzdHNGb3VuZE1lc3NhZ2UiLCJKU09OIiwicGFyc2UiLCJ3YXRjaFVzYWdlIiwibm9UZXN0cyIsInRvU3RyaW5nIiwiY29tcGxldGlvbiIsImRlZmF1bHRBcmdzIiwidXBkYXRlUHJvY2VzcyIsImNvbnNvbGUiLCJsb2ciLCJwcm9jZXNzIiwicGxhdGZvcm0iLCJzcGF3biIsInBpZCIsImtpbGwiLCJlIiwid2FybiIsInVuZGVmaW5lZCIsImJ1ZiIsIm5vVGVzdFJlZ2V4Iiwid2F0Y2hVc2FnZVJlZ2V4IiwidGVzdFJlc3VsdHNSZWdleCIsImNoZWNrcyIsInJlZ2V4IiwibWVzc2FnZVR5cGUiLCJzdHIiLCJtYXRjaCIsImZpbmQiLCJ0ZXN0IiwidW5rbm93biIsIkV2ZW50RW1pdHRlciJdLCJzb3VyY2VzIjpbIi4uL3NyYy9SdW5uZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCB7Q2hpbGRQcm9jZXNzLCBzcGF3bn0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQge3JlYWRGaWxlfSBmcm9tICdmcyc7XG5pbXBvcnQge3RtcGRpcn0gZnJvbSAnb3MnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7bWVzc2FnZVR5cGVzfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB0eXBlIHtPcHRpb25zLCBNZXNzYWdlVHlwZX0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgUHJvamVjdFdvcmtzcGFjZSBmcm9tICcuL3Byb2plY3Rfd29ya3NwYWNlJztcbmltcG9ydCB7Y3JlYXRlUHJvY2Vzc30gZnJvbSAnLi9Qcm9jZXNzJztcblxuLy8gVGhpcyBjbGFzcyByZXByZXNlbnRzIHRoZSBydW5uaW5nIHByb2Nlc3MsIGFuZFxuLy8gcGFzc2VzIG91dCBldmVudHMgd2hlbiBpdCB1bmRlcnN0YW5kcyB3aGF0IGRhdGEgaXMgYmVpbmdcbi8vIHBhc3Mgc2VudCBvdXQgb2YgdGhlIHByb2Nlc3NcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJ1bm5lciBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGRlYnVncHJvY2VzczogP0NoaWxkUHJvY2VzcztcblxuICBvdXRwdXRQYXRoOiBzdHJpbmc7XG5cbiAgLy8gJEZsb3dJZ25vcmVbdmFsdWUtYXMtdHlwZV1cbiAgd29ya3NwYWNlOiBQcm9qZWN0V29ya3NwYWNlO1xuXG4gIC8vICRGbG93SWdub3JlW3ZhbHVlLWFzLXR5cGVdXG4gIF9jcmVhdGVQcm9jZXNzOiAod29ya3NwYWNlOiBQcm9qZWN0V29ya3NwYWNlLCBhcmdzOiBBcnJheTxzdHJpbmc+KSA9PiBDaGlsZFByb2Nlc3M7XG5cbiAgd2F0Y2hNb2RlOiBib29sZWFuO1xuXG4gIHdhdGNoQWxsOiBib29sZWFuO1xuXG4gIG9wdGlvbnM6IE9wdGlvbnM7XG5cbiAgcHJldk1lc3NhZ2VUeXBlczogTWVzc2FnZVR5cGVbXTtcblxuICBfZXhpdGVkOiBib29sZWFuO1xuXG4gIC8vICRGbG93SWdub3JlW3ZhbHVlLWFzLXR5cGVdXG4gIGNvbnN0cnVjdG9yKHdvcmtzcGFjZTogUHJvamVjdFdvcmtzcGFjZSwgb3B0aW9ucz86IE9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fY3JlYXRlUHJvY2VzcyA9IChvcHRpb25zICYmIG9wdGlvbnMuY3JlYXRlUHJvY2VzcykgfHwgY3JlYXRlUHJvY2VzcztcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHRoaXMud29ya3NwYWNlID0gd29ya3NwYWNlO1xuICAgIHRoaXMub3V0cHV0UGF0aCA9IHBhdGguam9pbih0bXBkaXIoKSwgYGplc3RfcnVubmVyXyR7dGhpcy53b3Jrc3BhY2Uub3V0cHV0RmlsZVN1ZmZpeCB8fCAnJ30uanNvbmApO1xuICAgIHRoaXMucHJldk1lc3NhZ2VUeXBlcyA9IFtdO1xuICAgIHRoaXMuX2V4aXRlZCA9IGZhbHNlO1xuICB9XG5cbiAgX2dldEFyZ3MoKTogc3RyaW5nW10ge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuYXJncyAmJiB0aGlzLm9wdGlvbnMuYXJncy5yZXBsYWNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmFyZ3MuYXJncztcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgdGhlIGFyZyBjaGFuZ2Ugb24gdjE4XG4gICAgY29uc3QgYmVsb3dFaWdodGVlbiA9IHRoaXMud29ya3NwYWNlLmxvY2FsSmVzdE1ham9yVmVyc2lvbiA8IDE4O1xuICAgIGNvbnN0IG91dHB1dEFyZyA9IGJlbG93RWlnaHRlZW4gPyAnLS1qc29uT3V0cHV0RmlsZScgOiAnLS1vdXRwdXRGaWxlJztcbiAgICBjb25zdCBhcmdzID0gWyctLXRlc3RMb2NhdGlvbkluUmVzdWx0cycsICctLWpzb24nLCAnLS11c2VTdGRlcnInLCBvdXRwdXRBcmcsIHRoaXMub3V0cHV0UGF0aF07XG4gICAgaWYgKHRoaXMud2F0Y2hNb2RlKSB7XG4gICAgICBhcmdzLnB1c2godGhpcy53YXRjaEFsbCA/ICctLXdhdGNoQWxsJyA6ICctLXdhdGNoJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMudGVzdE5hbWVQYXR0ZXJuKSB7XG4gICAgICBhcmdzLnB1c2goJy0tdGVzdE5hbWVQYXR0ZXJuJywgdGhpcy5vcHRpb25zLnRlc3ROYW1lUGF0dGVybik7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMudGVzdEZpbGVOYW1lUGF0dGVybikge1xuICAgICAgYXJncy5wdXNoKHRoaXMub3B0aW9ucy50ZXN0RmlsZU5hbWVQYXR0ZXJuKTtcbiAgICB9XG4gICAgaWYgKHRoaXMud29ya3NwYWNlLmNvbGxlY3RDb3ZlcmFnZSA9PT0gdHJ1ZSkge1xuICAgICAgYXJncy5wdXNoKCctLWNvdmVyYWdlJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLndvcmtzcGFjZS5jb2xsZWN0Q292ZXJhZ2UgPT09IGZhbHNlKSB7XG4gICAgICBhcmdzLnB1c2goJy0tbm8tY292ZXJhZ2UnKTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5ub0NvbG9yID09PSB0cnVlKSB7XG4gICAgICBhcmdzLnB1c2goJy0tbm8tY29sb3InKTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5yZXBvcnRlcnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5yZXBvcnRlcnMuZm9yRWFjaCgocmVwb3J0ZXIpID0+IHtcbiAgICAgICAgYXJncy5wdXNoKCctLXJlcG9ydGVycycsIHJlcG9ydGVyKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLmFyZ3MpIHtcbiAgICAgIGFyZ3MucHVzaCguLi50aGlzLm9wdGlvbnMuYXJncy5hcmdzKTtcbiAgICB9XG4gICAgcmV0dXJuIGFyZ3M7XG4gIH1cblxuICBzdGFydCh3YXRjaE1vZGU6IGJvb2xlYW4gPSB0cnVlLCB3YXRjaEFsbDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgaWYgKHRoaXMuZGVidWdwcm9jZXNzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy53YXRjaE1vZGUgPSB3YXRjaE1vZGU7XG4gICAgdGhpcy53YXRjaEFsbCA9IHdhdGNoQWxsO1xuXG4gICAgY29uc3QgYXJncyA9IHRoaXMuX2dldEFyZ3MoKTtcbiAgICBjb25zdCBkZWJ1Z3Byb2Nlc3MgPSB0aGlzLl9jcmVhdGVQcm9jZXNzKHRoaXMud29ya3NwYWNlLCBhcmdzKTtcbiAgICB0aGlzLmRlYnVncHJvY2VzcyA9IGRlYnVncHJvY2VzcztcbiAgICBkZWJ1Z3Byb2Nlc3Muc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGE6IEJ1ZmZlcikgPT4ge1xuICAgICAgdGhpcy5fcGFyc2VPdXRwdXQoZGF0YSwgZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgZGVidWdwcm9jZXNzLnN0ZGVyci5vbignZGF0YScsIChkYXRhOiBCdWZmZXIpID0+IHtcbiAgICAgIC8vIGplc3QgMjMgY291bGQgc2VuZCB0ZXN0IHJlc3VsdHMgbWVzc2FnZSB0byBzdGRlcnJcbiAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svamVzdC9wdWxsLzQ4NThcbiAgICAgIHRoaXMuX3BhcnNlT3V0cHV0KGRhdGEsIHRydWUpO1xuICAgIH0pO1xuICAgIGRlYnVncHJvY2Vzcy5vbignZXhpdCcsIChjb2RlOiBudW1iZXIgfCBudWxsLCBzaWduYWw6IHN0cmluZyB8IG51bGwpID0+IHtcbiAgICAgIHRoaXMuX2V4aXRlZCA9IHRydWU7XG5cbiAgICAgIC8vIHRoaXMgaXMgbWFpbmx5IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCBzaG91bGQgYmUgZGVwcmVjYXRlZCBzb29uXG4gICAgICB0aGlzLmVtaXQoJ2RlYnVnZ2VyUHJvY2Vzc0V4aXQnKTtcblxuICAgICAgdGhpcy5lbWl0KCdwcm9jZXNzRXhpdCcsIGNvZGUsIHNpZ25hbCk7XG4gICAgICB0aGlzLnByZXZNZXNzYWdlVHlwZXMubGVuZ3RoID0gMDtcbiAgICB9KTtcblxuICAgIGRlYnVncHJvY2Vzcy5vbignZXJyb3InLCAoZXJyb3I6IEVycm9yKSA9PiB7XG4gICAgICB0aGlzLmVtaXQoJ3Rlcm1pbmFsRXJyb3InLCBgUHJvY2VzcyBmYWlsZWQ6ICR7ZXJyb3IubWVzc2FnZX1gKTtcbiAgICAgIHRoaXMucHJldk1lc3NhZ2VUeXBlcy5sZW5ndGggPSAwO1xuICAgIH0pO1xuXG4gICAgZGVidWdwcm9jZXNzLm9uKCdjbG9zZScsIChjb2RlOiBudW1iZXIgfCBudWxsLCBzaWduYWw6IHN0cmluZyB8IG51bGwpID0+IHtcbiAgICAgIC8vIHRoaXMgaXMgbWFpbmx5IGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5LCBzaG91bGQgYmUgZGVwcmVjYXRlZCBzb29uXG4gICAgICB0aGlzLmVtaXQoJ2RlYnVnZ2VyUHJvY2Vzc0V4aXQnKTtcblxuICAgICAgdGhpcy5lbWl0KCdwcm9jZXNzQ2xvc2UnLCBjb2RlLCBzaWduYWwpO1xuICAgICAgdGhpcy5wcmV2TWVzc2FnZVR5cGVzLmxlbmd0aCA9IDA7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogcGFyc2UgdGhlIHN0ZGluL291dCBzdHJlYW0gYnVmZmVyIGZvciByZWNvZ25pemVkIG1lc3NhZ2VzLlxuICAgKlxuICAgKiBub3RlOiBpZiB0aGVzZSBtZXNzYWdlcyBjb21pbmcgaW4gaW4gc2VwYXJhdGUgY2h1Y2tzLCB3ZSBtaWdodCBub3QgYmUgYWJsZSB0b1xuICAgKiByZXNvbHZlIGl0IHByb3Blcmx5LiBXaGlsZSB0aGVyZSBoYXZlbid0IGJlZW4gbXVjaCBldmlkZW5jZSBvZiBzdWNoIHNjZW5hcmlvLFxuICAgKiBpdCdzIHdvcnRoIHRvIG5vdGUgdGhhdCBpdCBjb3VsZCBhbmQgd2UgbWlnaHQgbmVlZCB0byBidWZmZXIgdGhlbSBpbiB0aGF0IGNhc2UuXG4gICAqIHNlZSBodHRwczovL2dpdGh1Yi5jb20vamVzdC1jb21tdW5pdHkvamVzdC1lZGl0b3Itc3VwcG9ydC9wdWxsLzkjcHVsbHJlcXVlc3RyZXZpZXctMjMxODg4NzUyXG4gICAqXG4gICAqIEBwYXJhbSB7QnVmZmVyfSBkYXRhXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNTdGRFcnJcbiAgICogQHJldHVybnMge01lc3NhZ2VUeXBlfVxuICAgKiBAbWVtYmVyb2YgUnVubmVyXG4gICAqL1xuICBfcGFyc2VPdXRwdXQoZGF0YTogQnVmZmVyLCBpc1N0ZEVycjogYm9vbGVhbik6IE1lc3NhZ2VUeXBlIHtcbiAgICBjb25zdCBtc2dUeXBlID0gdGhpcy5maW5kTWVzc2FnZVR5cGUoZGF0YSk7XG4gICAgc3dpdGNoIChtc2dUeXBlKSB7XG4gICAgICBjYXNlIG1lc3NhZ2VUeXBlcy50ZXN0UmVzdWx0czpcbiAgICAgICAgdGhpcy5lbWl0KCdleGVjdXRhYmxlU3RkRXJyJywgZGF0YSwge1xuICAgICAgICAgIHR5cGU6IG1zZ1R5cGUsXG4gICAgICAgIH0pO1xuICAgICAgICByZWFkRmlsZSh0aGlzLm91dHB1dFBhdGgsICd1dGY4JywgKGVyciwgX2RhdGEpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gYEpTT04gcmVwb3J0IG5vdCBmb3VuZCBhdCAke3RoaXMub3V0cHV0UGF0aH1gO1xuICAgICAgICAgICAgdGhpcy5lbWl0KCd0ZXJtaW5hbEVycm9yJywgbWVzc2FnZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG5vVGVzdHNGb3VuZCA9IHRoaXMuZG9SZXN1bHRzRm9sbG93Tm9UZXN0c0ZvdW5kTWVzc2FnZSgpO1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdleGVjdXRhYmxlSlNPTicsIEpTT04ucGFyc2UoX2RhdGEpLCB7XG4gICAgICAgICAgICAgIG5vVGVzdHNGb3VuZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucHJldk1lc3NhZ2VUeXBlcy5sZW5ndGggPSAwO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgbWVzc2FnZVR5cGVzLndhdGNoVXNhZ2U6XG4gICAgICBjYXNlIG1lc3NhZ2VUeXBlcy5ub1Rlc3RzOlxuICAgICAgICB0aGlzLnByZXZNZXNzYWdlVHlwZXMucHVzaChtc2dUeXBlKTtcbiAgICAgICAgdGhpcy5lbWl0KCdleGVjdXRhYmxlU3RkRXJyJywgZGF0YSwge1xuICAgICAgICAgIHR5cGU6IG1zZ1R5cGUsXG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIG5vIHNwZWNpYWwgYWN0aW9uIG5lZWRlZCwganVzdCByZXBvcnQgdGhlIG91dHB1dCBieSBpdHMgc291cmNlXG4gICAgICAgIGlmIChpc1N0ZEVycikge1xuICAgICAgICAgIHRoaXMuZW1pdCgnZXhlY3V0YWJsZVN0ZEVycicsIGRhdGEsIHtcbiAgICAgICAgICAgIHR5cGU6IG1zZ1R5cGUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gcmVtb3ZlIGNsZWFyIHNjcmVlbiBlc2NhcGUgc2VxdWVuY2VcbiAgICAgICAgICB0aGlzLmVtaXQoJ2V4ZWN1dGFibGVPdXRwdXQnLCBkYXRhLnRvU3RyaW5nKCkucmVwbGFjZSgnXHUwMDFiWzJKXHUwMDFiW0gnLCAnJykpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJldk1lc3NhZ2VUeXBlcy5sZW5ndGggPSAwO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gbXNnVHlwZTtcbiAgfVxuXG4gIHJ1bkplc3RXaXRoVXBkYXRlRm9yU25hcHNob3RzKGNvbXBsZXRpb246ICgpID0+IHZvaWQsIGFyZ3M/OiBzdHJpbmdbXSkge1xuICAgIGNvbnN0IGRlZmF1bHRBcmdzID0gWyctLXVwZGF0ZVNuYXBzaG90J107XG5cbiAgICBjb25zdCB1cGRhdGVQcm9jZXNzID0gdGhpcy5fY3JlYXRlUHJvY2Vzcyh0aGlzLndvcmtzcGFjZSwgWy4uLmRlZmF1bHRBcmdzLCAuLi4oYXJncyB8fCBbXSldKTtcbiAgICB1cGRhdGVQcm9jZXNzLm9uKCdjbG9zZScsICgpID0+IHtcbiAgICAgIGNvbXBsZXRpb24oKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNsb3NlUHJvY2VzcygpIHtcbiAgICBpZiAoIXRoaXMuZGVidWdwcm9jZXNzIHx8IHRoaXMuX2V4aXRlZCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUubG9nKGBwcm9jZXNzIGhhcyBub3Qgc3RhcnRlZCBvciBhbHJlYWR5IGV4aXRlZGApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgICAgLy8gV2luZG93cyBkb2Vzbid0IGV4aXQgdGhlIHByb2Nlc3Mgd2hlbiBpdCBzaG91bGQuXG4gICAgICBzcGF3bigndGFza2tpbGwnLCBbJy9waWQnLCBgJHt0aGlzLmRlYnVncHJvY2Vzcy5waWR9YCwgJy9UJywgJy9GJ10pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBraWxsIGFsbCBwcm9jZXNzIHdpdGggdGhlIHNhbWUgUEdJRCwgaS5lLlxuICAgICAgICAvLyBhcyBhIGRldGFjaGVkIHByb2Nlc3MsIGl0IGlzIHRoZSBzYW1lIGFzIHRoZSBQSUQgb2YgdGhlIGxlYWRlciBwcm9jZXNzLlxuICAgICAgICBwcm9jZXNzLmtpbGwoLXRoaXMuZGVidWdwcm9jZXNzLnBpZCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlmIGFueXRoaW5nIGdvZXMgd3JvbmcsIGZhbGxiYWNrIHRvIHRoZSBvbGQgYmVuYXZpb3JcbiAgICAgICAgLy8ga25vd2luZyB0aGlzIGNvdWxkIGxlYXZlIG9ycGhhbiBwcm9jZXNzLi4uXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBgZmFpbGVkIHRvIGtpbGwgcHJvY2VzcyBncm91cCwgdGhpcyBjb3VsZCBsZWF2ZSBzb21lIG9ycGhhbiBwcm9jZXNzIHdob3NlIHBwaWQ9JHtcbiAgICAgICAgICAgIHRoaXMuZGVidWdwcm9jZXNzPy5waWQgfHwgJ3Byb2Nlc3Mtbm9uLWV4aXN0J1xuICAgICAgICAgIH0uIGVycm9yPWAsXG4gICAgICAgICAgZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLmRlYnVncHJvY2Vzcz8ua2lsbCgpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmRlYnVncHJvY2VzcyA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzXG4gIGZpbmRNZXNzYWdlVHlwZShidWY6IEJ1ZmZlcik6IE1lc3NhZ2VUeXBlIHtcbiAgICBjb25zdCBub1Rlc3RSZWdleCA9IC9ObyB0ZXN0cyBmb3VuZCByZWxhdGVkIHRvIGZpbGVzIGNoYW5nZWQgc2luY2UgKChsYXN0IGNvbW1pdCl8KFwiW2EtejAtOV0rXCIpKS4vO1xuICAgIGNvbnN0IHdhdGNoVXNhZ2VSZWdleCA9IC9eXFxzKldhdGNoIFVzYWdlXFxiLztcbiAgICBjb25zdCB0ZXN0UmVzdWx0c1JlZ2V4ID0gL1Rlc3QgcmVzdWx0cyB3cml0dGVuIHRvLztcblxuICAgIGNvbnN0IGNoZWNrcyA9IFtcbiAgICAgIHtyZWdleDogdGVzdFJlc3VsdHNSZWdleCwgbWVzc2FnZVR5cGU6IG1lc3NhZ2VUeXBlcy50ZXN0UmVzdWx0c30sXG4gICAgICB7cmVnZXg6IG5vVGVzdFJlZ2V4LCBtZXNzYWdlVHlwZTogbWVzc2FnZVR5cGVzLm5vVGVzdHN9LFxuICAgICAge3JlZ2V4OiB3YXRjaFVzYWdlUmVnZXgsIG1lc3NhZ2VUeXBlOiBtZXNzYWdlVHlwZXMud2F0Y2hVc2FnZX0sXG4gICAgXTtcblxuICAgIGNvbnN0IHN0ciA9IGJ1Zi50b1N0cmluZygndXRmOCcpO1xuICAgIGNvbnN0IG1hdGNoID0gY2hlY2tzLmZpbmQoKHtyZWdleH0pID0+IHJlZ2V4LnRlc3Qoc3RyKSk7XG4gICAgcmV0dXJuIG1hdGNoID8gbWF0Y2gubWVzc2FnZVR5cGUgOiBtZXNzYWdlVHlwZXMudW5rbm93bjtcbiAgfVxuXG4gIGRvUmVzdWx0c0ZvbGxvd05vVGVzdHNGb3VuZE1lc3NhZ2UoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMucHJldk1lc3NhZ2VUeXBlcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLnByZXZNZXNzYWdlVHlwZXNbMF0gPT09IG1lc3NhZ2VUeXBlcy5ub1Rlc3RzO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByZXZNZXNzYWdlVHlwZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcmV2TWVzc2FnZVR5cGVzWzBdID09PSBtZXNzYWdlVHlwZXMubm9UZXN0cyAmJiB0aGlzLnByZXZNZXNzYWdlVHlwZXNbMV0gPT09IG1lc3NhZ2VUeXBlcy53YXRjaFVzYWdlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBU0E7QUFD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