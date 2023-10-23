
import { ModsMetadata, ModsMetadataItem } from '~common/shared/types/ModsMetadata';
import { ExplorerOstimScene } from '~explorer/nodejs/readScenes';

const addOrSkip = <T extends ModsMetadataItem>(collection: T[], item: T) => {
    if (collection.find(({ value }) => value === item.value)) {
        return;
    }

    collection.push(item);
}
export const analyzeScenes = (scenes: ExplorerOstimScene[], metaData: ModsMetadata): ModsMetadata => {
    const actorTags: ModsMetadataItem[] = [...metaData.actorTags];
    const actions: ModsMetadataItem[] = [...metaData.actions];
    const sceneTags: ModsMetadataItem[] = [...metaData.sceneTags];
    const furnitures: ModsMetadataItem[] = [...metaData.furnitures]

    scenes.forEach(({ content: { actions: sceneActions, actors, modpack = 'Other', tags = [], furniture } }) => {
        for (const actor of actors || []) {
            actor.tags?.forEach(tag => addOrSkip(actorTags, { group: modpack, value: tag }))
        }

        for(const action of sceneActions || []) {
            addOrSkip(actions, { group: modpack, value: action.type })
        }

        tags.forEach(tag => addOrSkip(sceneTags, { group: modpack, value: tag }));

        if(furniture) {
            addOrSkip(furnitures, { group: modpack, value: furniture });
        }

    })

    return {actorTags, actions, sceneTags, furnitures}
}