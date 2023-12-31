import { FC, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import { ModuleSpecificConfig, AnimationFromModule } from "~bridge/types";
import { AutocompleteWithCheckboxesControlled, TextFieldDirectory, TextFieldFile } from '~common/ui/components';
import { TextFieldControlled } from '~common/ui/components/Fields/TextFieldControlled';

interface ModuleConfigFormProps {
    disableModuleName?: boolean
    allAnimations: AnimationFromModule
}

export const ModuleConfigForm: FC<ModuleConfigFormProps> = ({ disableModuleName = false, allAnimations }) => {
    const { control, formState: { errors }, getValues, trigger } = useFormContext<ModuleSpecificConfig>();
    const values = getValues();

    useEffect(() => {
        trigger();
    }, [])

    return (
        <Grid container spacing={2} sx={{ paddingTop: '16px' }}>
            <Grid item xs={12}>
                <Controller
                    name="module.name"
                    control={control}
                    render={({ field }) => (
                        <Tooltip title="Module name - used in most cases as module id and for creating folders. It should contain only letters and numbers.">
                            <TextField
                                {...field}
                                disabled={disableModuleName}
                                fullWidth
                                label="Module name"
                                error={!!errors.module?.name}
                                helperText={errors.module?.name?.message}
                            />
                        </Tooltip>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="module.inputPath"
                    control={control}
                    render={({ field }) => (
                        <Tooltip title="Input path - folder with your source slal animation hkx files.">
                            <TextFieldDirectory
                                {...field}
                                label="Input path"
                            />
                        </Tooltip>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="module.slalJsonConfig"
                    control={control}
                    render={({ field }) => (
                        <Tooltip title="SLAL JSON config file - please provide path to slal config. It will help app to make more precise first run of copying hkx files and making first scene files.">
                            <TextFieldFile
                                {...field}
                                label="SLAL config json file"
                                filters={[{ name: 'json', extensions: ['json'] }]}
                            />
                        </Tooltip>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="module.nemesisPrefix"
                    control={control}
                    render={({ field }) => (
                        <Tooltip title="Unique in your mod load nemesis prefix 6 symbols(letters and digits).">
                            <TextField
                                {...field}
                                label="Nemesis prefix"
                            />
                        </Tooltip>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <AutocompleteWithCheckboxesControlled<ModuleSpecificConfig, string>
                    formControl={{
                        name: 'module.include'
                    }}
                    disabled={!values.module.inputPath}
                    options={Object.keys(allAnimations).filter(anim => !values.module.exclude.includes(anim))}
                    getOptionLabel={o => o}
                    FieldProps={{
                        label: 'Include animations(Empty - means all animations)',
                        placeholder: 'Select animations'
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <AutocompleteWithCheckboxesControlled<ModuleSpecificConfig, string>
                    formControl={{
                        name: 'module.exclude'
                    }}
                    disabled={!values.module.inputPath}
                    options={Object.keys(allAnimations).filter(anim => !values.module.include.includes(anim))}
                    getOptionLabel={o => o}
                    FieldProps={{
                        label: "Exclude animations",
                        placeholder: 'Select animations'
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="module.idPrefix"
                    control={control}
                    render={({ field }) => (
                        <Tooltip title="ID prefix - is optional if you are using same animation with same names in different modules. Keep it empty if you don't have animations with same names. Keep it short.">
                            <TextField
                                {...field}
                                fullWidth
                                label="ID prefix"
                            />
                        </Tooltip>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <TextFieldControlled
                    formControl={{
                        name: "module.icon" 
                    }}
                    label="Module's hubs icon"
                />
            </Grid>
        </Grid>
    )
}