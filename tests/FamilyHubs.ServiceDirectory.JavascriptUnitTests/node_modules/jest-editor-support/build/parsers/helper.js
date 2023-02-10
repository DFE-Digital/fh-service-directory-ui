"use strict";

require("core-js/modules/es.array.is-array.js");
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
require("core-js/modules/es.object.define-property.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tsxPlugins = exports.tsPlugins = exports.parseOptions = exports.jsPlugins = exports.DefaultDecoratorPlugin = void 0;
require("core-js/modules/es.array.concat.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.match.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// taken from https://github.com/babel/babel/blob/main/packages/babel-parser/typings/babel-parser.d.ts
// but comment out a few file-based and either-or plugins
var commonPlugins = ['asyncDoExpressions', 'asyncGenerators', 'bigInt', 'classPrivateMethods', 'classPrivateProperties', 'classProperties', 'classStaticBlock',
// Enabled by default
'decimal',
// 'decorators-legacy',
'decoratorAutoAccessors', 'destructuringPrivate', 'doExpressions', 'dynamicImport', 'explicitResourceManagement', 'exportDefaultFrom', 'exportNamespaceFrom',
// deprecated
// 'flow',
'flowComments', 'functionBind', 'functionSent', 'importMeta',
// 'jsx',
'logicalAssignment', 'importAssertions', 'importReflection', 'moduleBlocks', 'moduleStringNames', 'nullishCoalescingOperator', 'numericSeparator', 'objectRestSpread', 'optionalCatchBinding', 'optionalChaining', 'partialApplication',
// 'placeholders',
'privateIn',
// Enabled by default
'regexpUnicodeSets', 'throwExpressions', 'topLevelAwait', 'v8intrinsic',
// plugin with options
// ['decorators', {decoratorsBeforeExport: true}],
['pipelineOperator', {
  proposal: 'smart'
}], 'recordAndTuple'];
var DefaultDecoratorPlugin = ['decorators', {
  decoratorsBeforeExport: true
}];
exports.DefaultDecoratorPlugin = DefaultDecoratorPlugin;
var jsPlugins = [].concat(commonPlugins, ['flow', 'jsx']);
exports.jsPlugins = jsPlugins;
var tsPlugins = [].concat(commonPlugins, ['typescript']);
exports.tsPlugins = tsPlugins;
var tsxPlugins = [].concat(commonPlugins, ['typescript', 'jsx']);
exports.tsxPlugins = tsxPlugins;
var parseOptions = function parseOptions(filePath, options) {
  var optionalPlugins = function optionalPlugins() {
    var _options$plugins, _options$plugins2;
    if (!(options !== null && options !== void 0 && (_options$plugins = options.plugins) !== null && _options$plugins !== void 0 && _options$plugins.decorators)) {
      return [DefaultDecoratorPlugin];
    }
    if (((_options$plugins2 = options.plugins) === null || _options$plugins2 === void 0 ? void 0 : _options$plugins2.decorators) === 'legacy') {
      return ['decorators-legacy'];
    }
    return [['decorators', options.plugins.decorators]];
  };
  if (filePath.match(/\.ts$/i)) {
    return {
      plugins: [].concat(_toConsumableArray(tsPlugins), _toConsumableArray(optionalPlugins()))
    };
  }
  if (filePath.match(/\.tsx$/i)) {
    return {
      plugins: [].concat(_toConsumableArray(tsxPlugins), _toConsumableArray(optionalPlugins()))
    };
  }

  // for backward compatibility, use js parser as default unless in strict mode
  if (!(options !== null && options !== void 0 && options.strictMode) || filePath.match(/\.m?jsx?$/i)) {
    return {
      plugins: [].concat(_toConsumableArray(jsPlugins), _toConsumableArray(optionalPlugins()))
    };
  }
  throw new TypeError("unable to find parser options for unrecognized file extension: ".concat(filePath));
};
exports.parseOptions = parseOptions;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb21tb25QbHVnaW5zIiwicHJvcG9zYWwiLCJEZWZhdWx0RGVjb3JhdG9yUGx1Z2luIiwiZGVjb3JhdG9yc0JlZm9yZUV4cG9ydCIsImpzUGx1Z2lucyIsInRzUGx1Z2lucyIsInRzeFBsdWdpbnMiLCJwYXJzZU9wdGlvbnMiLCJmaWxlUGF0aCIsIm9wdGlvbnMiLCJvcHRpb25hbFBsdWdpbnMiLCJwbHVnaW5zIiwiZGVjb3JhdG9ycyIsIm1hdGNoIiwic3RyaWN0TW9kZSIsIlR5cGVFcnJvciJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXJzL2hlbHBlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqL1xuXG5pbXBvcnQgdHlwZSB7RGVjb3JhdG9yc1BsdWdpbk9wdGlvbnMsIFBhcnNlck9wdGlvbnMsIFBhcnNlclBsdWdpbldpdGhPcHRpb25zLCBQYXJzZXJQbHVnaW59IGZyb20gJ0BiYWJlbC9wYXJzZXInO1xuXG4vLyB0YWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9iYWJlbC9iYWJlbC9ibG9iL21haW4vcGFja2FnZXMvYmFiZWwtcGFyc2VyL3R5cGluZ3MvYmFiZWwtcGFyc2VyLmQudHNcbi8vIGJ1dCBjb21tZW50IG91dCBhIGZldyBmaWxlLWJhc2VkIGFuZCBlaXRoZXItb3IgcGx1Z2luc1xuY29uc3QgY29tbW9uUGx1Z2luczogUGFyc2VyUGx1Z2luW10gPSBbXG4gICdhc3luY0RvRXhwcmVzc2lvbnMnLFxuICAnYXN5bmNHZW5lcmF0b3JzJyxcbiAgJ2JpZ0ludCcsXG4gICdjbGFzc1ByaXZhdGVNZXRob2RzJyxcbiAgJ2NsYXNzUHJpdmF0ZVByb3BlcnRpZXMnLFxuICAnY2xhc3NQcm9wZXJ0aWVzJyxcbiAgJ2NsYXNzU3RhdGljQmxvY2snLCAvLyBFbmFibGVkIGJ5IGRlZmF1bHRcbiAgJ2RlY2ltYWwnLFxuICAvLyAnZGVjb3JhdG9ycy1sZWdhY3knLFxuICAnZGVjb3JhdG9yQXV0b0FjY2Vzc29ycycsXG4gICdkZXN0cnVjdHVyaW5nUHJpdmF0ZScsXG4gICdkb0V4cHJlc3Npb25zJyxcbiAgJ2R5bmFtaWNJbXBvcnQnLFxuICAnZXhwbGljaXRSZXNvdXJjZU1hbmFnZW1lbnQnLFxuICAnZXhwb3J0RGVmYXVsdEZyb20nLFxuICAnZXhwb3J0TmFtZXNwYWNlRnJvbScsIC8vIGRlcHJlY2F0ZWRcbiAgLy8gJ2Zsb3cnLFxuICAnZmxvd0NvbW1lbnRzJyxcbiAgJ2Z1bmN0aW9uQmluZCcsXG4gICdmdW5jdGlvblNlbnQnLFxuICAnaW1wb3J0TWV0YScsXG4gIC8vICdqc3gnLFxuICAnbG9naWNhbEFzc2lnbm1lbnQnLFxuICAnaW1wb3J0QXNzZXJ0aW9ucycsXG4gICdpbXBvcnRSZWZsZWN0aW9uJyxcbiAgJ21vZHVsZUJsb2NrcycsXG4gICdtb2R1bGVTdHJpbmdOYW1lcycsXG4gICdudWxsaXNoQ29hbGVzY2luZ09wZXJhdG9yJyxcbiAgJ251bWVyaWNTZXBhcmF0b3InLFxuICAnb2JqZWN0UmVzdFNwcmVhZCcsXG4gICdvcHRpb25hbENhdGNoQmluZGluZycsXG4gICdvcHRpb25hbENoYWluaW5nJyxcbiAgJ3BhcnRpYWxBcHBsaWNhdGlvbicsXG4gIC8vICdwbGFjZWhvbGRlcnMnLFxuICAncHJpdmF0ZUluJywgLy8gRW5hYmxlZCBieSBkZWZhdWx0XG4gICdyZWdleHBVbmljb2RlU2V0cycsXG4gICd0aHJvd0V4cHJlc3Npb25zJyxcbiAgJ3RvcExldmVsQXdhaXQnLFxuICAndjhpbnRyaW5zaWMnLFxuICAvLyBwbHVnaW4gd2l0aCBvcHRpb25zXG4gIC8vIFsnZGVjb3JhdG9ycycsIHtkZWNvcmF0b3JzQmVmb3JlRXhwb3J0OiB0cnVlfV0sXG4gIFsncGlwZWxpbmVPcGVyYXRvcicsIHtwcm9wb3NhbDogJ3NtYXJ0J31dLFxuICAncmVjb3JkQW5kVHVwbGUnLFxuXTtcblxuZXhwb3J0IGNvbnN0IERlZmF1bHREZWNvcmF0b3JQbHVnaW46IFBhcnNlclBsdWdpbldpdGhPcHRpb25zID0gWydkZWNvcmF0b3JzJywge2RlY29yYXRvcnNCZWZvcmVFeHBvcnQ6IHRydWV9XTtcbmV4cG9ydCBjb25zdCBqc1BsdWdpbnM6IFBhcnNlclBsdWdpbltdID0gWy4uLmNvbW1vblBsdWdpbnMsICdmbG93JywgJ2pzeCddO1xuZXhwb3J0IGNvbnN0IHRzUGx1Z2luczogUGFyc2VyUGx1Z2luW10gPSBbLi4uY29tbW9uUGx1Z2lucywgJ3R5cGVzY3JpcHQnXTtcbmV4cG9ydCBjb25zdCB0c3hQbHVnaW5zOiBQYXJzZXJQbHVnaW5bXSA9IFsuLi5jb21tb25QbHVnaW5zLCAndHlwZXNjcmlwdCcsICdqc3gnXTtcblxuZXhwb3J0IGludGVyZmFjZSBKRVNQYXJzZXJQbHVnaW5PcHRpb25zIHtcbiAgZGVjb3JhdG9ycz86ICdsZWdhY3knIHwgRGVjb3JhdG9yc1BsdWdpbk9wdGlvbnM7XG59XG5leHBvcnQgaW50ZXJmYWNlIEpFU1BhcnNlck9wdGlvbnMge1xuICBwbHVnaW5zPzogSkVTUGFyc2VyUGx1Z2luT3B0aW9ucztcbiAgc3RyaWN0TW9kZT86IGJvb2xlYW47XG59XG5leHBvcnQgY29uc3QgcGFyc2VPcHRpb25zID0gKGZpbGVQYXRoOiBzdHJpbmcsIG9wdGlvbnM/OiBKRVNQYXJzZXJPcHRpb25zKTogUGFyc2VyT3B0aW9ucyA9PiB7XG4gIGNvbnN0IG9wdGlvbmFsUGx1Z2lucyA9ICgpOiBQYXJzZXJQbHVnaW5bXSA9PiB7XG4gICAgaWYgKCFvcHRpb25zPy5wbHVnaW5zPy5kZWNvcmF0b3JzKSB7XG4gICAgICByZXR1cm4gW0RlZmF1bHREZWNvcmF0b3JQbHVnaW5dO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5wbHVnaW5zPy5kZWNvcmF0b3JzID09PSAnbGVnYWN5Jykge1xuICAgICAgcmV0dXJuIFsnZGVjb3JhdG9ycy1sZWdhY3knXTtcbiAgICB9XG4gICAgcmV0dXJuIFtbJ2RlY29yYXRvcnMnLCBvcHRpb25zLnBsdWdpbnMuZGVjb3JhdG9yc11dO1xuICB9O1xuICBpZiAoZmlsZVBhdGgubWF0Y2goL1xcLnRzJC9pKSkge1xuICAgIHJldHVybiB7cGx1Z2luczogWy4uLnRzUGx1Z2lucywgLi4ub3B0aW9uYWxQbHVnaW5zKCldfTtcbiAgfVxuXG4gIGlmIChmaWxlUGF0aC5tYXRjaCgvXFwudHN4JC9pKSkge1xuICAgIHJldHVybiB7cGx1Z2luczogWy4uLnRzeFBsdWdpbnMsIC4uLm9wdGlvbmFsUGx1Z2lucygpXX07XG4gIH1cblxuICAvLyBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSwgdXNlIGpzIHBhcnNlciBhcyBkZWZhdWx0IHVubGVzcyBpbiBzdHJpY3QgbW9kZVxuICBpZiAoIW9wdGlvbnM/LnN0cmljdE1vZGUgfHwgZmlsZVBhdGgubWF0Y2goL1xcLm0/anN4PyQvaSkpIHtcbiAgICByZXR1cm4ge3BsdWdpbnM6IFsuLi5qc1BsdWdpbnMsIC4uLm9wdGlvbmFsUGx1Z2lucygpXX07XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKGB1bmFibGUgdG8gZmluZCBwYXJzZXIgb3B0aW9ucyBmb3IgdW5yZWNvZ25pemVkIGZpbGUgZXh0ZW5zaW9uOiAke2ZpbGVQYXRofWApO1xufTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBSUE7QUFDQTtBQUNBLElBQU1BLGFBQTZCLEdBQUcsQ0FDcEMsb0JBQW9CLEVBQ3BCLGlCQUFpQixFQUNqQixRQUFRLEVBQ1IscUJBQXFCLEVBQ3JCLHdCQUF3QixFQUN4QixpQkFBaUIsRUFDakIsa0JBQWtCO0FBQUU7QUFDcEIsU0FBUztBQUNUO0FBQ0Esd0JBQXdCLEVBQ3hCLHNCQUFzQixFQUN0QixlQUFlLEVBQ2YsZUFBZSxFQUNmLDRCQUE0QixFQUM1QixtQkFBbUIsRUFDbkIscUJBQXFCO0FBQUU7QUFDdkI7QUFDQSxjQUFjLEVBQ2QsY0FBYyxFQUNkLGNBQWMsRUFDZCxZQUFZO0FBQ1o7QUFDQSxtQkFBbUIsRUFDbkIsa0JBQWtCLEVBQ2xCLGtCQUFrQixFQUNsQixjQUFjLEVBQ2QsbUJBQW1CLEVBQ25CLDJCQUEyQixFQUMzQixrQkFBa0IsRUFDbEIsa0JBQWtCLEVBQ2xCLHNCQUFzQixFQUN0QixrQkFBa0IsRUFDbEIsb0JBQW9CO0FBQ3BCO0FBQ0EsV0FBVztBQUFFO0FBQ2IsbUJBQW1CLEVBQ25CLGtCQUFrQixFQUNsQixlQUFlLEVBQ2YsYUFBYTtBQUNiO0FBQ0E7QUFDQSxDQUFDLGtCQUFrQixFQUFFO0VBQUNDLFFBQVEsRUFBRTtBQUFPLENBQUMsQ0FBQyxFQUN6QyxnQkFBZ0IsQ0FDakI7QUFFTSxJQUFNQyxzQkFBK0MsR0FBRyxDQUFDLFlBQVksRUFBRTtFQUFDQyxzQkFBc0IsRUFBRTtBQUFJLENBQUMsQ0FBQztBQUFDO0FBQ3ZHLElBQU1DLFNBQXlCLGFBQU9KLGFBQWEsR0FBRSxNQUFNLEVBQUUsS0FBSyxFQUFDO0FBQUM7QUFDcEUsSUFBTUssU0FBeUIsYUFBT0wsYUFBYSxHQUFFLFlBQVksRUFBQztBQUFDO0FBQ25FLElBQU1NLFVBQTBCLGFBQU9OLGFBQWEsR0FBRSxZQUFZLEVBQUUsS0FBSyxFQUFDO0FBQUM7QUFTM0UsSUFBTU8sWUFBWSxHQUFHLFNBQWZBLFlBQVksQ0FBSUMsUUFBZ0IsRUFBRUMsT0FBMEIsRUFBb0I7RUFDM0YsSUFBTUMsZUFBZSxHQUFHLFNBQWxCQSxlQUFlLEdBQXlCO0lBQUE7SUFDNUMsSUFBSSxFQUFDRCxPQUFPLGFBQVBBLE9BQU8sbUNBQVBBLE9BQU8sQ0FBRUUsT0FBTyw2Q0FBaEIsaUJBQWtCQyxVQUFVLEdBQUU7TUFDakMsT0FBTyxDQUFDVixzQkFBc0IsQ0FBQztJQUNqQztJQUNBLElBQUksc0JBQUFPLE9BQU8sQ0FBQ0UsT0FBTyxzREFBZixrQkFBaUJDLFVBQVUsTUFBSyxRQUFRLEVBQUU7TUFDNUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDO0lBQzlCO0lBQ0EsT0FBTyxDQUFDLENBQUMsWUFBWSxFQUFFSCxPQUFPLENBQUNFLE9BQU8sQ0FBQ0MsVUFBVSxDQUFDLENBQUM7RUFDckQsQ0FBQztFQUNELElBQUlKLFFBQVEsQ0FBQ0ssS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0lBQzVCLE9BQU87TUFBQ0YsT0FBTywrQkFBTU4sU0FBUyxzQkFBS0ssZUFBZSxFQUFFO0lBQUMsQ0FBQztFQUN4RDtFQUVBLElBQUlGLFFBQVEsQ0FBQ0ssS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0lBQzdCLE9BQU87TUFBQ0YsT0FBTywrQkFBTUwsVUFBVSxzQkFBS0ksZUFBZSxFQUFFO0lBQUMsQ0FBQztFQUN6RDs7RUFFQTtFQUNBLElBQUksRUFBQ0QsT0FBTyxhQUFQQSxPQUFPLGVBQVBBLE9BQU8sQ0FBRUssVUFBVSxLQUFJTixRQUFRLENBQUNLLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRTtJQUN4RCxPQUFPO01BQUNGLE9BQU8sK0JBQU1QLFNBQVMsc0JBQUtNLGVBQWUsRUFBRTtJQUFDLENBQUM7RUFDeEQ7RUFFQSxNQUFNLElBQUlLLFNBQVMsMEVBQW1FUCxRQUFRLEVBQUc7QUFDbkcsQ0FBQztBQUFDIn0=