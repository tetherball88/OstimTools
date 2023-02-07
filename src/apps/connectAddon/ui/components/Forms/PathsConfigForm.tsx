import { FC, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';

import { TextFieldDirectory } from '~common/ui/components';
import { AddonMainConfig } from '~connectAddon/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PathsConfigFormProps {}

export const PathsConfigForm: FC<PathsConfigFormProps> = () => {
    const { control, trigger } = useFormContext<AddonMainConfig>();

    useEffect(() => {
        trigger();
    }, []);

    return (
        <Grid container spacing={2} sx={{ paddingTop: 2 }}>
            <Grid item xs={12}>
                <Controller
                    name="main.addonHubPath"
                    control={control}
                    render={({ field }) => (
                        <Tooltip title="Addon Hub path - is where you installed Addon Hub mod.">
                            <TextFieldDirectory
                                {...field}
                                label="Opensex Addon Hub path"

                            />
                        </Tooltip>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name="main.outputPath"
                    control={control}
                    render={({ field }) => (
                        <Tooltip title="Output Path - place where you want to create Addon Hub's xml replacers.">
                            <TextFieldDirectory
                                {...field}
                                label="Output Path"
                            />
                        </Tooltip>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name={`main.prependNewOptions`}
                    control={control}
                    render={({ field }) => (
                        <Tooltip title="If enabled it will place generated hubs right after Return option. Otherwise after all Addon Hub's options.">
                            <FormControlLabel
                                control={<Checkbox {...field} />}
                                checked={field.value}
                                label="Prepend New Options"
                            />
                        </Tooltip>
                    )}
                />
            </Grid>
        </Grid>
    )
}