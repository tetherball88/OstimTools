import path from 'path'

export const isHkxFile = (file: string) => {
    return path.extname(file).toLowerCase() === '.hkx';
}