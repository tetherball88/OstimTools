import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import { PackConfig } from "~packs/types";
import { TextFieldDirectory } from '~common/ui/components';

interface PackConfigFormProps {
    disablePackName?: boolean
}

export const PackConfigForm: FC<PackConfigFormProps> = ({ disablePackName = false }) => {
    const { control, formState: { errors } } = useFormContext<PackConfig>()
    return (
        <Grid container spacing={2} sx={{ paddingTop: '16px' }}>
            <Grid item xs={12}>
                <Controller
                    name="pack.name"
                    control={control}
                    rules={{
                        required: 'Pack name field is required.',
                        pattern: {
                            value: /\w+/,
                            message: 'Name should include only letters and digits.'
                        }
                    }}
                    render={({ field }) => (
                        <Tooltip title="Pack name - used in most cases as pack id and for creating folders. It should contain only letters and numbers.">
                            <TextField
                                {...field}
                                disabled={disablePackName}
                                fullWidth
                                label="Pack name"
                                error={!!errors.pack?.name}
                                helperText={errors.pack?.name?.message}
                            />
                        </Tooltip>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="pack.author"
                    control={control}
                    render={({ field }) => (
                        <Tooltip title="Pack author - show respect and provide author who created all those animations.">
                            <TextField
                                {...field}
                                fullWidth
                                label="Pack author"
                            />
                        </Tooltip>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="pack.outputPath"
                    control={control}
                    rules={{
                        required: 'Please provide output path where all hkx/xml files will be copied/created'
                    }}
                    render={({ field }) => (
                        <Tooltip title="Output path - where script will create all those osa/ostim folder structures with copied hkx files and created scenes/hubs xml files.">
                            <TextFieldDirectory
                                {...field}
                                label="Output path"
                                FieldProps={{
                                    error: !!errors.pack?.outputPath,
                                    helperText: errors.pack?.outputPath?.message
                                }}
                            />
                        </Tooltip>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="pack.tweakedAnimationFilesPath"
                    control={control}
                    render={({ field }) => (
                        <Tooltip title="Tweaked files path - some animations might be missaligned so you probably want them to re-align using hkx poser or some more sofisticated application. Folder structure in this folder should be '{tweakedAnimationFilesPath}\{moduleName}\**\*.hkx' filename of *.hkx file should contain same animation name as target file. Script doesn't care about module name in your filename or class part(St, An, etc...) or actor/stage index.">
                            <TextFieldDirectory
                                {...field}
                                label="Tweaked files path"
                            />
                        </Tooltip>
                    )}
                />

            </Grid>
        </Grid>
    )
}