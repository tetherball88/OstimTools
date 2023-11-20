import { Button, Box, Grid, IconButton, Tooltip, createFilterOptions } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { ModuleSpecificConfig, AnimationFromModule } from "~bridge/types";
import { AutocompleteControlled } from '~common/ui/components/Fields/AutocompleteControlled';
import { useSendCommand } from '~bridge/ui/hooks/useSendCommand';
import { GET_ALL_SCENES } from '~bridge/events/events';
import { usePackContext } from '~bridge/ui/components/PacksList/PacksItem';
import { useModuleContext } from '~bridge/ui/components/ModulesList/ModulesItem';
interface TransitionsConfigFormProps {
    selectedAnimations: AnimationFromModule
}
const filter = createFilterOptions<string>();

export const TransitionsConfigForm: FC<TransitionsConfigFormProps> = ({ selectedAnimations }) => {
    const sendCommand = useSendCommand();
    const { pack } = usePackContext()
    const { module } = useModuleContext()
    const { control } = useFormContext<ModuleSpecificConfig>();
    const [allScenes, setAllScenes] = useState<string[]>([])
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'transitions'
    })

    useEffect(() => {
        (async () => {
            if (!pack || !module) {
                return
            }

            const scenes = await sendCommand(GET_ALL_SCENES, 'Searching scenes from output path...', pack, module);
            setAllScenes(scenes?.filter(scene => Object.keys(selectedAnimations).find((name) => scene.includes(name))) || [])
        })()

    }, [])

    return (
        <>
            <Box sx={{ mt: 2, mb: 2 }}>
                <Button onClick={() => append({ sceneId: '', destinationId: '' })}>Add transition</Button>
            </Box>
            {
                fields.map((field, index) => (
                    <Grid key={field.id} container spacing={2} sx={{ paddingTop: '16px' }}>
                        <Grid item xs={5}>
                            <Tooltip title="Scene which should be transition.">
                                <Box>
                                    <AutocompleteControlled<ModuleSpecificConfig, string>
                                        formControl={{
                                            name: `transitions.${index}.sceneId`
                                        }}
                                        freeSolo
                                        options={allScenes}
                                        getOptionLabel={o => o}
                                        label={"Transition scene"}
                                        filterOptions={(options, params) => {
                                            const filtered = filter(options, params);

                                            const { inputValue } = params;
                                            // Suggest the creation of a new value
                                            const isExisting = options.some((option) => inputValue === option);
                                            if (inputValue !== '' && !isExisting) {
                                                filtered.push(inputValue);
                                            }

                                            return filtered;
                                        }}
                                    />
                                </Box>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={5}>
                            <Tooltip title="Destination of transition scene.">
                                <Box>
                                    <AutocompleteControlled<ModuleSpecificConfig, string>
                                        formControl={{
                                            name: `transitions.${index}.destinationId`
                                        }}
                                        freeSolo
                                        options={allScenes}
                                        getOptionLabel={o => o}
                                        label={"Destination scene"}
                                        filterOptions={(options, params) => {
                                            const filtered = filter(options, params);

                                            const { inputValue } = params;
                                            // Suggest the creation of a new value
                                            const isExisting = options.some((option) => inputValue === option);
                                            if (inputValue !== '' && !isExisting) {
                                                filtered.push(inputValue);
                                            }

                                            return filtered;
                                        }}
                                    />
                                </Box>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={2}>
                            <Box>
                                <IconButton color="error" onClick={() => remove(index)}>
                                    <DeleteForeverIcon />
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                ))
            }
        </>
    )
}