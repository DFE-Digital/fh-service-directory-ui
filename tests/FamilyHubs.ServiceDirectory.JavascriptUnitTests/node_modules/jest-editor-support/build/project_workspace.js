"use strict";

require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.createProjectWorkspace = void 0;
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.number.constructor.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/**
 * a LoginShell holds the shell path and arguments to
 * start an login/interactive shell
 */
/**
 * Represents the project that the extension is running on and it's state
 */
var ProjectWorkspace = /*#__PURE__*/function () {
  function ProjectWorkspace(rootPath, jestCommandLine, pathToConfig, localJestMajorVersion, outputFileSuffix, collectCoverage, debug, nodeEnv, shell) {
    _classCallCheck(this, ProjectWorkspace);
    this.rootPath = rootPath;
    this.jestCommandLine = jestCommandLine;
    this.pathToConfig = pathToConfig;
    this.localJestMajorVersion = localJestMajorVersion;
    this.outputFileSuffix = outputFileSuffix ? outputFileSuffix.replace(/[^a-z0-9]/gi, '_').toLowerCase() : undefined;
    this.collectCoverage = collectCoverage;
    this.debug = debug;
    this.nodeEnv = nodeEnv;
    this.shell = shell;
  }
  _createClass(ProjectWorkspace, [{
    key: "pathToJest",
    get:
    /**
     * The path to the root of the project's workspace
     *
     * @type {string}
     */

    /**
     * The command to execute Jest on the command line, this is normally a file path like
     * `node_modules/.bin/jest` but you should not make the assumption that it is always a direct
     * file path, as in a create-react app it would look like `npm test --`.
     *
     * This means when launching a process, you will need to split on the first
     * space, and then move any other args into the args of the process.
     *
     * @type {string}
     */

    /**
     * @deprecated please use `jestCommandLine` instead.
     *
     * @type {string?}
     */
    function get() {
      // eslint-disable-next-line no-console
      console.warn('Use of ProjectWorkspace.pathToJest is deprecated.  Please use jestCommandLine instead.');
      return this.jestCommandLine;
    },
    set: function set(commandLine) {
      // eslint-disable-next-line no-console
      console.warn('Use of ProjectWorkspace.pathToJest is deprecated.  Please use jestCommandLine instead.');
      this.jestCommandLine = commandLine;
    }

    /**
     * Path to a local Jest config file.
     *
     * @type {string}
     */
  }]);
  return ProjectWorkspace;
}();
/**
 * A factory to create a ProjectWorkspace instance from a ProjectWorkspaceConfig object.
 */
