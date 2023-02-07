import { FC } from "react";
import { useFormContext, Controller } from "react-hook-form";

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import TreeItem from '@mui/lab/TreeItem';

import { AnimationFromModule, ModuleSpecificConfig } from "~packs/types";

interface CustomScaleAnimationProps {
    selectedAnimations: AnimationFromModule
    animationName: string
}

export const CustomScaleAnimation: FC<CustomScaleAnimationProps> = ({ selectedAnimations, animationName }) => {
    const { control, getValues } = useFormContext<ModuleSpecificConfig>();
    const customScale = getValues('customScale');
    const { actors } = selectedAnimations[animationName];
    const animationScales: (number | null)[] = customScale[animationName] || Array.from({ length: actors }, () => null);

    return (
        <TreeItem
            nodeId={animationName}
            label={animationName}
            sx={{
                marginBottom: 2,

                '& .MuiTreeItem-content': {
                    paddingTop: 1,
                    paddingBottom: 1
                }
            }}
        >
            <Grid item xs={12} sx={{ margin: '15px 0' }}>
                {animationScales.map((scale, index) => (
                    <Controller
                        key={index}
                        name={`customScale.${animationName}.${index}`}
                        control={control}
                        render={({ field: {value, onChange, ...otherField} }) => (
                            <Tooltip key={index} title={`Provide new scale for actor ${index}.`}>
                                <TextField
                                    {...otherField}
                                    value={value === null ? '' : value}
                                    onChange={(e) => onChange(!e.target.value ? null : parseFloat(e.target.value))}
                                    size="small"
                                    sx={{
                                        width: '65px',
                                        marginLeft: '5px',
                                        '&': {
                                            'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
                                                '-webkit-appearance': 'none',
                                                margin: 0,
                                            }
                                        },
                                    }}
                                    type="number"
                                    label={`Actor ${index}`}
                                />
                            </Tooltip>
                        )
                        }
                    />
                ))}

            </Grid>
        </TreeItem >
    )
}
