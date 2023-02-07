import { FC, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';


import { ModuleSpecificConfig, AnimationFromModule } from "~packs/types";
import { AutocompleteWithCheckboxes } from '~common/ui/components';

interface IconsConfigFormProps {
    selectedAnimations: AnimationFromModule
}

interface IconsSubfieldProps {
    selectedAnimations: AnimationFromModule
    iconName: string
}

const IconsSubfiled: FC<IconsSubfieldProps> = ({ selectedAnimations, iconName }) => {
    const { control, getValues } = useFormContext<ModuleSpecificConfig>();
    const values = getValues();
    return (
        <Grid item xs={12} sx={{ marginBottom: 2 }}>
            <Controller
                name={`icons.${iconName}`}
                control={control}
                render={({ field }) => (
                    <AutocompleteWithCheckboxes
                        formControlProps={field}
                        disabled={!values.module.inputPath}
                        data={Object.keys(selectedAnimations)}
                        label={`${iconName}'s animations`}
                        placeholder="Select animations"
                        notInDataMsg="Animation in this furniture isn't in module animations list"
                    />
                )}
            />
        </Grid>
    )
}

export const IconsConfigForm: FC<IconsConfigFormProps> = ({ selectedAnimations }) => {
    const { getValues, setValue } = useFormContext<ModuleSpecificConfig>();
    const icons = getValues('icons');
    const [name, setName] = useState('');
    const [duplicate, setDuplicate] = useState(false);

    const addAnimation = () => {
        if (!name) {
            return;
        }

        if (icons[name]) {
            setDuplicate(true);
            return;
        }

        setDuplicate(false);

        setValue('icons', { ...icons, [name]: [] });
        setName('');
    }

    return (
        <Grid container spacing={2} sx={{ paddingTop: '16px' }}>
            <Grid item xs={12} sx={{ display: 'flex' }}>
                <Tooltip title="This input will add a new icon group of inputs">
                    <TextField
                        label="Add icon"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton color="primary" onClick={addAnimation}><AddIcon /></IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Tooltip>

            </Grid>
            {duplicate && <Grid item xs={12} sx={{ display: 'flex' }}><Alert severity="error">Icon with name <b>{name}</b> is already in the config!</Alert></Grid>}
            <Grid item xs={12}>
                {Object.keys(icons).map(key => <IconsSubfiled key={key} selectedAnimations={selectedAnimations} iconName={key} />)}
            </Grid>
        </Grid>
    )
}