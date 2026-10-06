/// Node Modules
import * as path from 'node:path';

/** Handles Resolving Available Assets. */
export namespace Dirent {
    //  PROPERTIES  //

    export const project = path.resolve(import.meta.dirname, '..', '..');
    export const reports = path.resolve(project, 'reports');
    export const targets = path.resolve(project, 'targets');
}
