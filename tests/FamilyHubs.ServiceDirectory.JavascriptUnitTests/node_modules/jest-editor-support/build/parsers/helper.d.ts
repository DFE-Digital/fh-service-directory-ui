/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { DecoratorsPluginOptions, ParserOptions, ParserPluginWithOptions, ParserPlugin } from '@babel/parser';
export declare const DefaultDecoratorPlugin: ParserPluginWithOptions;
export declare const jsPlugins: ParserPlugin[];
export declare const tsPlugins: ParserPlugin[];
export declare const tsxPlugins: ParserPlugin[];
export interface JESParserPluginOptions {
    decorators?: 'legacy' | DecoratorsPluginOptions;
}
export interface JESParserOptions {
    plugins?: JESParserPluginOptions;
    strictMode?: boolean;
}
export declare const parseOptions: (filePath: string, options?: JESParserOptions) => ParserOptions;
