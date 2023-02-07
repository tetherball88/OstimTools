import { FC } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { ModuleSpecificConfig, AnimationFromModule } from "~packs/types";
import { SpecialSwapRulesStage } from './SpecialSwapRulesStage';

interface SpecialSwapRulesAnimationProps {
    selectedAnimations: AnimationFromModule
    animationName: string
}

export const SpecialSwapRulesAnimation: FC<SpecialSwapRulesAnimationProps> = ({ selectedAnimations, animationName }) => {
    const { control, getValues } = useFormContext<ModuleSpecificConfig>();
    const swapRules = getValues(`specialSwapRules.${animationName}`);
    const { applyToAllStages, stages } = swapRules;

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
                <Controller
                    name={`specialSwapRules.${animationName}.applyToAllStages`}
                    control={control}
                    render={({ field }) => (
                        <Tooltip title="If you select this checkbox, roles from these stage will be applied to all animation's stages.">
                            <FormControlLabel
                                control={<Checkbox {...field} />}
                                checked={field.value}
                                label="Apply swap rules to all stages"
                            />
                        </Tooltip>
                    )
                    }
                />

            </Grid>
            <Grid item xs={12} sx={{ margin: '15px 0' }}>
                <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{ flexGrow: 1, overflowY: 'auto' }}
                >
                    {
                        stages.slice(0, applyToAllStages ? 1 : undefined).map((stage, stageIndex) => (
                            <SpecialSwapRulesStage
                                key={stageIndex}
                                stageIndex={stageIndex}
                                animationName={animationName}
                                selectedAnimations={selectedAnimations}
                            />
                        ))
                    }
                </TreeView>
            </Grid>
        </TreeItem>
    )
}