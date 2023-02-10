/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ChildProcess } from 'child_process';
import type ProjectWorkspace from './project_workspace';
/**
 * Spawns and returns a Jest process with specific args
 *
 * @param {string[]} args
 * @returns {ChildProcess}
 */
export declare const createProcess: (workspace: ProjectWorkspace, args: string[]) => ChildProcess;
