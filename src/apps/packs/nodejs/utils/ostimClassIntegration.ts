import { OstimConfigAnimationAction, OstimConfigAnimationStage } from '~packs/types';

const ostimClassNames = {
    ClassSex: 'Sx',
    ClassCunn: 'VJ', //Cunnilingus
    ClassApartHandjob: 'ApHJ',
    ClassHandjob: 'HJ',
    ClassClitRub: 'Cr',
    ClassOneFingerPen: 'Pf1',
    ClassTwoFingerPen: 'Pf2',
    ClassBlowjob: 'BJ',
    ClassPenisjob: 'ApPJ', //Blowjob with jerking at the same time
    ClassMasturbate: 'Po', //masturbation
    ClassHolding: 'Ho',
    ClassApart: 'Ap',  //standing apart
    ClassApartUndressing: 'ApU',
    ClassEmbracing: 'Em',
    ClassRoughHolding: 'Ro',
    ClassSelfSuck: 'SJ',
    ClassHeadHeldPenisjob: 'HhPJ',
    ClassHeadHeldBlowjob: 'HhBJ',
    ClassHeadHeldMasturbate: 'HhPo',
    ClassDualHandjob: 'DHJ',
    Class69Blowjob: 'VBJ',
    Class69Handjob: 'VHJ',

    //OStim extended library
    ClassAnal: 'An',
    ClassBoobjob: 'BoJ',
    ClassBreastFeeding: 'BoF',
    ClassFootjob: 'FJ',
}

/**
 * Attempt to map actions to classes to predict class
 * as addition it can be refined by tags (see map for ClassRoughHolding)
 * actions support wildcard '*' : 'holding*' means any actions starts with 'holding' 
 * and can be combined with '+', which means all actions from combintation must be present: 'blowjob+handjob' both actions 'blowjob' and 'handjob' should be present in the scene
 * you can also use 'is69' boolean field: which will check that actions in your combination are performed by pair of actors, and doesn't involve 3rd+
 */
const mapActionsToClassNames = [
    {
        class: ostimClassNames.ClassSex,
        actions: [
            'tribbing',
            'vaginalsex',
            'vaginalfisting',
        ]
    },
    {
        class: ostimClassNames.ClassCunn,
        actions: [
            'cunnilingus',
            'rimjob',
            'lickingvagina',
        ]
    },
    {
        class: ostimClassNames.ClassApartHandjob,
        actions: []
    },
    {
        class: ostimClassNames.ClassHandjob,
        actions: [
            'handjob',
            'buttjob',
            'thighjob',
        ]
    },
    {
        class: ostimClassNames.ClassClitRub,
        actions: [
            'rubbingclitoris',
        ]
    },
    {
        class: ostimClassNames.ClassOneFingerPen,
        actions: [
            'analfingering',
        ]
    },
    {
        class: ostimClassNames.ClassTwoFingerPen,
        actions: [
            'vaginalfingering',
        ]
    },
    {
        class: ostimClassNames.ClassBlowjob,
        actions: [
            'blowjob',
            'lickingpenis',
            'lickingtesticles',
        ]
    },
    {
        class: ostimClassNames.ClassPenisjob,
        actions: [
            'blowjob+handjob',
            'lickingpenis+handjob',
            'lickingtesticles+handjob'
        ]
    },
    {
        class: ostimClassNames.ClassMasturbate,
        actions: [
            'grindingobject',
            'femalemasturbation',
            'malemasturbation',
            'rubbingpenisagainstface'
        ]
    },
    {
        class: ostimClassNames.ClassHolding,
        actions: [
            'holding*',
            'gropingbreast',
            'gropingbutt',
            'kissingfeet',
            'pullinghair',
        ]
    },
    {
        class: ostimClassNames.ClassApart,
        // for standing idles?
        actions: []
    },
    {
        class: ostimClassNames.ClassApartUndressing,
        // for standing idles?
        actions: []
    },
    {
        class: ostimClassNames.ClassEmbracing,
        actions: [
            'vampirebite',
            'kissing',
            'kissingneck',
            'strokinghead',
            'pattinghead',
        ]
    },
    {
        class: ostimClassNames.ClassRoughHolding,
        // for dom holding?
        actions: [
            'holding*',
            'pullinghair',
        ],
        sceneTags: [
            'femdom',
            'aggression'
        ]
    },
    {
        class: ostimClassNames.ClassSelfSuck,
        actions: []
    },
    {
        class: ostimClassNames.ClassHeadHeldPenisjob,
        actions: [
            'blowjob+handjob+holdinghead',
            'lickingpenis+handjob+holdinghead',
            'lickingtesticles+handjob+holdinghead'
        ]
    },
    {
        class: ostimClassNames.ClassHeadHeldBlowjob,
        actions: [
            'blowjob+holdinghead',
        ]
    },
    {
        class: ostimClassNames.ClassHeadHeldMasturbate,
        actions: []
    },
    {
        class: ostimClassNames.ClassDualHandjob,
        actions: []
    },
    {
        class: ostimClassNames.Class69Blowjob,
        actions: [
            'blowjob+cunnilingus',
            'blowjob+lickingvagina'
        ],
        is69: true,
    },
    {
        class: ostimClassNames.Class69Handjob,
        actions: [
            'handjob+cunnilingus',
            'handjob+lickingvagina'
        ],
        is69: true,
    },
    {
        class: ostimClassNames.ClassAnal,
        actions: [
            'analsex',
            'analfisting',
        ]
    },
    {
        class: ostimClassNames.ClassBoobjob,
        actions: [
            'boobjob',
        ]
    },
    {
        class: ostimClassNames.ClassBreastFeeding,
        actions: [
            'suckingnipples',
            'lickingnipples',
        ]
    },
    {
        class: ostimClassNames.ClassFootjob,
        actions: [
            'footjob'
        ]
    },
]

