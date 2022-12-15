"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeListForEach = void 0;
/**
 * This seems to fail in IE8, requires more investigation.
 * See: https://github.com/imagitama/nodelist-foreach-polyfill
 */
function nodeListForEach(nodes, callback) {
    if (window.NodeList.prototype.forEach) {
        return nodes.forEach(callback);
    }
    for (var i = 0; i < nodes.length; i++) {
        callback.call(window, nodes[i], i, nodes);
    }
}
exports.nodeListForEach = nodeListForEach;
//# sourceMappingURL=helpers.js.map