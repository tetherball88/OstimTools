import { OstimConfigAnimation, OstimConfigAnimationActor } from '~packs/types';
import { renderAttrs } from './renderAttrs';

const renderActor = (actor: OstimConfigAnimationActor, actorIndex: number, sceneConfig: OstimConfigAnimation, stageIndex: number) => {
  const willClimax = sceneConfig.stages[stageIndex + 1]?.actors[actorIndex].tags?.includes('climaxing');
  if (willClimax) {
    return `<actor ${renderAttrs(actor)}>
            <autotransition type="climax" destination="${sceneConfig.stages[stageIndex + 1].id}"/>
        </actor>`
  }
  return `<actor ${renderAttrs(actor)}/>`
}

/**
 * render actors in scene xml
 * @param sceneConfig 
 * @param stageIndex 
 * @returns 
 */
export const renderActors = (sceneConfig: OstimConfigAnimation, stageIndex: number) => {
  const stageConfig = sceneConfig.stages[stageIndex];
  
  return `<actors>
        ${stageConfig.actors.map((actor, index) => renderActor(actor, index, sceneConfig, stageIndex)).join('\n        ')}
    </actors>`
}