import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import { PackConfig } from "~bridge/types";
import { TextFieldDirectory } from '~common/ui/components';
import { TextFieldControlled } from '~common/ui/components/Fields/TextFieldControlled';

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
                        required: 'Please provide output path where all hkx/scene files will be copied/created'
                    }}
                    render={({ field }) => (
                        <Tooltip title="Output path - where script will create all those osa/ostim folder structures with copied hkx files and created scenes/hubs files.">
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
                <TextFieldControlled
                    formControl={{
                        name: "pack.icon" 
                    }}
                    label="Pack's hubs icon"
                />
            </Grid>
        </Grid>
    )
}