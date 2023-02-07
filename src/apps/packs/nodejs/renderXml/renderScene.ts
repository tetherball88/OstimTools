import { OstimConfigAnimation, CombinedConfig } from '~packs/types';

import { renderActors } from './renderActors';
import { renderActions } from './renderActions';
import { renderSceneMetadata } from './renderSceneMetadata';
import { getHubName } from '~packs/nodejs/utils';


/**
 * Render scene xml config content 
 * @param sceneConfig 
 * @param config 
 * @param stageIndex 
 * @returns 
 */
export const renderScene = (sceneConfig: OstimConfigAnimation, config: CombinedConfig, stageIndex: number) => {
  const {
    name,
    actorsKeyword,
  } = sceneConfig;
  const {
    pack: { author },
    hubIdPath,
  } = config
  const stageConfig = sceneConfig.stages[stageIndex];
  const { meta: { furniture } } = stageConfig;
  const animationsHubId = getHubName(config, actorsKeyword, furniture);
  const isLast = stageIndex === sceneConfig.stages.length - 1;
  const isFirst = stageIndex === 0;


  return `<scene id="${stageConfig.id}" actors="${stageConfig.actors.length}" style="OScene">
    <info name="${author}Animations | ${name}" animator="${author}"/>
    <region om="A" maj="D" min="D" stage="" step="" story=""/>
    ${`<anim id="${stageConfig.fileName}" t="L" l="2"/>`}

    <nav>
        <tab actor="0" icon="sdom" empty="1">
            <hue n="hu" cmd="rg" a="0"/>
        </tab>
        <tab actor="1" icon="ssub" text="$name">
            <hue n="hu" cmd="rg" a="1"/>
            ${!isLast ? (
                `<page icon="mtri">
                <hue n="hu" cmd="rg" a="0"/>
                <option halo="hgentle" icon="bsy_dr01_ic" go="${sceneConfig.stages[stageIndex + 1].id}" text="Go to next position.">
                    <enhance a="1"/>
                    <hhue n="hu" cmd="rg" a="1"/>
                    <ihue cmd="body">
                        <bo a="1"/>
                        <bo a="0"/>
                    </ihue>
                </option>
            </page>`
            ) : ''
            }
            ${!isFirst ? (
                `<page icon="mtri">
                <hue n="hu" cmd="rg" a="0"/>
                <option halo="hgentle" icon="bsy_dl01_op" go="${sceneConfig.stages[stageIndex - 1].id}" text="Go Back">
                    <enhance a="1"/>
                    <hhue n="hu" cmd="rg" a="1"/>
                    <ihue cmd="body">
                        <bo a="1"/>
                        <bo a="0"/>
                    </ihue>
                </option>
            </page>`
            ) : ''
            }
            <page icon="mtri"><hue n="hu" cmd="rg" a="0"/>
                <option halo="hgentle" icon="obigx" go="${hubIdPath}${animationsHubId}" text="^return">
                    <enhance a="1"/>
                    <hhue n="hu" cmd="rg" a="1"/>
                    <ihue cmd="body">
                        <bo a="1"/>
                        <bo a="0"/>
                    </ihue>
                </option>
            </page>
        </tab>
    </nav>

    ${Array.from({length: actorsKeyword.length}).map(() => '<motif drive="intimate" theme="Affection"/>').join('\n    ')}
    ${renderSceneMetadata(stageConfig)}

    ${renderActors(sceneConfig, stageIndex)}

    ${renderActions(stageConfig.actions)}
</scene>`
}