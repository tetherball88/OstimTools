import { getAnimPrefix, getTabs } from '~packs/nodejs/utils';
import { CombinedConfig, OstimConfigAnimation, AnimationGroup, HubNav } from '~packs/types';
import { renderAddActor } from './renderAddActor';
import { renderDismissActor } from './renderDismissActor';

/**
 * Pick icons for each animation if provided by modder
 * @param animName 
 * @param icons 
 * @returns 
 */
function pickSceneIcon(animName: string, icons: Record<string, string[]>) {
    return Object.keys(icons).find(icon => {
        const iconAnims = icons[icon];

        return iconAnims.includes(animName);
    }) || 'osn_st9ho_mf'
}

/**
 * Split animations in a hub by 8 per page
 * @param animations 
 * @returns 
 */
function splitAnimations(animations: OstimConfigAnimation[]) {
    const chunkSize = 8;
    const res = [];
    for (let i = 0; i < animations.length; i += chunkSize) {
        const chunk = animations.slice(i, i + chunkSize);
        res.push(chunk);
    }

    return res;
}

/**
 * Render hub's page's option
 * @param param0 
 * @param param1 
 * @returns 
 */
const hubOption = ({ stages, name, folders: { animName } }: OstimConfigAnimation, { icons }: CombinedConfig) => {
    const icon = pickSceneIcon(animName, icons)

    return `<option halo="hgentle" icon="${icon}" go="${stages[0].id}" text="Go to ${name}" t0="1">
                    <enhance a="1"/><hhue n="hu" cmd="rg" a="0"/>
                    <ihue cmd="body" a="1"/>
                    <ihue n="gx" cmd="rg" a="1"/>
                </option>`
}


/**
 * Render hub's page navigation
 * @param animations 
 * @param config 
 * @returns 
 */
const hubPage = (animations: OstimConfigAnimation[], config: CombinedConfig) => `<page icon="mtri">
                <hue n="hu" cmd="rg" a="1"/>
                ${animations.map(item => hubOption(item, config)).join('\n' + getTabs(4))}
            </page>`

/**
 * Render module hub's navigation back to Addon Hub
 * @param backId 
 * @returns 
 */
const backToHubAddon = (backId: string) => {
    if (!backId) {
        return '';
    }
    return `<page icon="mtri">
                <hue n="hu" cmd="rg" a="0"/>
                <option halo="hgentle" icon="omu_plugins" go="${backId}" text="^return" t0="0">
                    <enhance a="1"/><hhue n="hu" cmd="rg" a="1"/>
                    <ihue cmd="body" a="1"/>
                    <ihue n="gx" cmd="rg" a="1"/>
                </option>
            </page>`
}

/**
 * Render hub xml content
 * @param animsGroup 
 * @param hubsNav 
 * @param config 
 * @returns 
 */
export const renderHub = (
    animsGroup: AnimationGroup,
    hubsNav: Record<string, HubNav>,
    config: CombinedConfig,
) => {
    const { hubIdPath, backToAddonHub } = config;
    const { name, actorsKeyword, furniture } = animsGroup;
    const currNav = hubsNav[name];
    const groupPrefix = getAnimPrefix(actorsKeyword, furniture)

    return `<scene id="${hubIdPath}${name}" actors="${actorsKeyword.length}" style="OScene">
    <info name="${name}" animator=""/>
    <region om="A" maj="S" min="S" stage="" step="" story=""/>
    <anim id="${currNav.curr}" t="L" l="2"/>

    <nav>
        <tab actor="0" icon="sdom" text="$name">
            <hue n="hu" cmd="rg" a="0"/>
            <bnhue cmd="rn" a="0"/>
            ${splitAnimations(animsGroup.animations).map(item => hubPage(item, config)).join('\n' + getTabs(3))}
            ${backToHubAddon(backToAddonHub[groupPrefix])}
        </tab>
        ${renderAddActor(currNav.inviteF || '', 'f', config)}
        ${renderAddActor(currNav.inviteM || '', 'm', config)}
        ${renderDismissActor(currNav.dismiss || '', config, actorsKeyword.length - 1)}
        <defaults/>
    </nav>

    ${Array.from({ length: actorsKeyword.length }).map(() => '<motif drive="intimate" theme="Affection"/>').join('\n' + getTabs(1))}  
    <metadata tags="idle" noRandomSelection="1" ${furniture ? `furniture="${furniture}"` : ''}/>
</scene>`
}