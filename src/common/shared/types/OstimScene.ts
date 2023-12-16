export type OstimSceneNavigationCommon = {
    /**
     * a priority for the order of the navigation options in the menu
     * the navigations are sorted ascending, so lower priorities will show first
     * conventional priorities in idles are:
     *     0 other idles
     *     1000 romantic scenes
     *     2000 undressing scenes
     *     3000 sexual scenes
     * conventional priorities in other scenes are:
     *     -1000 return to idle
     *         0 detail changes (e.g. put hands on hips)
     *     1000 positional changes (e.g. kneel down during HJ)
     *     2000 action changes (e.g. go from HJ to BJ)
     *     3000 climax
     * it is recommended to stick to the convention so that navigation options always have a logical order
     * numbers can be slightly adjusted for fine tuning (e.g. 1999 instead of 2000 if you want it to be the first in its class)
     * @default 0
     */
    priority?: number
    /**
     * the display text of the navigation in game
     */
    description?: string
    /**
     * the path to the .dds file to be used as the icon
     * this path will be appended to "../Data/Interface/OStim/icons", the file ending ".dds" will be added automatically
     */
    icon?: string
    /**
     * the hexadecimal RBG code of the icon border
     * @default ffffff
     */
    border?: string
    /**
     * disables warnings about origin or destination not existing
     * this can be used to prevent spamming the log when connecting to other animation packs that a user might not have installed
     * doesn't prevent warnings about mismatching furniture types or actor counts
     * @default false
     */
    noWarnings?: boolean
}

type OstimSceneNavigationDestination = OstimSceneNavigationCommon & {
    /**
     * the destination of the navigation
     * if you use this a navigation option is added to this scene that leads to the destination scene
     * this is the preferred way, you should always use this over "origin" when navigating within an animation pack
     */
    destination: string
}

export type OstimSceneNavigationOrigin = OstimSceneNavigationCommon & {
    /**
     * the origin of the navigation option
     * if you use this a navigation option is added to the origin scene that leads to this scene
     * this can be used to create navigations from scenes of other animation packs to your scene without overwriting them
     * you should never use "origin" and "destination" at the same time
     */
    origin: string
}

export type OstimSceneNavigation = OstimSceneNavigationDestination | OstimSceneNavigationOrigin

export type OstimSceneSpeed = {
    /**
     * the animation event name of the animation to play for this speed
     * this animation will be send as animation event to the actors with _X appended, X being the actors index
     */
    animation: string
    /**
     * the speed at which to play the animation
     * in order for this to work the animation has to be registered with a Nemesis patch that links it to the OStimSpeed graph variable
     * @default 1.0
     */
    playbackSpeed?: number
    /**
     * the speed value to display in game
     */
    displaySpeed?: number
}

export type OstimSceneActor = {
    /**
     * the type of the actor (see actor types README https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/actor%20types%20README.txt )
     * @default "npc"
     */
    type?: 'npc' | string
    /**
     * the intended sex of this actor
     * possible values are "male" and "female"
     * this can be used to limit navigation to this scene by sex without any action in it requiring it
     * for example because one of the actors makes a feminine pose that would look weird on a male
     * @default any
     */
    intendedSex?: 'male' | 'female' | 'any'
    /**
     * the SoSBend value for the actor
     * sos angles range from -9 to 9, additionally -10 will cause a flaccid schlong
     * these cause the SoSBendX animation event to be send to the actor, with X being the sosBend value
     * @default 0
     */
    sosBend?: -10 | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
    /**
     * if true the actor does not get undressed, no matter the actions involved
     * @default false
     */
    noStrip?: boolean
    /**
     * the scale of the actor
     * @default 1.0
     */
    scale?: number
    /**
     * the height against which the heel offset should be scaled
     * this can be used to keep the most important part (for example the schlong in a penetrative scene) always at the same height, no matter the heel offset
     * the default value is the total height of the vanilla skeleton
     * @default 120.748
     */
    scaleHeight?: number
    /**
     * the index of the animation to play (see speed fields: animation)
     * this can be used to invert the roles of a scene without having to register the animations twice
     * defaults to the actors index
     */
    animationIndex?: number
    /**
     * the index of the action that takes priority for the actors facial expression (see actions README https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/actions%20README.txt)
     */
    expressionAction?: number
    /**
     * an expression set to override the actors expression in this scene (see facial expressions README https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/facial%20expressions%20README.txt)
     */
    expressionOverride?: string
    /**
     * the mfg value for the eyes to look up
     * possible values range from -100 to 100, with negative ones causing a look down
     * @default 0
     */
    lookUp?: number
    /**
     * alternative to lookUp with inverted values
     * if lookUp is defined this field is ignored
     * @default 0
     */
    lookDown?: number
    /**
     * the mfg value for the eyes to look left
     * possible values range from -100 to 100, with negative ones causing a look right
     * @default 0
     */
    lookLeft?: number
    /**
     * alternative to lookLeft with inverted values
     * if lookLeft is defined this field is ignored
     * @default 0
     */
    lookRight?: number
    /**
     * a list of tags for this actor (see list of commonly used actor tags https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/list%20of%20commonly%20used%20actor%20tags.txt)
     */
    tags?: string[]
    /**
     * if true heel scaling is in effect, if false the heel offset will be removed
     * this value defaults to true if the actor has the "standing" or "squatting" tag and false otherwise
     */
    feetOnGround?: boolean
    /**
     * a map of auto transition ids and destination sceneIDs for this actor
     */
    autoTransitions?: Record<string, string>
    /**
     * an offset for the actor
     * use with caution, unlike animations this does not have a smooth transition
     * this means a change in offset will cause the actor to teleport away and then quickly slide pack into position
     * therefore a heavy use of offsets is not recommended
     */
    offset?: OstimScene3DOffset
}

