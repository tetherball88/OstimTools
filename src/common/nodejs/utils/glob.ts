import {promisify} from 'util'
import globOriginal from 'glob';

const globPromisified = promisify(globOriginal);

export const glob = (pattern: string, options?: globOriginal.IOptions) => {
    return globPromisified(pattern.replace(/\\/g, '/'), options);
}