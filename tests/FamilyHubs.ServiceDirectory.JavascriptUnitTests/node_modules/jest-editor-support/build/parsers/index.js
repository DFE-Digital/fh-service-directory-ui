"use strict";

require("core-js/modules/es.object.define-property.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "JESParserOptions", {
  enumerable: true,
  get: function get() {
    return _helper.JESParserOptions;
  }
});
Object.defineProperty(exports, "JESParserPluginOptions", {
  enumerable: true,
  get: function get() {
    return _helper.JESParserPluginOptions;
  }
});
exports["default"] = parse;
var _babel_parser = require("./babel_parser");
var _helper = require("./helper");
/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * parse the test file by selecting proper parser based on the file extension.
 *
 * exception will be throw should the underlying parse failed.
 */
function parse(filePath, serializedData, options) {
  return (0, _babel_parser.parse)(filePath, serializedData, (0, _helper.parseOptions)(filePath, options));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJwYXJzZSIsImZpbGVQYXRoIiwic2VyaWFsaXplZERhdGEiLCJvcHRpb25zIiwiYmFiZWxQYXJzZXIiLCJwYXJzZU9wdGlvbnMiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvcGFyc2Vycy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqL1xuXG5pbXBvcnQgdHlwZSB7UGFyc2VSZXN1bHR9IGZyb20gJy4vcGFyc2VyX25vZGVzJztcbmltcG9ydCB7cGFyc2UgYXMgYmFiZWxQYXJzZXJ9IGZyb20gJy4vYmFiZWxfcGFyc2VyJztcbmltcG9ydCB7SkVTUGFyc2VyT3B0aW9ucywgSkVTUGFyc2VyUGx1Z2luT3B0aW9ucywgcGFyc2VPcHRpb25zfSBmcm9tICcuL2hlbHBlcic7XG5leHBvcnQge0pFU1BhcnNlck9wdGlvbnMsIEpFU1BhcnNlclBsdWdpbk9wdGlvbnN9O1xuLyoqXG4gKiBwYXJzZSB0aGUgdGVzdCBmaWxlIGJ5IHNlbGVjdGluZyBwcm9wZXIgcGFyc2VyIGJhc2VkIG9uIHRoZSBmaWxlIGV4dGVuc2lvbi5cbiAqXG4gKiBleGNlcHRpb24gd2lsbCBiZSB0aHJvdyBzaG91bGQgdGhlIHVuZGVybHlpbmcgcGFyc2UgZmFpbGVkLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZShmaWxlUGF0aDogc3RyaW5nLCBzZXJpYWxpemVkRGF0YT86IHN0cmluZywgb3B0aW9ucz86IEpFU1BhcnNlck9wdGlvbnMpOiBQYXJzZVJlc3VsdCB7XG4gIHJldHVybiBiYWJlbFBhcnNlcihmaWxlUGF0aCwgc2VyaWFsaXplZERhdGEsIHBhcnNlT3B0aW9ucyhmaWxlUGF0aCwgb3B0aW9ucykpO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBU0E7QUFDQTtBQVZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxTQUFTQSxLQUFLLENBQUNDLFFBQWdCLEVBQUVDLGNBQXVCLEVBQUVDLE9BQTBCLEVBQWU7RUFDaEgsT0FBTyxJQUFBQyxtQkFBVyxFQUFDSCxRQUFRLEVBQUVDLGNBQWMsRUFBRSxJQUFBRyxvQkFBWSxFQUFDSixRQUFRLEVBQUVFLE9BQU8sQ0FBQyxDQUFDO0FBQy9FIn0=