import { readFile, writeJSON, writeFile, rename } from 'fs-extra';
import { glob } from './src/common/nodejs/utils';
import path from 'path'

/**
 * change this path
 */
const basePath = 'D:/animations/3jiou/convert'
const animationFiles = `${basePath}/meshes/actors/character/animations/**/*.hkx`

/**
 * Change slal json file name
 */
const slalJSONPath = `${basePath}/SLAnims/json/3jiou.json`

/**
 * Change path for behavior file
 */
const behaviorFilePath = `${basePath}/meshes/actors/character/animations/3jiou/FNIS_3jiou_List.txt`

const renameFiles = async () => {
    let files = await glob(animationFiles)
    let slalJson = await readFile(slalJSONPath, 'utf-8')
    let behFile = await readFile(behaviorFilePath, 'utf-8')

    files = files.filter(file => {
        return /.+_[^s][0-9]+\.hkx/ig.test(path.basename(file))
    })

    for(const file of files) {
        const fileName = path.basename(file)
        const [, name, actorLetter, stageIndex] = fileName.match(/(.+_)([abcdef])([0-9]+)\.hkx/) || []

        if(typeof name === 'undefined') {
            console.log(`Couldn't parse ${fileName}`)
            continue
        }

        
        const actorIndex = actorLetter.charCodeAt(0) - 'a'.charCodeAt(0)

        const newFilename = `${name}a${actorIndex+1}_s${stageIndex}`;

        slalJson = slalJson.replace(new RegExp(fileName.replace('.hkx', ''), 'g'), newFilename)
        behFile = behFile.replace(new RegExp(fileName, 'g'), `${newFilename}.hkx`)

        await rename(file, `${path.dirname(file)}/${newFilename}.hkx`)
    }

    await writeJSON(slalJSONPath, JSON.parse(slalJson), {
        spaces: 2
    })
    await writeFile(behaviorFilePath, behFile, 'utf-8')
}

renameFiles()