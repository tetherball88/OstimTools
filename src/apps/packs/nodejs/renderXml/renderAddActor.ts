import { CombinedConfig } from '~packs/types'

/**
 * render add actor option in navigation
 * @param next 
 * @param gender 
 * @param config 
 * @returns 
 */
export const renderAddActor = (next: string, gender: string, config: CombinedConfig) => {
    if (!next) {
        return '';
    }
    return gender === 'f' ? `<tab icon="splus" text="^invite" empty="2">
            <hue n="hu" cmd="vg" a="0"/>
            <bnhue cmd="vn" a="0"/>
            <page icon="omu_stickfemplus"><hue n="hu" cmd="vg" a="0"/>
                <option halo="h_plus_rbo" icon="" go="$InviteScan" text="^inviteSomeoneToJoinFemale" t0="0">
                    <ihue n="hu" cmd="vn" a="0"/>
                    <cmd dest="${config.hubIdPath}${next}" rolename="^femaleVisitant" sceneName="^joinFFM" npc="npc"/>
                </option>
            </page>
        </tab>` : `<tab icon="splus" text="^invite" empty="2">
            <hue n="hu" cmd="vg" a="1"/>
            <bnhue cmd="vn" a="1"/>
            <page icon="mgensignm"><hue n="hu" cmd="vg" a="1"/>
                <option halo="h_plus_rbo" icon="ohjdubstand_mf" go="$InviteScan" text="^inviteSomeoneToJoinMale" t0="0">
                    <enhance a="0"/>
                    <enhance a="1"/>
                    <enhance a="2"/>
                    <hhue n="hu0" cmd="rg" a="1"/>
                    <hhue n="hu1" cmd="rg" a="0"/>
                    <ihue cmd="body">
                    <bo a="0"/>
                    <bo a="1"/>
                    <bo a="2"/>
                    </ihue>
                    <cmd dest="${config.hubIdPath}${next}" rolename="^maleVisitant" sceneName="^joinMMF" npc="npc"/>
                </option>	
            </page>
        </tab>`
}