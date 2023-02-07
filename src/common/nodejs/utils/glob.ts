import { GlobOptionsWithFileTypesUnset, glob as globOriginal } from 'glob';

export const glob = (pattern: string, options?: GlobOptionsWithFileTypesUnset) => {
    return globOriginal(pattern.replace(/\\/g, '/'), options);
}