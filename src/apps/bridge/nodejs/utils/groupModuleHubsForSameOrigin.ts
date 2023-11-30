import { renderHub } from "~bridge/nodejs/renderScenes";
import { capitalFirst, getActorsKeyword } from "~bridge/nodejs/utils/utils";
import { CombinedConfig } from "~bridge/types"
import { glob, readJson, writeJson } from "~common/nodejs/utils"
import { OstimSceneWithNavigation } from "~common/shared/types/OstimScene";

export const groupModuleHubsForSameOrigin = async (config: CombinedConfig) => {
    const { outputPackScenesPath, outputScenePath } = config
    const allHubs = await glob(`${outputPackScenesPath}/**/*Hub.json`)
    const allOrigins: Record<string, string[]> = {};
    

    for(const hubFile of allHubs) {
        const hubObj = await readJson(hubFile) as OstimSceneWithNavigation;
        const navWithOrigin = hubObj.navigations.find((hub) => 'origin' in hub)

        if(!navWithOrigin) {
            continue;
        }

        const newHubName = `${config.pack.name}${capitalFirst(getActorsKeyword(hubObj.actors))}${capitalFirst(hubObj.furniture)}Pack`

        allOrigins[newHubName] = allOrigins[newHubName] || []
        
        allOrigins[newHubName].push(hubFile)
    }

    const moduleHubPathes = await glob(`${outputScenePath}/**/*Hub.json`)

    for(const [newHubName, hubPathes] of Object.entries(allOrigins)) {
        const modulePathes = hubPathes.filter(path => moduleHubPathes.includes(path))
        if(hubPathes.length <= 1 || modulePathes.length === 0) {
            continue
        }

        const hubContent = await readJson(modulePathes[0]) as OstimSceneWithNavigation
        const origin = (hubContent.navigations.find((item: any) => item.origin) as any)?.origin
        
        await renderHub({
            name: newHubName,
            animations: [],
            origin: {
                name: origin,
                actorsKeyword: '',
                furniture: hubContent.furniture as any,
                length: hubContent.length,
                speeds: hubContent.speeds,
                actors: hubContent.actors || [],
                icon: config.pack.icon
            },
            folderName: '../packHubs',
            furniture: hubContent.furniture as any,
        }, config)

        for(const hubPath of modulePathes) {
            const content = await readJson(hubPath) as OstimSceneWithNavigation

            content.navigations = content.navigations.map(navItem => {
                if('origin' in navItem) {
                    navItem.origin = newHubName
                }

                if(navItem.description === 'Return' && 'destination' in navItem) {
                    navItem.destination = newHubName
                }

                return navItem
            })

            await writeJson(hubPath, content)
        }
    }
}