/**
 * Some scenes might have multiple actions, here I'm trying to make a priority of one class over other
 * for example scene with vaginalsex and kiss will associate whole scene with Sx(where viganlsex belongs) isntead of Em(where kiss belongs)
 * Classes usually used by different steam plugins like oCum, oSound
 */
const classPriority = [
    ostimClassNames.ClassSex,
    ostimClassNames.ClassAnal,
    ostimClassNames.Class69Blowjob,
    ostimClassNames.Class69Handjob,
    ostimClassNames.ClassHeadHeldBlowjob,
    ostimClassNames.ClassBlowjob,
    ostimClassNames.ClassHeadHeldPenisjob,
    ostimClassNames.ClassPenisjob,
    ostimClassNames.ClassTwoFingerPen,
    ostimClassNames.ClassOneFingerPen,
    ostimClassNames.ClassCunn,
    ostimClassNames.ClassHandjob,
    ostimClassNames.ClassFootjob,
    ostimClassNames.ClassHeadHeldMasturbate,
    ostimClassNames.ClassMasturbate,
    ostimClassNames.ClassClitRub,
    ostimClassNames.ClassBoobjob,
    ostimClassNames.ClassBreastFeeding,
    ostimClassNames.ClassRoughHolding,
    ostimClassNames.ClassEmbracing,
    ostimClassNames.ClassHolding,
    ostimClassNames.ClassApart,
]

/**
 * For supporting wildcard '*' sign
 * @param str 
 * @param rule 
 * @returns 
 */ 
function matchRuleShort(str: string, rule: string) {
    const escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
}

/**
 * Compare actions from class combinations and scene actions
 * @param classComboActions 
 * @param sceneActions 
 * @returns 
 */
const compareActions = (classComboActions: string[] = [], sceneActions: OstimConfigAnimationAction[] = []) => {
    const sceneActionsTypes = sceneActions?.map(({ type }) => type);

    return classComboActions.every(comboAction => {
        const wildCardIndex = comboAction.indexOf('*');

        if (wildCardIndex === -1) {
            return sceneActionsTypes.includes(comboAction);
        }

        sceneActionsTypes.some(sceneAction => {
            return matchRuleShort(sceneAction, comboAction);
        });
    });
}

export const getClass = (stageConfig: OstimConfigAnimationStage) => {
    if (!stageConfig) {
        return ostimClassNames.ClassApart;
    }

    const { meta: { tags = '' }, actions = [] } = stageConfig;

    const sceneTags = tags.toLowerCase().split(',');

    // go through classes respecting priority order
    for (const className of classPriority) {
        const found = mapActionsToClassNames.find(({ class: name }) => name === className);

        if(!found) {
            continue;
        }
        const { actions: classActions, sceneTags: classSceneTags, is69 } = found;
        let actionsMatch = false;
        let match69 = !is69;

        // go through all actions from class map
        for (const classAction of classActions) {
            const comboActions = classAction.split('+');

            // all actions from comboActions should be present in a scene
            if (compareActions(comboActions, actions)) {
                actionsMatch = true;
            }

            // if is69, check that actor/target are pair actors
            if (is69) {
                const actionsFromOstimConfig = actions.filter(({ type }) => comboActions.includes(type));
                const actorsFromActions = [new Set(), new Set()];

                if (!actionsFromOstimConfig?.length) {
                    continue;
                }

                actionsFromOstimConfig.forEach(({ actor, target }, i) => {
                    actorsFromActions[i].add(actor);
                    actorsFromActions[i].add(target);
                });

                match69 = [...actorsFromActions[0]].every(actor => actorsFromActions[1].has(actor));
            }

            // if we found our class which matches all actions from class and is 69
            if (match69 && actionsMatch) {
                break;
            }
        }

        // if actionsMatch or match69 aren't true we continue to the next loop cycle. These class doesn't fit our scene
        if (!actionsMatch || !match69) {
            continue;
        }

        let tagsMatch = false;

        // compare if scene tags contain required tags from class map
        if (!classSceneTags?.length) {
            tagsMatch = true;
        } else {
            tagsMatch = classSceneTags.some(tag => sceneTags.includes(tag.toLowerCase()));
        }

        if (tagsMatch && actionsMatch && match69) {
            return className;
        }
    }

    // if we couldn't determine class return this one as default
    return ostimClassNames.ClassApart;
}