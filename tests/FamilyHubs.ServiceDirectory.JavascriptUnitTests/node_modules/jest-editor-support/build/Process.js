"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.array.from.js");
require("core-js/modules/es.array.slice.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.object.keys.js");
require("core-js/modules/es.array.filter.js");
require("core-js/modules/es.object.get-own-property-descriptor.js");
require("core-js/modules/es.array.for-each.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.object.get-own-property-descriptors.js");
require("core-js/modules/es.object.define-properties.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createProcess = void 0;
require("core-js/modules/es.array.is-array.js");
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.array.join.js");
var _child_process = require("child_process");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
var isLoginShell = function isLoginShell(arg) {
  return arg && typeof arg.path === 'string' && Array.isArray(arg.args);
};

/**
 * Spawns and returns a Jest process with specific args
 *
 * @param {string[]} args
 * @returns {ChildProcess}
 */
// eslint-disable-next-line import/prefer-default-export
var createProcess = function createProcess(workspace, args) {
  var _workspace$nodeEnv;
  var runtimeExecutable = [workspace.jestCommandLine].concat(_toConsumableArray(args));

  // If a path to configuration file was defined, push it to runtimeArgs
  if (workspace.pathToConfig) {
    runtimeExecutable.push('--config');
    runtimeExecutable.push(workspace.pathToConfig);
  }
  var env = _objectSpread(_objectSpread({}, process.env), (_workspace$nodeEnv = workspace.nodeEnv) !== null && _workspace$nodeEnv !== void 0 ? _workspace$nodeEnv : {});
  var cmd = runtimeExecutable.join(' ');
  var spawnCommandLine = function spawnCommandLine() {
    var spawnOptions = {
      cwd: workspace.rootPath,
      env: env,
      shell: typeof workspace.shell === 'string' && workspace.shell ? workspace.shell : true,
      // for non-windows: run in detached mode so the process will be the group leader and any subsequent process spawned
      // within can be later killed as a group to prevent orphan processes.
      // see https://nodejs.org/api/child_process.html#child_process_options_detached
      detached: process.platform !== 'win32'
    };
    if (workspace.debug) {
      // eslint-disable-next-line no-console
      console.log("spawning process with command=".concat(cmd), 'options:', spawnOptions);
    }
    return (0, _child_process.spawn)(cmd, [], spawnOptions);
  };
  var spawnLoginShell = function spawnLoginShell(shell) {
    var spawnOptions = {
      cwd: workspace.rootPath,
      env: env,
      detached: process.platform !== 'win32'
    };
    if (workspace.debug) {
      // eslint-disable-next-line no-console
      console.log("spawning login-shell \"".concat(shell.path, " ").concat(shell.args.join(' '), "\" for command=").concat(cmd), 'options:', spawnOptions);
    }
    var child = (0, _child_process.spawn)(shell.path, shell.args, spawnOptions);
    child.stdin.write("".concat(cmd, " \nexit $?\n"));
    return child;
  };
  if (isLoginShell(workspace.shell)) {
    if (process.platform === 'win32') {
      console.error('currently login-shell is only supported for non-windown platforms');
    } else {
      return spawnLoginShell(workspace.shell);
    }
  }
  return spawnCommandLine();
};
exports.createProcess = createProcess;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJpc0xvZ2luU2hlbGwiLCJhcmciLCJwYXRoIiwiQXJyYXkiLCJpc0FycmF5IiwiYXJncyIsImNyZWF0ZVByb2Nlc3MiLCJ3b3Jrc3BhY2UiLCJydW50aW1lRXhlY3V0YWJsZSIsImplc3RDb21tYW5kTGluZSIsInBhdGhUb0NvbmZpZyIsInB1c2giLCJlbnYiLCJwcm9jZXNzIiwibm9kZUVudiIsImNtZCIsImpvaW4iLCJzcGF3bkNvbW1hbmRMaW5lIiwic3Bhd25PcHRpb25zIiwiY3dkIiwicm9vdFBhdGgiLCJzaGVsbCIsImRldGFjaGVkIiwicGxhdGZvcm0iLCJkZWJ1ZyIsImNvbnNvbGUiLCJsb2ciLCJzcGF3biIsInNwYXduTG9naW5TaGVsbCIsImNoaWxkIiwic3RkaW4iLCJ3cml0ZSIsImVycm9yIl0sInNvdXJjZXMiOlsiLi4vc3JjL1Byb2Nlc3MudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKi9cblxuaW1wb3J0IHtDaGlsZFByb2Nlc3MsIHNwYXdufSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCB0eXBlIFByb2plY3RXb3Jrc3BhY2UgZnJvbSAnLi9wcm9qZWN0X3dvcmtzcGFjZSc7XG5pbXBvcnQgdHlwZSB7TG9naW5TaGVsbH0gZnJvbSAnLi9wcm9qZWN0X3dvcmtzcGFjZSc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55LCBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLW1lbWJlci1hY2Nlc3NcbmNvbnN0IGlzTG9naW5TaGVsbCA9IChhcmc6IGFueSk6IGFyZyBpcyBMb2dpblNoZWxsID0+IGFyZyAmJiB0eXBlb2YgYXJnLnBhdGggPT09ICdzdHJpbmcnICYmIEFycmF5LmlzQXJyYXkoYXJnLmFyZ3MpO1xuXG4vKipcbiAqIFNwYXducyBhbmQgcmV0dXJucyBhIEplc3QgcHJvY2VzcyB3aXRoIHNwZWNpZmljIGFyZ3NcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBhcmdzXG4gKiBAcmV0dXJucyB7Q2hpbGRQcm9jZXNzfVxuICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L3ByZWZlci1kZWZhdWx0LWV4cG9ydFxuZXhwb3J0IGNvbnN0IGNyZWF0ZVByb2Nlc3MgPSAod29ya3NwYWNlOiBQcm9qZWN0V29ya3NwYWNlLCBhcmdzOiBzdHJpbmdbXSk6IENoaWxkUHJvY2VzcyA9PiB7XG4gIGNvbnN0IHJ1bnRpbWVFeGVjdXRhYmxlID0gW3dvcmtzcGFjZS5qZXN0Q29tbWFuZExpbmUsIC4uLmFyZ3NdO1xuXG4gIC8vIElmIGEgcGF0aCB0byBjb25maWd1cmF0aW9uIGZpbGUgd2FzIGRlZmluZWQsIHB1c2ggaXQgdG8gcnVudGltZUFyZ3NcbiAgaWYgKHdvcmtzcGFjZS5wYXRoVG9Db25maWcpIHtcbiAgICBydW50aW1lRXhlY3V0YWJsZS5wdXNoKCctLWNvbmZpZycpO1xuICAgIHJ1bnRpbWVFeGVjdXRhYmxlLnB1c2god29ya3NwYWNlLnBhdGhUb0NvbmZpZyk7XG4gIH1cblxuICBjb25zdCBlbnYgPSB7Li4ucHJvY2Vzcy5lbnYsIC4uLih3b3Jrc3BhY2Uubm9kZUVudiA/PyB7fSl9O1xuICBjb25zdCBjbWQgPSBydW50aW1lRXhlY3V0YWJsZS5qb2luKCcgJyk7XG5cbiAgY29uc3Qgc3Bhd25Db21tYW5kTGluZSA9ICgpID0+IHtcbiAgICBjb25zdCBzcGF3bk9wdGlvbnMgPSB7XG4gICAgICBjd2Q6IHdvcmtzcGFjZS5yb290UGF0aCxcbiAgICAgIGVudixcbiAgICAgIHNoZWxsOiB0eXBlb2Ygd29ya3NwYWNlLnNoZWxsID09PSAnc3RyaW5nJyAmJiB3b3Jrc3BhY2Uuc2hlbGwgPyB3b3Jrc3BhY2Uuc2hlbGwgOiB0cnVlLFxuICAgICAgLy8gZm9yIG5vbi13aW5kb3dzOiBydW4gaW4gZGV0YWNoZWQgbW9kZSBzbyB0aGUgcHJvY2VzcyB3aWxsIGJlIHRoZSBncm91cCBsZWFkZXIgYW5kIGFueSBzdWJzZXF1ZW50IHByb2Nlc3Mgc3Bhd25lZFxuICAgICAgLy8gd2l0aGluIGNhbiBiZSBsYXRlciBraWxsZWQgYXMgYSBncm91cCB0byBwcmV2ZW50IG9ycGhhbiBwcm9jZXNzZXMuXG4gICAgICAvLyBzZWUgaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9jaGlsZF9wcm9jZXNzLmh0bWwjY2hpbGRfcHJvY2Vzc19vcHRpb25zX2RldGFjaGVkXG4gICAgICBkZXRhY2hlZDogcHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ3dpbjMyJyxcbiAgICB9O1xuXG4gICAgaWYgKHdvcmtzcGFjZS5kZWJ1Zykge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUubG9nKGBzcGF3bmluZyBwcm9jZXNzIHdpdGggY29tbWFuZD0ke2NtZH1gLCAnb3B0aW9uczonLCBzcGF3bk9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiBzcGF3bihjbWQsIFtdLCBzcGF3bk9wdGlvbnMpO1xuICB9O1xuXG4gIGNvbnN0IHNwYXduTG9naW5TaGVsbCA9IChzaGVsbDogTG9naW5TaGVsbCkgPT4ge1xuICAgIGNvbnN0IHNwYXduT3B0aW9ucyA9IHtcbiAgICAgIGN3ZDogd29ya3NwYWNlLnJvb3RQYXRoLFxuICAgICAgZW52LFxuICAgICAgZGV0YWNoZWQ6IHByb2Nlc3MucGxhdGZvcm0gIT09ICd3aW4zMicsXG4gICAgfTtcblxuICAgIGlmICh3b3Jrc3BhY2UuZGVidWcpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgYHNwYXduaW5nIGxvZ2luLXNoZWxsIFwiJHtzaGVsbC5wYXRofSAke3NoZWxsLmFyZ3Muam9pbignICcpfVwiIGZvciBjb21tYW5kPSR7Y21kfWAsXG4gICAgICAgICdvcHRpb25zOicsXG4gICAgICAgIHNwYXduT3B0aW9uc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBjaGlsZCA9IHNwYXduKHNoZWxsLnBhdGgsIHNoZWxsLmFyZ3MsIHNwYXduT3B0aW9ucyk7XG4gICAgY2hpbGQuc3RkaW4ud3JpdGUoYCR7Y21kfSBcXG5leGl0ICQ/XFxuYCk7XG4gICAgcmV0dXJuIGNoaWxkO1xuICB9O1xuXG4gIGlmIChpc0xvZ2luU2hlbGwod29ya3NwYWNlLnNoZWxsKSkge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdjdXJyZW50bHkgbG9naW4tc2hlbGwgaXMgb25seSBzdXBwb3J0ZWQgZm9yIG5vbi13aW5kb3duIHBsYXRmb3JtcycpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3Bhd25Mb2dpblNoZWxsKHdvcmtzcGFjZS5zaGVsbCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzcGF3bkNvbW1hbmRMaW5lKCk7XG59O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVFBO0FBQWtEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJbEQ7QUFDQSxJQUFNQSxZQUFZLEdBQUcsU0FBZkEsWUFBWSxDQUFJQyxHQUFRO0VBQUEsT0FBd0JBLEdBQUcsSUFBSSxPQUFPQSxHQUFHLENBQUNDLElBQUksS0FBSyxRQUFRLElBQUlDLEtBQUssQ0FBQ0MsT0FBTyxDQUFDSCxHQUFHLENBQUNJLElBQUksQ0FBQztBQUFBOztBQUVwSDtBQUNBO0FBQ0E7QUFDQTtBQUNB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