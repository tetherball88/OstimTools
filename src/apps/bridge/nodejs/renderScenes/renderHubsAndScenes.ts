import { isSceneClimax } from '../../shared/isAnimationClimax';
import { CombinedConfig, OstimConfigAnimation, AnimationGroup } from '~bridge/types';
import { writeFile } from '~common/nodejs/utils';
import { renderScene } from '~bridge/nodejs/renderScenes/renderScene';
import { renderTransitionScene } from '~bridge/nodejs/renderScenes/renderTransitionScene';
import { OstimScene, OstimSceneNavigation } from '~common/shared/types/OstimScene';

/**
 * Render hub content
 * @param group 
 * @param hubsNav 
 * @param config 
 * @returns 
 */
export const renderHub = async (
    group: AnimationGroup,
    config: CombinedConfig,
) => {
    const { name } = group;
    const { outputScenePath, pack: { icon: packIcon }, module: { icon: moduleIcon } } = config

    const navigations: OstimSceneNavigation[] = []
    const icon = group.origin.icon || moduleIcon || packIcon

    if (group.origin) {
        navigations.push(
            {
                origin: group.origin.name,
                description: group.name,
                ...(icon ? { icon } : {})
            },
            {
                destination: group.origin.name,
                description: 'Return',
                icon: 'OStim/symbols/return',
                priority: -1000,
            }
        )
    }

    const content: OstimScene = {
        name,
        modpack: group.modpack || config.module.name,
        length: group.origin.length,
        speeds: group.origin.speeds,
        ...(group.furniture ? { furniture: group.furniture } : {}),
        navigations,
        tags: [
            'idle',
            'intro',
        ],
        actors: group.origin.actors,
        noRandomSelection: true,
    }

    await writeFile(`${outputScenePath}\\${group.folderName}\\${group.name}.json`, JSON.stringify(content, undefined, 4));
}

export const renderHubsAndScenes = async (groups: AnimationGroup[], config: CombinedConfig) => {
    for(const group of groups) {
        await renderHub(group, config);

        if('animations' in group.animations[0]) {
            await renderHubsAndScenes(group.animations as AnimationGroup[], config)
            continue;
        }

        const animations = group.animations as OstimConfigAnimation[]
        

        for(const animation of animations) {
            for(const [index] of animation.stages.entries()) {
                
                const transition = config.transitions?.find(({ sceneId }) => sceneId === `${animation.folders.animName}-${index + 1}`)
                if(isSceneClimax(animation, index) || transition) {
                    await renderTransitionScene(animation, config, index, group, transition?.destinationId)
                } else {
                    await renderScene(animation, config, index, group)
                }
                
            }
        }
    }
}