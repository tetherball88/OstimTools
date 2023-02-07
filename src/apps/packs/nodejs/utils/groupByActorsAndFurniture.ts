import { getHubName } from '~packs/nodejs/utils/utils';
import { OstimConfig, AnimationGroup, CombinedConfig } from '~packs/types';

/**
 * Group animations by set of actors(fm, ffm, ff, fmm, etc...) and type of furniture they are interacting with
 * @param config 
 * @param ostimConfig 
 * @returns 
 */
export function groupByActorsAndFurniture(config: CombinedConfig, ostimConfig: OstimConfig) {
    const groups: Record<string, AnimationGroup> = {};
    const scenesConfigs = Object.values(ostimConfig);
    for (const sceneConfig of scenesConfigs) {
        const { actorsKeyword } = sceneConfig;
        const furniture = sceneConfig.stages[0].meta.furniture;

        const hubName = getHubName(config, actorsKeyword, furniture);

        const hub = groups[hubName] = groups[hubName] || {} as AnimationGroup;

        hub.name = hub.name || hubName;
        hub.actorsKeyword = hub.actorsKeyword || actorsKeyword;
        hub.furniture = hub.furniture || furniture;
        hub.siblingHub = hub.siblingHub || {
            lessMHubName: getHubName(config, actorsKeyword.slice(0, -1), furniture),
            lessFHubName: getHubName(config, actorsKeyword.slice(1), furniture),
            moreMHubName: getHubName(config, actorsKeyword + 'm', furniture),
            moreFHubName: getHubName(config, 'f' + actorsKeyword, furniture),
        };

        hub.animations = hub.animations || [];
        hub.animations.push(sceneConfig);
    }

    return groups;
}