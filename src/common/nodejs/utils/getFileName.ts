import path from 'path'

export const getFileName = (file: string) => {
    return path.basename(file, path.extname(file))
}