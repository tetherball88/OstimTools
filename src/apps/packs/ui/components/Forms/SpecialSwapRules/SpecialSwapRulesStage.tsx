import { FC } from "react";
import { useFormContext, Controller } from "react-hook-form";

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import TreeItem from "@mui/lab/TreeItem";

import { ModuleSpecificConfig, AnimationFromModule } from "~packs/types";

interface SpecialSwapRulesStageProps {
    stageIndex: number
    animationName: string
    selectedAnimations: AnimationFromModule
}

export const SpecialSwapRulesStage: FC<SpecialSwapRulesStageProps> = ({ stageIndex, animationName, selectedAnimations }) => {
    const { control, getValues, setValue } = useFormContext<ModuleSpecificConfig>();
    const { stages, applyToAllStages } = getValues(`specialSwapRules.${animationName}`);
    const { actors } = selectedAnimations[animationName];
    let stageValue = stages[stageIndex];

    if (applyToAllStages && !stageValue) {
        stageValue = Array.from({ length: actors }, () => 0)
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            {
                !applyToAllStages && (
                    <Tooltip title="Enable stage special swap rules.">
                        <Checkbox checked={!!stageValue} onChange={(event) => {
                            let val = null;
                            if (event.target.checked) {
                                val = Array.from({ length: actors }, () => 0);
                            }
                            setValue(`specialSwapRules.${animationName}.stages.${stageIndex}`, val, {
                                shouldValidate: true,
                                shouldDirty: true,
                            });
                        }} />
                    </Tooltip>
                )
            }
            <TreeItem
                sx={{ flexGrow: 1 }}
                nodeId={`Stage ${stageIndex + 1}`}
                label={applyToAllStages ? 'All stages' : `Stage ${stageIndex + 1}`}
            >
                <Grid item xs={12} sx={{ margin: '15px 0', display: 'flex', alignItems: 'center' }}>
                    {
                        stageValue ? stageValue.map((ostimIndex, index) => {
                            const slalIndex = index + 1;
                            return (
                                <Box key={index}>
                                    <Controller
                                        name={`specialSwapRules.${animationName}.stages.${stageIndex}.${index}`}
                                        control={control}
                                        render={({ field: { onChange, ...otherField } }) => (
                                            <Tooltip key={index} title={`Give new ostim index for actor at slal index ${slalIndex}.`}>
                                                <TextField
                                                    {...otherField}
                                                    onChange={(e) => onChange(parseInt(e.target.value))}
                                                    size="small"
                                                    sx={{
                                                        width: '38px',
                                                        marginLeft: '5px',
                                                        '&': {
                                                            'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                                                                '-webkit-appearance': 'none',
                                                                margin: 0,
                                                            }
                                                        },
                                                    }}
                                                    type="number"
                                                />
                                            </Tooltip>
                                        )
                                        }
                                    />

                                </Box>
                            )
                        }) :
                            <Alert severity="warning">Please enable stage to be able to update actors' indexes</Alert>
                    }
                </Grid >
            </TreeItem>
        </Box>

    )
}