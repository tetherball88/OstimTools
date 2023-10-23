import fs from 'fs';

export const renameFileOrFolder = async (oldPath: string, newPath: string) => fs.promises.rename(oldPath, newPath)