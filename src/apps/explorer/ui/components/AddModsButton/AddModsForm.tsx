import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Grid from '@mui/material/Grid';


import { TextFieldDirectory } from '~common/ui/components';
import { TextField, Tooltip } from '@mui/material';
import { ModInfoConfig } from '~explorer/types/ModsConfig';


const getNameFromPath = (path: string) => {
    return path.split('\\').reverse()[0];
}

const getIdFromPath = (path: string) => {
    const name = getNameFromPath(path);
    const res = name.replace(/\s\w/g, (match) => match.toUpperCase()).replace(/[^a-zA-Z0-9]/g, '')

    return res[0].toLowerCase() + res.slice(1);
}

interface AddModsFormProps {
    isEdit?: boolean
}

export const AddModsForm: FC<AddModsFormProps> = ({
    isEdit
}) => {
    const { control, setValue, getValues } = useFormContext<ModInfoConfig>();

    return (
        <Grid container spacing={2} sx={{ paddingTop: '16px' }}>
            <Grid item xs={12}>
                <Controller
                    name={'path'}
                    control={control}
                    defaultValue=''
                    render={({ field }) => (
                        <Tooltip title="Mod path - folder with selected ostim animation pack.">
                            <TextFieldDirectory
                                {...field}
                                onChange={(value) => {
                                    field.onChange(value);
                                    const values = getValues()

                                    if (!values.id && !isEdit) {
                                        setValue('id', getIdFromPath(value))
                                    }

                                    if (!values.name) {
                                        setValue('name', getNameFromPath(value))
                                    }

                                }}
                                label="Path"
                            />
                        </Tooltip>
                    )}
                />
            </Grid >
            
            <Grid item xs={12}>
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <Tooltip title="Mod name.">
                            <TextField
                                {...field}
                                fullWidth
                                label="Name"
                            />
                        </Tooltip>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="id"
                    control={control}
                    disabled={isEdit}
                    render={({ field }) => (
                        <Tooltip title="Mod id(make sure it's unique with other mods loaded here)">
                            <TextField
                                {...field}
                                fullWidth
                                label="Mod id"
                            />
                        </Tooltip>
                    )}
                />
            </Grid>
            
        </Grid >
    )
}