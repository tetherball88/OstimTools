import path from 'path'

export const isXmlFile = (file: string) => {
    return path.extname(file).toLowerCase() === '.xml';
}