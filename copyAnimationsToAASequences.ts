import { copyFile } from '~common/nodejs/utils';
import path from 'path'
import { glob } from './src/common/nodejs/utils/glob'
import fsExtra from 'fs-extra'

const packs = [
    {
        prefix: 'Anubs',
        path: "D:/my-projects/ostim packs/Anub",
        nemesisId: 'amoran',
        targetPath: 'D:/my-projects/AA separate animations/Anub'
    }
]

const neededAnimations = [
    "BillyyKneelbj3",
    "BillyyLcunn2",
    "BillyyLotussit",
    "BillyySide",
    "LeitoAfThroneMissionary",
    "LeitoAfThroneAnalReCow",
    "Billyy3pffmdogside",
    "BillyyStand",
    "BillyyDoggyarm",
    "BillyyHold",
    "Billyy3pffmmis",
    "BillyyNellay",
    "BillyySpooningfacing",
    "BillyyDoggy1",
    "BillyyLayprone",
    "BillyyStanda",
    "BillyySquat",
    "BillyyRevlotus2",
    "AnubsAsq",
    "NibblesStandingfuck4",
    "LeitoFfm1",
    "LeitoLotus",
    "AnubsASt",
    "AnubsRcowgirl",
    "NibblesLapfuck",
    "AnubsAdultMatingpress",
    "AnubsAInvTable",
    "Billyy3pffmcg",
    "AnubsImpreg",
    "AnubsWallfront",
    "BillyyFmast1",
    "LeitoAfThroneCowgirl",
    "AnubsMf",
    "AnubsRune",
    "NibblesLapfuck2",
    "AnubsJacko",
    "BillyyLesmdil3",
    "AnubsLegupfuck",
    "Billyy4pfffmcg",
    "AnubsVampfemale",
    "NibblesMissionary2",
    "LeitoMissionary3",
    "BillyyLay692",
    "LeitoFfm3",
    "AnubsSinner",
    "Billyy3pffm69",
    "NibblesCowgirl5",
    "AnubsAdultmissionary",
    "BillyyCrabmiss",
    "LeitoFfm2",
    "AnubsSwordCg",
    "LeitoBj2",
    "AnubsAnubCounter",
    "NibblesDoggystyle3",
    "AnubsHold",
    "BillyyFmast3",
    "BillyyKneelbj2",
    "NibblesMissionary4",
    "BillyyLayba",
    "NibblesScrew",
    "LeitoStanding2",
    "AnubsAnubdoggystyle",
    "BillyyLtrib2",
    "BillyyMatingp",
    "AnubsAfTw",
    "AnubsAfChairDoggy",
    "AnubsStandingnew"
]

const meshesPath = 'meshes/actors/character/Animations'
const jsonPath = 'SKSE/Plugins/OStim/scenes'

const copyAnimationsToAASequences = async () => {
    const animListFiles = new Set<string>()
    for(const animId of neededAnimations) {
        const pack = packs.find(({ prefix }) => animId.startsWith(prefix))

        if(!pack) {
            continue;
        }

        const hkxGlobPattern = `${pack.path}\\meshes\\**\\${animId}`

        const hkxFolder = (await glob(hkxGlobPattern))[0]
        const animList = await glob(`${path.resolve(hkxFolder[0], '..\\..')}\\*.txt`)
        animListFiles.add(animList[0])

        const module = hkxFolder.replace(`${pack.path}/${meshesPath}/`, '').split('/')[0]

        await fsExtra.copy(hkxFolder, `${pack.targetPath}/${module}/${meshesPath}/${hkxFolder.replace(`${pack.path}/${meshesPath}/`, '')}`)

        const jsonGlobPattern = `${pack.path}\\${jsonPath}\\**\\${animId}`
        const jsonFolder = (await glob(jsonGlobPattern))[0]
        // const animList = await glob(`${path.resolve(hkxFolder[0], '..\\..')}\\*.txt`)
        // animListFiles.add(animList[0])

        // const module = hkxFolder.replace(`${pack.path}/meshes/actors/character/Animations/`, '').split('/')[0]

        console.log(jsonFolder)

        // await fsExtra.copy(hkxFolder, `${pack.targetPath}/${module}/meshes/actors/character/Animations/${hkxFolder.replace(`${pack.path}/meshes/actors/character/Animations/`, '')}`)
    }
}

copyAnimationsToAASequences()