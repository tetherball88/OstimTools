import { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Alert from '@mui/material/Alert';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { ModuleSpecificConfig, AnimationFromModule } from "~packs/types";
import { CustomScaleAnimation } from './CustomScaleAnimation';
import { AutocompleteWithCheckboxes } from '~common/ui/components';


interface CustomScaleConfigFormProps {
    selectedAnimations: AnimationFromModule
}


export const CustomScaleConfigForm: FC<CustomScaleConfigFormProps> = ({ selectedAnimations }) => {
    const { getValues, setValue } = useFormContext<ModuleSpecificConfig>();
    const customScale = getValues('customScale');
    const [addedAnimations, setAddedAnimations] = useState<string[]>(Object.keys(customScale))

    const updateHandler = (added: string[]) => {
        const scale = added.reduce<Record<string, Array<number | null>>>((acc, name) => {
            if (customScale[name]) {
                return {
                    ...acc,
                    [name]: customScale[name]
                }
            }

            return {
                ...acc,
                [name]: Array.from({length: selectedAnimations[name].actors}, () => null)
            }
        }, {});

        setValue('customScale', scale);
    }

    return (
        <>
            <Alert severity='info' sx={{ marginBottom: 1 }}>Most slal animations are designed for actors scale 1. By default this app will apply scale 1 to all actors in xml files.</Alert>
            <Alert severity='info' sx={{ marginBottom: 1 }}>You can provide custom scales if animation was designed for different scale than "1".</Alert>
            <Alert severity='info' sx={{ marginBottom: 1 }}>You can leave actor's scale input empty if you don't want to change actor's scale.</Alert>
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
                        <CustomScaleAnimation
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