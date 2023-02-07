import { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import Alert from '@mui/material/Alert';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { ModuleSpecificConfig, SpecialSwapRules, AnimationFromModule } from "~packs/types";
import { SpecialSwapRulesAnimation } from './SpecialSwapRulesAnimation';
import { AutocompleteWithCheckboxes } from '~common/ui/components';

interface SpecialSwapRulesConfigFormProps {
    selectedAnimations: AnimationFromModule
}

function createRules(selectedAnimations: AnimationFromModule, animName: string) {
    const { stages } = selectedAnimations[animName];

    return Array.from({ length: stages }, () => null);
}

export const SpecialSwapRulesConfigForm: FC<SpecialSwapRulesConfigFormProps> = ({ selectedAnimations }) => {
    const { getValues, setValue } = useFormContext<ModuleSpecificConfig>();
    const swapRules = getValues('specialSwapRules');
    const [addedAnimations, setAddedAnimations] = useState<string[]>(Object.keys(swapRules))
    
    const updateHandler = (added: string[]) => {
        const rules = added.reduce<SpecialSwapRules>((acc, name) => {
            if (swapRules[name]) {
                return {
                    ...acc,
                    [name]: swapRules[name]
                }
            }

            return {
                ...acc,
                [name]: {
                    stages: createRules(selectedAnimations, name),
                    applyToAllStages: false,
                }
            }
        }, {});
        setValue('specialSwapRules', rules);
    }

    return (
        <>
            <Alert severity="info" sx={{ marginBottom: 1 }}>
                Script will try to assign proper indexes automatically. But sometimes you might want to change positions of actors, due to bad script automatic swapping mechanism or because you want specify particular actor to take particular index(position).
            </Alert>
            <Alert severity="info" sx={{ marginBottom: 1 }}>
                Slal's actors indexes start from 1, when ostim's starts from 0.
            </Alert>
            <Alert severity="info" sx={{ marginBottom: 1 }}>
                From my experience in slal animations first actors are female and male actors are at the end.
            </Alert>
            <Alert severity="warning" sx={{ marginBottom: 1 }}>
                If you are modifying indexes for stage you should set indexes for all actors. Make sure that you don't assign different actors to the same index.
            </Alert>
            <AutocompleteWithCheckboxes
                data={Object.keys(selectedAnimations)}
                value={addedAnimations}
                label="Add animation"
                placeholder="Select animations"
                dontRenderChips
                onChange={(value) => {
                    setAddedAnimations(value);
                    updateHandler(value);
                }}
                notInDataMsg="Animation in this furniture isn't in module animations list"
                autocompleteProps={{
                    blurOnSelect: true,
                }}
            />
            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ flexGrow: 1, overflowY: 'auto', marginTop: 4 }}
            >
                {
                    addedAnimations.map(item => (
                        <SpecialSwapRulesAnimation
                            key={item}
                            animationName={item}
                            selectedAnimations={selectedAnimations}
                        />
                    ))
                }
            </TreeView>
        </>
    )
}