import { renderAttrs } from "~packs/nodejs/renderXml/renderAttrs";
import { OstimConfigAnimationAction } from "~packs/types";

const renderAtion = (action: OstimConfigAnimationAction) => {
  return `<action ${renderAttrs(action)}/>`
}

/**
 * render actions section in scene xml
 * @param actions 
 * @returns 
 */
export const renderActions = (actions: OstimConfigAnimationAction[]) => {
  if (!actions || !actions.length) {
    return '';
  }
  return `<actions>
        ${actions.map(renderAtion).join('\n        ')}
    </actions>`
}