export type OstimSceneAction = {
    /**
     * the type of the action (see actions README https://github.com/VersuchDrei/OStimNG/blob/main/data/SKSE/Plugins/OStim/actions%20README.txt)
     */
    type: string
    /**
     * the index of the action actor
     */
    actor: number
    /**
     * the index of the action target
     * defaults to action's actor
     */
    target?: number
    /**
     * the index of the action performer
     * defaults to action's actor
     */
    performer?: number
}

export interface OstimScene3DOffset {
    /**
     * the x offset
     */
    x?: number
    /**
     * the y offset
     */
    y?: number
    /**
     * the z offset
     */
    z?: number
    /**
     * the rotational offset
     */
    r?: number
}

interface OstimSceneCommon {
    /**
     * the display name of the scene in game
     */
    name: string
    /**
     * the display name of the modpack in game
     */
    modpack: string
    /**
     * the duration of the animation in seconds
     */
    length: number
    /**
     * a list of available speeds for the scene
     */
    speeds: OstimSceneSpeed[]
    /**
     * the index of the default speed of the scene
     * @default 0
     */
    defaultSpeed?: number
    /**
     * if true this scene will never be chosen by random selections
     * @default false
     */
    noRandomSelection?: boolean
    /**
     * the furniture type of this scene
     */
    furniture?: string
    /**
     * a list of tags for this scene
     */
    tags?: string[]
    /**
     * a map of auto transition ids and destination sceneIDs for this scene
     */
    autoTransitions?: Record<string, string>
    /**
     * a list of actors
     */
    actors?: OstimSceneActor[]
    /**
     * a list of actions
     */
    actions?: OstimSceneAction[]
    /**
     * an offset for the animation
     * use with caution, unlike animations this does not have a smooth transition
     * this means a change in offset will cause the actors to teleport away and then quickly slide pack into position
     * therefore a heavy use of offsets is not recommended
     */
    offset?: OstimScene3DOffset
}

interface OstimSceneTransition extends OstimSceneCommon, OstimSceneNavigationCommon {
    /**
     * (only for transition) the sceneID of the transition destination
     * adding this property turns this node into a transition, that means it will be played once and then automatically moves to the destination scene
     * if this property is filled the "navigations" property will be ignored
     */
    destination: string
    /**
     * (only for transition) the sceneID of the transition origin
     * if the transition is already in the navigations of the origin scene this field doesn't have to (and shouldn't) be filled
     * if this field is filled you can also add the "priority", "description", "icon", "border" and "noWarnings" fields directly to the scene and use them like you would for a regular navigation
     */
    origin?: string
}

export interface OstimSceneWithNavigation extends OstimSceneCommon {
    /**
     * a list of navigation options from or to this scene
     */
    navigations: OstimSceneNavigation[]
}

/**
 * A scene defines what animations are played and what navigation options the player has from there.
 * They're also full of metadata and other information.
 * The sceneID which is referred to in other parts of the documentation is the scenes filename without the .json extension.
 * The scene parser also parses subfolders, but folder names are not part of the sceneID, only the filename.
 * If two files have the same filename one of them will overwrite the other, the order of which is overwriting which is not predictable.
 * So it is recommended to start all your scene names with your personal signature to avoid incompatibilities.
 */
export type OstimScene = OstimSceneTransition | OstimSceneWithNavigation