exports["default"] = ProjectWorkspace;
var createProjectWorkspace = function createProjectWorkspace(config) {
  // Note for pathToConfig we are forcing the TS compiler to accept undefined for ProjectWorkspace.pathToConfig.
  // This property should be allowed to be optional, since Jest will work fine if no config file is provided.  It
  // will just use defaults.
  return new ProjectWorkspace(config.rootPath, config.jestCommandLine, config.pathToConfig, config.localJestMajorVersion, config.outputFileSuffix, config.collectCoverage, config.debug, config.nodeEnv, config.shell);
};
exports.createProjectWorkspace = createProjectWorkspace;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQcm9qZWN0V29ya3NwYWNlIiwicm9vdFBhdGgiLCJqZXN0Q29tbWFuZExpbmUiLCJwYXRoVG9Db25maWciLCJsb2NhbEplc3RNYWpvclZlcnNpb24iLCJvdXRwdXRGaWxlU3VmZml4IiwiY29sbGVjdENvdmVyYWdlIiwiZGVidWciLCJub2RlRW52Iiwic2hlbGwiLCJyZXBsYWNlIiwidG9Mb3dlckNhc2UiLCJ1bmRlZmluZWQiLCJjb25zb2xlIiwid2FybiIsImNvbW1hbmRMaW5lIiwiY3JlYXRlUHJvamVjdFdvcmtzcGFjZSIsImNvbmZpZyJdLCJzb3VyY2VzIjpbIi4uL3NyYy9wcm9qZWN0X3dvcmtzcGFjZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqL1xuXG4vKipcbiAqIGEgTG9naW5TaGVsbCBob2xkcyB0aGUgc2hlbGwgcGF0aCBhbmQgYXJndW1lbnRzIHRvXG4gKiBzdGFydCBhbiBsb2dpbi9pbnRlcmFjdGl2ZSBzaGVsbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIExvZ2luU2hlbGwge1xuICAvKiogc2hlbGwgZXhlY3V0YWJsZSBwYXRoICovXG4gIHBhdGg6IHN0cmluZztcbiAgLyoqIHNoZWxsIGFyZ3VtZW50cyAqL1xuICBhcmdzOiBzdHJpbmdbXTtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgUHJvamVjdFdvcmtzcGFjZUNvbmZpZyB7XG4gIGplc3RDb21tYW5kTGluZTogc3RyaW5nO1xuICBwYXRoVG9Db25maWc/OiBzdHJpbmc7XG4gIHJvb3RQYXRoOiBzdHJpbmc7XG4gIGxvY2FsSmVzdE1ham9yVmVyc2lvbjogbnVtYmVyO1xuICBvdXRwdXRGaWxlU3VmZml4Pzogc3RyaW5nO1xuICBjb2xsZWN0Q292ZXJhZ2U/OiBib29sZWFuO1xuICBkZWJ1Zz86IGJvb2xlYW47XG4gIG5vZGVFbnY/OiB7W2tleTogc3RyaW5nXTogc3RyaW5nIHwgdW5kZWZpbmVkfTtcbiAgc2hlbGw/OiBzdHJpbmcgfCBMb2dpblNoZWxsO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIHByb2plY3QgdGhhdCB0aGUgZXh0ZW5zaW9uIGlzIHJ1bm5pbmcgb24gYW5kIGl0J3Mgc3RhdGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvamVjdFdvcmtzcGFjZSB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCB0byB0aGUgcm9vdCBvZiB0aGUgcHJvamVjdCdzIHdvcmtzcGFjZVxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgcm9vdFBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNvbW1hbmQgdG8gZXhlY3V0ZSBKZXN0IG9uIHRoZSBjb21tYW5kIGxpbmUsIHRoaXMgaXMgbm9ybWFsbHkgYSBmaWxlIHBhdGggbGlrZVxuICAgKiBgbm9kZV9tb2R1bGVzLy5iaW4vamVzdGAgYnV0IHlvdSBzaG91bGQgbm90IG1ha2UgdGhlIGFzc3VtcHRpb24gdGhhdCBpdCBpcyBhbHdheXMgYSBkaXJlY3RcbiAgICogZmlsZSBwYXRoLCBhcyBpbiBhIGNyZWF0ZS1yZWFjdCBhcHAgaXQgd291bGQgbG9vayBsaWtlIGBucG0gdGVzdCAtLWAuXG4gICAqXG4gICAqIFRoaXMgbWVhbnMgd2hlbiBsYXVuY2hpbmcgYSBwcm9jZXNzLCB5b3Ugd2lsbCBuZWVkIHRvIHNwbGl0IG9uIHRoZSBmaXJzdFxuICAgKiBzcGFjZSwgYW5kIHRoZW4gbW92ZSBhbnkgb3RoZXIgYXJncyBpbnRvIHRoZSBhcmdzIG9mIHRoZSBwcm9jZXNzLlxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgamVzdENvbW1hbmRMaW5lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIHBsZWFzZSB1c2UgYGplc3RDb21tYW5kTGluZWAgaW5zdGVhZC5cbiAgICpcbiAgICogQHR5cGUge3N0cmluZz99XG4gICAqL1xuICBnZXQgcGF0aFRvSmVzdCgpOiBzdHJpbmcge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS53YXJuKCdVc2Ugb2YgUHJvamVjdFdvcmtzcGFjZS5wYXRoVG9KZXN0IGlzIGRlcHJlY2F0ZWQuICBQbGVhc2UgdXNlIGplc3RDb21tYW5kTGluZSBpbnN0ZWFkLicpO1xuICAgIHJldHVybiB0aGlzLmplc3RDb21tYW5kTGluZTtcbiAgfVxuXG4gIHNldCBwYXRoVG9KZXN0KGNvbW1hbmRMaW5lOiBzdHJpbmcpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUud2FybignVXNlIG9mIFByb2plY3RXb3Jrc3BhY2UucGF0aFRvSmVzdCBpcyBkZXByZWNhdGVkLiAgUGxlYXNlIHVzZSBqZXN0Q29tbWFuZExpbmUgaW5zdGVhZC4nKTtcbiAgICB0aGlzLmplc3RDb21tYW5kTGluZSA9IGNvbW1hbmRMaW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhdGggdG8gYSBsb2NhbCBKZXN0IGNvbmZpZyBmaWxlLlxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKi9cbiAgcGF0aFRvQ29uZmlnOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGxvY2FsIEplc3QgbWFqb3IgcmVsZWFzZSB2ZXJzaW9uLCBhcyB0aGUgcnVubmVyIGNvdWxkIHJ1biBhZ2FpbnN0XG4gICAqIGFueSB2ZXJzaW9uIG9mIEplc3QuXG4gICAqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqL1xuICBsb2NhbEplc3RNYWpvclZlcnNpb246IG51bWJlcjtcblxuICAvKipcbiAgICogV2hldGhlciB0ZXN0IGNvdmVyYWdlIHNob3VsZCBiZSAoYXV0b21hdGljYWxseSkgY29sbGVjdGVkLlxuICAgKlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIGNvbGxlY3RDb3ZlcmFnZT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIGlmIHRvIG91dHB1dCBtb3JlIGluZm9ybWF0aW9uIGZvciBkZWJ1Z2dpbmcgcHVycG9zZS4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICpcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBkZWJ1Zz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIHN1ZmZpeCBzdHJpbmcgdXNlZCBhcyBwYXJ0IG9mIHRoZSBvdXRwdXQgZmlsZSBwYXRoLCB0aGlzIGlzIHRvIHN1cHBvcnQgY29uY3VycmVudCBSdW5uZXJzLlxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAbWVtYmVyb2YgUHJvamVjdFdvcmtzcGFjZVxuICAgKi9cbiAgb3V0cHV0RmlsZVN1ZmZpeD86IHN0cmluZztcblxuICAvKipcbiAgICogb3B0aW9uYWwgYWRkaXRpb25hbCBub2RlIGVudiB2YXJpYWJsZXNcbiAgICovXG4gIG5vZGVFbnY/OiB7W2tleTogc3RyaW5nXTogc3RyaW5nIHwgdW5kZWZpbmVkfTtcblxuICAvKipcbiAgICogb3B0aW9uYWwgY3VzdG9tIHNoZWxsIGZvciBub2RlIGNoaWxkX3Byb2Nlc3Mgc3Bhd24oKSBjYWxsLiBEZWZhdWx0IGlzICcvYmluL3NoJyBvbiBVbml4LCBhbmQgcHJvY2Vzcy5lbnYuQ29tU3BlYyBvbiBXaW5kb3dzLlxuICAgKiBzZWUgaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9jaGlsZF9wcm9jZXNzLmh0bWwjY2hpbGRfcHJvY2Vzc19jaGlsZF9wcm9jZXNzX3NwYXduX2NvbW1hbmRfYXJnc19vcHRpb25zXG4gICAqXG4gICAqIElmIGEgc3RyaW5nIGlzIHBhc3NlZCBpbiwgYSBub24tbG9naW4vbm9uLWludGVyYWN0aXZlIHNoZWxsIHdpbGwgYmUgdXNlZCB0byBzcGF3biB0aGUgY2hpbGRfcHJvY2Vzc1xuICAgKiBJZiBhIHRlcm1pbmFsLXNoZWxsIGlzIHBhc3NlZCwgYSBsb2dpbi9pbnRlcmFjdGl2ZSBzaGVsbCB3aWxsIGJlIHVzZWQgdG8gc3Bhd24gdGhlIGNoaWxkX3Byb2Nlc3MuIFRoaXMgaXMgbm90IGFzIGVmZmljaWVudCBhc1xuICAgKiB0aGUgbm9uLWxvZ2luL25vbi1pbnRlcmFjdGl2ZSBzaGVsbCwgYnV0IG1pZ2h0IGJlIG5lZWRlZCBpZiBwYXJlbnQgZW52aXJvbm1lbnQgaXMgbm90IGd1YXJlbnRlZWQgdG8gYmUgcHJvcGVybHkgaW5pdGlhbGl6ZWRcbiAgICogKHNlZSBodHRwczovL2dpdGh1Yi5jb20vamVzdC1jb21tdW5pdHkvdnNjb2RlLWplc3QvaXNzdWVzLzc0MSlcbiAgICovXG4gIHNoZWxsPzogc3RyaW5nIHwgTG9naW5TaGVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICByb290UGF0aDogc3RyaW5nLFxuICAgIGplc3RDb21tYW5kTGluZTogc3RyaW5nLFxuICAgIHBhdGhUb0NvbmZpZzogc3RyaW5nLFxuICAgIGxvY2FsSmVzdE1ham9yVmVyc2lvbjogbnVtYmVyLFxuICAgIG91dHB1dEZpbGVTdWZmaXg/OiBzdHJpbmcsXG4gICAgY29sbGVjdENvdmVyYWdlPzogYm9vbGVhbixcbiAgICBkZWJ1Zz86IGJvb2xlYW4sXG4gICAgbm9kZUVudj86IHtba2V5OiBzdHJpbmddOiBzdHJpbmcgfCB1bmRlZmluZWR9LFxuICAgIHNoZWxsPzogc3RyaW5nIHwgTG9naW5TaGVsbFxuICApIHtcbiAgICB0aGlzLnJvb3RQYXRoID0gcm9vdFBhdGg7XG4gICAgdGhpcy5qZXN0Q29tbWFuZExpbmUgPSBqZXN0Q29tbWFuZExpbmU7XG4gICAgdGhpcy5wYXRoVG9Db25maWcgPSBwYXRoVG9Db25maWc7XG4gICAgdGhpcy5sb2NhbEplc3RNYWpvclZlcnNpb24gPSBsb2NhbEplc3RNYWpvclZlcnNpb247XG4gICAgdGhpcy5vdXRwdXRGaWxlU3VmZml4ID0gb3V0cHV0RmlsZVN1ZmZpeCA/IG91dHB1dEZpbGVTdWZmaXgucmVwbGFjZSgvW15hLXowLTldL2dpLCAnXycpLnRvTG93ZXJDYXNlKCkgOiB1bmRlZmluZWQ7XG4gICAgdGhpcy5jb2xsZWN0Q292ZXJhZ2UgPSBjb2xsZWN0Q292ZXJhZ2U7XG4gICAgdGhpcy5kZWJ1ZyA9IGRlYnVnO1xuICAgIHRoaXMubm9kZUVudiA9IG5vZGVFbnY7XG4gICAgdGhpcy5zaGVsbCA9IHNoZWxsO1xuICB9XG59XG5cbi8qKlxuICogQSBmYWN0b3J5IHRvIGNyZWF0ZSBhIFByb2plY3RXb3Jrc3BhY2UgaW5zdGFuY2UgZnJvbSBhIFByb2plY3RXb3Jrc3BhY2VDb25maWcgb2JqZWN0LlxuICovXG5leHBvcnQgY29uc3QgY3JlYXRlUHJvamVjdFdvcmtzcGFjZSA9IChjb25maWc6IFByb2plY3RXb3Jrc3BhY2VDb25maWcpOiBQcm9qZWN0V29ya3NwYWNlID0+IHtcbiAgLy8gTm90ZSBmb3IgcGF0aFRvQ29uZmlnIHdlIGFyZSBmb3JjaW5nIHRoZSBUUyBjb21waWxlciB0byBhY2NlcHQgdW5kZWZpbmVkIGZvciBQcm9qZWN0V29ya3NwYWNlLnBhdGhUb0NvbmZpZy5cbiAgLy8gVGhpcyBwcm9wZXJ0eSBzaG91bGQgYmUgYWxsb3dlZCB0byBiZSBvcHRpb25hbCwgc2luY2UgSmVzdCB3aWxsIHdvcmsgZmluZSBpZiBubyBjb25maWcgZmlsZSBpcyBwcm92aWRlZC4gIEl0XG4gIC8vIHdpbGwganVzdCB1c2UgZGVmYXVsdHMuXG4gIHJldHVybiBuZXcgUHJvamVjdFdvcmtzcGFjZShcbiAgICBjb25maWcucm9vdFBhdGgsXG4gICAgY29uZmlnLmplc3RDb21tYW5kTGluZSxcbiAgICBjb25maWcucGF0aFRvQ29uZmlnIGFzIHVua25vd24gYXMgc3RyaW5nLFxuICAgIGNvbmZpZy5sb2NhbEplc3RNYWpvclZlcnNpb24sXG4gICAgY29uZmlnLm91dHB1dEZpbGVTdWZmaXgsXG4gICAgY29uZmlnLmNvbGxlY3RDb3ZlcmFnZSxcbiAgICBjb25maWcuZGVidWcsXG4gICAgY29uZmlnLm5vZGVFbnYsXG4gICAgY29uZmlnLnNoZWxsXG4gICk7XG59O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQW1CQTtBQUNBO0FBQ0E7QUFGQSxJQUdxQkEsZ0JBQWdCO0VBMEZuQywwQkFDRUMsUUFBZ0IsRUFDaEJDLGVBQXVCLEVBQ3ZCQyxZQUFvQixFQUNwQkMscUJBQTZCLEVBQzdCQyxnQkFBeUIsRUFDekJDLGVBQXlCLEVBQ3pCQyxLQUFlLEVBQ2ZDLE9BQTZDLEVBQzdDQyxLQUEyQixFQUMzQjtJQUFBO0lBQ0EsSUFBSSxDQUFDUixRQUFRLEdBQUdBLFFBQVE7SUFDeEIsSUFBSSxDQUFDQyxlQUFlLEdBQUdBLGVBQWU7SUFDdEMsSUFBSSxDQUFDQyxZQUFZLEdBQUdBLFlBQVk7SUFDaEMsSUFBSSxDQUFDQyxxQkFBcUIsR0FBR0EscUJBQXFCO0lBQ2xELElBQUksQ0FBQ0MsZ0JBQWdCLEdBQUdBLGdCQUFnQixHQUFHQSxnQkFBZ0IsQ0FBQ0ssT0FBTyxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQ0MsV0FBVyxFQUFFLEdBQUdDLFNBQVM7SUFDakgsSUFBSSxDQUFDTixlQUFlLEdBQUdBLGVBQWU7SUFDdEMsSUFBSSxDQUFDQyxLQUFLLEdBQUdBLEtBQUs7SUFDbEIsSUFBSSxDQUFDQyxPQUFPLEdBQUdBLE9BQU87SUFDdEIsSUFBSSxDQUFDQyxLQUFLLEdBQUdBLEtBQUs7RUFDcEI7RUFBQztJQUFBO0lBQUE7SUE3R0Q7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7SUFHRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7SUFHRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0lBQ0UsZUFBeUI7TUFDdkI7TUFDQUksT0FBTyxDQUFDQyxJQUFJLENBQUMsd0ZBQXdGLENBQUM7TUFDdEcsT0FBTyxJQUFJLENBQUNaLGVBQWU7SUFDN0IsQ0FBQztJQUFBLEtBRUQsYUFBZWEsV0FBbUIsRUFBRTtNQUNsQztNQUNBRixPQUFPLENBQUNDLElBQUksQ0FBQyx3RkFBd0YsQ0FBQztNQUN0RyxJQUFJLENBQUNaLGVBQWUsR0FBR2EsV0FBVztJQUNwQzs7SUFFQTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0VBSkU7RUFBQTtBQUFBO0FBNEVGO0FBQ0E7QUFDQTtBQUZBO0FBR08sSUFBTUMsc0JBQXNCLEdBQUcsU0FBekJBLHNCQUFzQixDQUFJQyxNQUE4QixFQUF1QjtFQUMxRjtFQUNBO0VBQ0E7RUFDQSxPQUFPLElBQUlqQixnQkFBZ0IsQ0FDekJpQixNQUFNLENBQUNoQixRQUFRLEVBQ2ZnQixNQUFNLENBQUNmLGVBQWUsRUFDdEJlLE1BQU0sQ0FBQ2QsWUFBWSxFQUNuQmMsTUFBTSxDQUFDYixxQkFBcUIsRUFDNUJhLE1BQU0sQ0FBQ1osZ0JBQWdCLEVBQ3ZCWSxNQUFNLENBQUNYLGVBQWUsRUFDdEJXLE1BQU0sQ0FBQ1YsS0FBSyxFQUNaVSxNQUFNLENBQUNULE9BQU8sRUFDZFMsTUFBTSxDQUFDUixLQUFLLENBQ2I7QUFDSCxDQUFDO0FBQUMifQ==