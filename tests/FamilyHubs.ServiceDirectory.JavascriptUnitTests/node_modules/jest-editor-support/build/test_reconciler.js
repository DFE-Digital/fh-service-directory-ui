"use strict";

require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
require("core-js/modules/es.array.for-each.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/web.dom-collections.for-each.js");
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.array.map.js");
require("core-js/modules/es.string.trim.js");
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.replace.js");
require("core-js/modules/es.array.join.js");
require("core-js/modules/es.array.splice.js");
require("core-js/modules/es.string.split.js");
require("core-js/modules/es.parse-int.js");
require("core-js/modules/es.array.find.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.number.constructor.js");
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 *  You have a Jest test runner watching for changes, and you have
 *  an extension that wants to know where to show errors after file parsing.
 *
 *  This class represents the state between runs, keeping track of passes/fails
 *  at a file level, generating useful error messages and providing a nice API.
 */
var TestReconciler = /*#__PURE__*/function () {
  function TestReconciler() {
    _classCallCheck(this, TestReconciler);
    this.fileStatuses = {};
  }

  // the processed test results will be returned immediately instead of saved in
  // instance properties. This is 1) to prevent race condition 2) the data is already
  // stored in the this.fileStatuses, no dup is better 3) client will most likely need to process
  // all the results anyway.
  _createClass(TestReconciler, [{
    key: "updateFileWithJestStatus",
    value: function updateFileWithJestStatus(results) {
      var _this = this;
      // Loop through all files inside the report from Jest
      var statusList = [];
      results.testResults.forEach(function (file) {
        // Did the file pass/fail?
        var status = _this.statusToReconcilationState(file.status);
        // Create our own simpler representation
        var fileStatus = {
          assertions: _this.mapAssertions(file.name, file.assertionResults),
          file: file.name,
          message: file.message,
          status: status
        };
        _this.fileStatuses[file.name] = fileStatus;
        statusList.push(fileStatus);
      });
      return statusList;
    }

    /**
     * remove jest status of the test file from the cached results
     * @param {string} fileName
     */
  }, {
    key: "removeTestFile",
    value: function removeTestFile(fileName) {
      delete this.fileStatuses[fileName];
    }

    // A failed test also contains the stack trace for an `expect`
    // we don't get this as structured data, but what we get
    // is useful enough to make it for ourselves
  }, {
    key: "mapAssertions",
    value: function mapAssertions(filename, assertions) {
      var _this2 = this;
      // convert jest location (column is 0-based and line is 1-based) to all 0-based location used internally in this package
      /* eslint-disable no-param-reassign */
      var convertJestLocation = function convertJestLocation(jestLocation) {
        if (jestLocation) {
          jestLocation.line -= 1;
        }
        return jestLocation;
      };
      // Is it jest < 17? e.g. Before I added this to the JSON
      if (!assertions) {
        return [];
      }

      // Change all failing assertions into structured data
      return assertions.map(function (assertion) {
        // Failure messages seems to always be an array of one item
        var message = assertion.failureMessages && assertion.failureMessages[0];
        var _short = null;
        var terse = null;
        var line = null;
        var location = convertJestLocation(assertion.location); // output from jest --testLocationInResults (https://jestjs.io/docs/en/cli#testlocationinresults)
        if (message) {
          // Just the first line, with little whitespace
          _short = message.split('   at', 1)[0].trim();
          // this will show inline, so we want to show very little
          terse = _this2.sanitizeShortErrorMessage(_short);
          line = _this2.lineOfError(message, filename);
        }
        return {
          line: line,
          message: message || '',
          shortMessage: _short,
          status: _this2.statusToReconcilationState(assertion.status),
          terseMessage: terse,
          title: assertion.title,
          location: location,
          fullName: assertion.fullName,
          ancestorTitles: assertion.ancestorTitles
        };
      });
    }

    // Do everything we can to try make a one-liner from the error report
  }, {
    key: "sanitizeShortErrorMessage",
    value: function sanitizeShortErrorMessage(string) {
      if (string.includes('does not match stored snapshot')) {
        return 'Snapshot has changed';
      }
      if (string.includes('New snapshot was not written')) {
        return 'New snapshot is ready to write';
      }
      return string.split('\n').splice(2).join('').replace(/\s\s+/g, ' ').replace('Received:', ', Received:').split('Difference:')[0];
    }

    // Pull the line out from the stack trace
  }, {
    key: "lineOfError",
    value: function lineOfError(message, filePath) {
      var filename = _path["default"].basename(filePath);
      var restOfTrace = message.split(filename, 2)[1];
      return restOfTrace ? parseInt(restOfTrace.split(':')[1], 10) : null;
    }
  }, {
    key: "statusToReconcilationState",
    value: function statusToReconcilationState(status) {
      switch (status) {
        case 'passed':
          return 'KnownSuccess';
        case 'failed':
          return 'KnownFail';
        case 'pending':
          return 'KnownSkip';
        case 'todo':
          return 'KnownTodo';
        default:
          return 'Unknown';
      }
    }
  }, {
    key: "stateForTestFile",
    value: function stateForTestFile(file) {
      var results = this.fileStatuses[file];
      if (!results) {
        return 'Unknown';
      }
      return results.status;
    }
  }, {
    key: "assertionsForTestFile",
    value: function assertionsForTestFile(file) {
      var results = this.fileStatuses[file];
      return results ? results.assertions : null;
    }
  }, {
    key: "stateForTestAssertion",
    value: function stateForTestAssertion(file, name) {
      var results = this.fileStatuses[file];
      if (!results || !results.assertions) {
        return null;
      }
      var assertion = results.assertions.find(function (a) {
        return a.title === name;
      });
      if (!assertion) {
        return null;
      }
      return assertion;
    }
  }]);
  return TestReconciler;
}();
exports["default"] = TestReconciler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJUZXN0UmVjb25jaWxlciIsImZpbGVTdGF0dXNlcyIsInJlc3VsdHMiLCJzdGF0dXNMaXN0IiwidGVzdFJlc3VsdHMiLCJmb3JFYWNoIiwiZmlsZSIsInN0YXR1cyIsInN0YXR1c1RvUmVjb25jaWxhdGlvblN0YXRlIiwiZmlsZVN0YXR1cyIsImFzc2VydGlvbnMiLCJtYXBBc3NlcnRpb25zIiwibmFtZSIsImFzc2VydGlvblJlc3VsdHMiLCJtZXNzYWdlIiwicHVzaCIsImZpbGVOYW1lIiwiZmlsZW5hbWUiLCJjb252ZXJ0SmVzdExvY2F0aW9uIiwiamVzdExvY2F0aW9uIiwibGluZSIsIm1hcCIsImFzc2VydGlvbiIsImZhaWx1cmVNZXNzYWdlcyIsInNob3J0IiwidGVyc2UiLCJsb2NhdGlvbiIsInNwbGl0IiwidHJpbSIsInNhbml0aXplU2hvcnRFcnJvck1lc3NhZ2UiLCJsaW5lT2ZFcnJvciIsInNob3J0TWVzc2FnZSIsInRlcnNlTWVzc2FnZSIsInRpdGxlIiwiZnVsbE5hbWUiLCJhbmNlc3RvclRpdGxlcyIsInN0cmluZyIsImluY2x1ZGVzIiwic3BsaWNlIiwiam9pbiIsInJlcGxhY2UiLCJmaWxlUGF0aCIsInBhdGgiLCJiYXNlbmFtZSIsInJlc3RPZlRyYWNlIiwicGFyc2VJbnQiLCJmaW5kIiwiYSJdLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0X3JlY29uY2lsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgY2xhc3MtbWV0aG9kcy11c2UtdGhpcyAqL1xuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqXG4gKiBAZmxvd1xuICovXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHR5cGUge1Rlc3RGaWxlQXNzZXJ0aW9uU3RhdHVzLCBUZXN0QXNzZXJ0aW9uU3RhdHVzLCBUZXN0UmVjb25jaWxpYXRpb25TdGF0ZSwgTG9jYXRpb259IGZyb20gJy4vdHlwZXMnO1xuXG5pbXBvcnQgdHlwZSB7Rm9ybWF0dGVkQXNzZXJ0aW9uUmVzdWx0LCBGb3JtYXR0ZWRUZXN0UmVzdWx0c30gZnJvbSAnLi4vdHlwZXMvVGVzdFJlc3VsdCc7XG5cbi8qKlxuICogIFlvdSBoYXZlIGEgSmVzdCB0ZXN0IHJ1bm5lciB3YXRjaGluZyBmb3IgY2hhbmdlcywgYW5kIHlvdSBoYXZlXG4gKiAgYW4gZXh0ZW5zaW9uIHRoYXQgd2FudHMgdG8ga25vdyB3aGVyZSB0byBzaG93IGVycm9ycyBhZnRlciBmaWxlIHBhcnNpbmcuXG4gKlxuICogIFRoaXMgY2xhc3MgcmVwcmVzZW50cyB0aGUgc3RhdGUgYmV0d2VlbiBydW5zLCBrZWVwaW5nIHRyYWNrIG9mIHBhc3Nlcy9mYWlsc1xuICogIGF0IGEgZmlsZSBsZXZlbCwgZ2VuZXJhdGluZyB1c2VmdWwgZXJyb3IgbWVzc2FnZXMgYW5kIHByb3ZpZGluZyBhIG5pY2UgQVBJLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXN0UmVjb25jaWxlciB7XG4gIGZpbGVTdGF0dXNlczoge1trZXk6IHN0cmluZ106IFRlc3RGaWxlQXNzZXJ0aW9uU3RhdHVzfTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmZpbGVTdGF0dXNlcyA9IHt9O1xuICB9XG5cbiAgLy8gdGhlIHByb2Nlc3NlZCB0ZXN0IHJlc3VsdHMgd2lsbCBiZSByZXR1cm5lZCBpbW1lZGlhdGVseSBpbnN0ZWFkIG9mIHNhdmVkIGluXG4gIC8vIGluc3RhbmNlIHByb3BlcnRpZXMuIFRoaXMgaXMgMSkgdG8gcHJldmVudCByYWNlIGNvbmRpdGlvbiAyKSB0aGUgZGF0YSBpcyBhbHJlYWR5XG4gIC8vIHN0b3JlZCBpbiB0aGUgdGhpcy5maWxlU3RhdHVzZXMsIG5vIGR1cCBpcyBiZXR0ZXIgMykgY2xpZW50IHdpbGwgbW9zdCBsaWtlbHkgbmVlZCB0byBwcm9jZXNzXG4gIC8vIGFsbCB0aGUgcmVzdWx0cyBhbnl3YXkuXG4gIHVwZGF0ZUZpbGVXaXRoSmVzdFN0YXR1cyhyZXN1bHRzOiBGb3JtYXR0ZWRUZXN0UmVzdWx0cyk6IFRlc3RGaWxlQXNzZXJ0aW9uU3RhdHVzW10ge1xuICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgZmlsZXMgaW5zaWRlIHRoZSByZXBvcnQgZnJvbSBKZXN0XG4gICAgY29uc3Qgc3RhdHVzTGlzdDogVGVzdEZpbGVBc3NlcnRpb25TdGF0dXNbXSA9IFtdO1xuICAgIHJlc3VsdHMudGVzdFJlc3VsdHMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgLy8gRGlkIHRoZSBmaWxlIHBhc3MvZmFpbD9cbiAgICAgIGNvbnN0IHN0YXR1cyA9IHRoaXMuc3RhdHVzVG9SZWNvbmNpbGF0aW9uU3RhdGUoZmlsZS5zdGF0dXMpO1xuICAgICAgLy8gQ3JlYXRlIG91ciBvd24gc2ltcGxlciByZXByZXNlbnRhdGlvblxuICAgICAgY29uc3QgZmlsZVN0YXR1czogVGVzdEZpbGVBc3NlcnRpb25TdGF0dXMgPSB7XG4gICAgICAgIGFzc2VydGlvbnM6IHRoaXMubWFwQXNzZXJ0aW9ucyhmaWxlLm5hbWUsIGZpbGUuYXNzZXJ0aW9uUmVzdWx0cyksXG4gICAgICAgIGZpbGU6IGZpbGUubmFtZSxcbiAgICAgICAgbWVzc2FnZTogZmlsZS5tZXNzYWdlLFxuICAgICAgICBzdGF0dXMsXG4gICAgICB9O1xuICAgICAgdGhpcy5maWxlU3RhdHVzZXNbZmlsZS5uYW1lXSA9IGZpbGVTdGF0dXM7XG4gICAgICBzdGF0dXNMaXN0LnB1c2goZmlsZVN0YXR1cyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0YXR1c0xpc3Q7XG4gIH1cblxuICAvKipcbiAgICogcmVtb3ZlIGplc3Qgc3RhdHVzIG9mIHRoZSB0ZXN0IGZpbGUgZnJvbSB0aGUgY2FjaGVkIHJlc3VsdHNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVOYW1lXG4gICAqL1xuICByZW1vdmVUZXN0RmlsZShmaWxlTmFtZTogc3RyaW5nKSB7XG4gICAgZGVsZXRlIHRoaXMuZmlsZVN0YXR1c2VzW2ZpbGVOYW1lXTtcbiAgfVxuXG4gIC8vIEEgZmFpbGVkIHRlc3QgYWxzbyBjb250YWlucyB0aGUgc3RhY2sgdHJhY2UgZm9yIGFuIGBleHBlY3RgXG4gIC8vIHdlIGRvbid0IGdldCB0aGlzIGFzIHN0cnVjdHVyZWQgZGF0YSwgYnV0IHdoYXQgd2UgZ2V0XG4gIC8vIGlzIHVzZWZ1bCBlbm91Z2ggdG8gbWFrZSBpdCBmb3Igb3Vyc2VsdmVzXG5cbiAgbWFwQXNzZXJ0aW9ucyhmaWxlbmFtZTogc3RyaW5nLCBhc3NlcnRpb25zOiBBcnJheTxGb3JtYXR0ZWRBc3NlcnRpb25SZXN1bHQ+KTogQXJyYXk8VGVzdEFzc2VydGlvblN0YXR1cz4ge1xuICAgIC8vIGNvbnZlcnQgamVzdCBsb2NhdGlvbiAoY29sdW1uIGlzIDAtYmFzZWQgYW5kIGxpbmUgaXMgMS1iYXNlZCkgdG8gYWxsIDAtYmFzZWQgbG9jYXRpb24gdXNlZCBpbnRlcm5hbGx5IGluIHRoaXMgcGFja2FnZVxuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG4gICAgY29uc3QgY29udmVydEplc3RMb2NhdGlvbiA9IChqZXN0TG9jYXRpb246ID9Mb2NhdGlvbikgPT4ge1xuICAgICAgaWYgKGplc3RMb2NhdGlvbikge1xuICAgICAgICBqZXN0TG9jYXRpb24ubGluZSAtPSAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGplc3RMb2NhdGlvbjtcbiAgICB9O1xuICAgIC8vIElzIGl0IGplc3QgPCAxNz8gZS5nLiBCZWZvcmUgSSBhZGRlZCB0aGlzIHRvIHRoZSBKU09OXG4gICAgaWYgKCFhc3NlcnRpb25zKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgLy8gQ2hhbmdlIGFsbCBmYWlsaW5nIGFzc2VydGlvbnMgaW50byBzdHJ1Y3R1cmVkIGRhdGFcbiAgICByZXR1cm4gYXNzZXJ0aW9ucy5tYXAoKGFzc2VydGlvbikgPT4ge1xuICAgICAgLy8gRmFpbHVyZSBtZXNzYWdlcyBzZWVtcyB0byBhbHdheXMgYmUgYW4gYXJyYXkgb2Ygb25lIGl0ZW1cbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBhc3NlcnRpb24uZmFpbHVyZU1lc3NhZ2VzICYmIGFzc2VydGlvbi5mYWlsdXJlTWVzc2FnZXNbMF07XG4gICAgICBsZXQgc2hvcnQgPSBudWxsO1xuICAgICAgbGV0IHRlcnNlID0gbnVsbDtcbiAgICAgIGxldCBsaW5lID0gbnVsbDtcbiAgICAgIGNvbnN0IGxvY2F0aW9uID0gY29udmVydEplc3RMb2NhdGlvbihhc3NlcnRpb24ubG9jYXRpb24pOyAvLyBvdXRwdXQgZnJvbSBqZXN0IC0tdGVzdExvY2F0aW9uSW5SZXN1bHRzIChodHRwczovL2plc3Rqcy5pby9kb2NzL2VuL2NsaSN0ZXN0bG9jYXRpb25pbnJlc3VsdHMpXG4gICAgICBpZiAobWVzc2FnZSkge1xuICAgICAgICAvLyBKdXN0IHRoZSBmaXJzdCBsaW5lLCB3aXRoIGxpdHRsZSB3aGl0ZXNwYWNlXG4gICAgICAgIHNob3J0ID0gbWVzc2FnZS5zcGxpdCgnICAgYXQnLCAxKVswXS50cmltKCk7XG4gICAgICAgIC8vIHRoaXMgd2lsbCBzaG93IGlubGluZSwgc28gd2Ugd2FudCB0byBzaG93IHZlcnkgbGl0dGxlXG4gICAgICAgIHRlcnNlID0gdGhpcy5zYW5pdGl6ZVNob3J0RXJyb3JNZXNzYWdlKHNob3J0KTtcbiAgICAgICAgbGluZSA9IHRoaXMubGluZU9mRXJyb3IobWVzc2FnZSwgZmlsZW5hbWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGluZSxcbiAgICAgICAgbWVzc2FnZTogbWVzc2FnZSB8fCAnJyxcbiAgICAgICAgc2hvcnRNZXNzYWdlOiBzaG9ydCxcbiAgICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1c1RvUmVjb25jaWxhdGlvblN0YXRlKGFzc2VydGlvbi5zdGF0dXMpLFxuICAgICAgICB0ZXJzZU1lc3NhZ2U6IHRlcnNlLFxuICAgICAgICB0aXRsZTogYXNzZXJ0aW9uLnRpdGxlLFxuICAgICAgICBsb2NhdGlvbixcbiAgICAgICAgZnVsbE5hbWU6IGFzc2VydGlvbi5mdWxsTmFtZSxcbiAgICAgICAgYW5jZXN0b3JUaXRsZXM6IGFzc2VydGlvbi5hbmNlc3RvclRpdGxlcyxcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cblxuICAvLyBEbyBldmVyeXRoaW5nIHdlIGNhbiB0byB0cnkgbWFrZSBhIG9uZS1saW5lciBmcm9tIHRoZSBlcnJvciByZXBvcnRcbiAgc2FuaXRpemVTaG9ydEVycm9yTWVzc2FnZShzdHJpbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKHN0cmluZy5pbmNsdWRlcygnZG9lcyBub3QgbWF0Y2ggc3RvcmVkIHNuYXBzaG90JykpIHtcbiAgICAgIHJldHVybiAnU25hcHNob3QgaGFzIGNoYW5nZWQnO1xuICAgIH1cblxuICAgIGlmIChzdHJpbmcuaW5jbHVkZXMoJ05ldyBzbmFwc2hvdCB3YXMgbm90IHdyaXR0ZW4nKSkge1xuICAgICAgcmV0dXJuICdOZXcgc25hcHNob3QgaXMgcmVhZHkgdG8gd3JpdGUnO1xuICAgIH1cblxuICAgIHJldHVybiBzdHJpbmdcbiAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgIC5zcGxpY2UoMilcbiAgICAgIC5qb2luKCcnKVxuICAgICAgLnJlcGxhY2UoL1xcc1xccysvZywgJyAnKVxuICAgICAgLnJlcGxhY2UoJ1JlY2VpdmVkOicsICcsIFJlY2VpdmVkOicpXG4gICAgICAuc3BsaXQoJ0RpZmZlcmVuY2U6JylbMF07XG4gIH1cblxuICAvLyBQdWxsIHRoZSBsaW5lIG91dCBmcm9tIHRoZSBzdGFjayB0cmFjZVxuICBsaW5lT2ZFcnJvcihtZXNzYWdlOiBzdHJpbmcsIGZpbGVQYXRoOiBzdHJpbmcpOiA/bnVtYmVyIHtcbiAgICBjb25zdCBmaWxlbmFtZSA9IHBhdGguYmFzZW5hbWUoZmlsZVBhdGgpO1xuICAgIGNvbnN0IHJlc3RPZlRyYWNlID0gbWVzc2FnZS5zcGxpdChmaWxlbmFtZSwgMilbMV07XG4gICAgcmV0dXJuIHJlc3RPZlRyYWNlID8gcGFyc2VJbnQocmVzdE9mVHJhY2Uuc3BsaXQoJzonKVsxXSwgMTApIDogbnVsbDtcbiAgfVxuXG4gIHN0YXR1c1RvUmVjb25jaWxhdGlvblN0YXRlKHN0YXR1czogc3RyaW5nKTogVGVzdFJlY29uY2lsaWF0aW9uU3RhdGUge1xuICAgIHN3aXRjaCAoc3RhdHVzKSB7XG4gICAgICBjYXNlICdwYXNzZWQnOlxuICAgICAgICByZXR1cm4gJ0tub3duU3VjY2Vzcyc7XG4gICAgICBjYXNlICdmYWlsZWQnOlxuICAgICAgICByZXR1cm4gJ0tub3duRmFpbCc7XG4gICAgICBjYXNlICdwZW5kaW5nJzpcbiAgICAgICAgcmV0dXJuICdLbm93blNraXAnO1xuICAgICAgY2FzZSAndG9kbyc6XG4gICAgICAgIHJldHVybiAnS25vd25Ub2RvJztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiAnVW5rbm93bic7XG4gICAgfVxuICB9XG5cbiAgc3RhdGVGb3JUZXN0RmlsZShmaWxlOiBzdHJpbmcpOiBUZXN0UmVjb25jaWxpYXRpb25TdGF0ZSB7XG4gICAgY29uc3QgcmVzdWx0cyA9IHRoaXMuZmlsZVN0YXR1c2VzW2ZpbGVdO1xuICAgIGlmICghcmVzdWx0cykge1xuICAgICAgcmV0dXJuICdVbmtub3duJztcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHMuc3RhdHVzO1xuICB9XG5cbiAgYXNzZXJ0aW9uc0ZvclRlc3RGaWxlKGZpbGU6IHN0cmluZyk6IFRlc3RBc3NlcnRpb25TdGF0dXNbXSB8IG51bGwge1xuICAgIGNvbnN0IHJlc3VsdHMgPSB0aGlzLmZpbGVTdGF0dXNlc1tmaWxlXTtcbiAgICByZXR1cm4gcmVzdWx0cyA/IHJlc3VsdHMuYXNzZXJ0aW9ucyA6IG51bGw7XG4gIH1cblxuICBzdGF0ZUZvclRlc3RBc3NlcnRpb24oZmlsZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBUZXN0QXNzZXJ0aW9uU3RhdHVzIHwgbnVsbCB7XG4gICAgY29uc3QgcmVzdWx0cyA9IHRoaXMuZmlsZVN0YXR1c2VzW2ZpbGVdO1xuICAgIGlmICghcmVzdWx0cyB8fCAhcmVzdWx0cy5hc3NlcnRpb25zKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgYXNzZXJ0aW9uID0gcmVzdWx0cy5hc3NlcnRpb25zLmZpbmQoKGEpID0+IGEudGl0bGUgPT09IG5hbWUpO1xuICAgIGlmICghYXNzZXJ0aW9uKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGFzc2VydGlvbjtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBVUE7QUFBd0I7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOQSxJQU9xQkEsY0FBYztFQUdqQywwQkFBYztJQUFBO0lBQ1osSUFBSSxDQUFDQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0VBQ3hCOztFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQUE7SUFBQTtJQUFBLE9BQ0Esa0NBQXlCQyxPQUE2QixFQUE2QjtNQUFBO01BQ2pGO01BQ0EsSUFBTUMsVUFBcUMsR0FBRyxFQUFFO01BQ2hERCxPQUFPLENBQUNFLFdBQVcsQ0FBQ0MsT0FBTyxDQUFDLFVBQUNDLElBQUksRUFBSztRQUNwQztRQUNBLElBQU1DLE1BQU0sR0FBRyxLQUFJLENBQUNDLDBCQUEwQixDQUFDRixJQUFJLENBQUNDLE1BQU0sQ0FBQztRQUMzRDtRQUNBLElBQU1FLFVBQW1DLEdBQUc7VUFDMUNDLFVBQVUsRUFBRSxLQUFJLENBQUNDLGFBQWEsQ0FBQ0wsSUFBSSxDQUFDTSxJQUFJLEVBQUVOLElB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