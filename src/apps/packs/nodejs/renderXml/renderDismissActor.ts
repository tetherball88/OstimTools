import { CombinedConfig } from '~packs/types'

/**
 *  render dismiss actor option in navigation
 * @param back 
 * @param config 
 * @param actorToLeave 
 * @returns 
 */
export const renderDismissActor = (back: string, config: CombinedConfig, actorToLeave: number) => {
    if (!back) {
        return '';
    }
    return `<tab icon="splus" text="^dismiss" empty="2">
            <hue n="hu" cmd="vg" a="1"/>
            <bnhue cmd="vn" a="1"/>
            <page icon="mgensignm">
                <hue n="hu" cmd="vg" a="1"/>
                <option halo="h_plus_rbo" icon="obigx" go="$RemoveActor" text="^HaveNLeave" t0="${actorToLeave}">
                    <cmd dest="${config.hubIdPath}${back}" actor="${actorToLeave}"/>
                </option>
            </page>
        </tab>`
}