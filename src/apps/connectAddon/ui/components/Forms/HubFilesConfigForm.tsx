import { FC, useEffect } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';

import { AddonHubsKeys } from '~common/shared/types';
import { AddonHubs } from '~connectAddon/types';
import { osaFolderScenePath } from '~common/shared/utils';
import { TextFieldFile } from '~common/ui/components';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface HubFilesFormProps { }

const hubFields: { key: AddonHubsKeys, label: string }[] = [
    {
        key: 'main',
        label: 'Main hub'
    },
    {
        key: 'chair',
        label: 'Chair hub'
    },
    {
        key: 'table',
        label: 'Table hub'
    },
    {
        key: 'bench',
        label: 'Bench hub'
    },
    {
        key: 'wall',
        label: 'Wall hub'
    }
]

export const HubFilesForm: FC<HubFilesFormProps> = () => {
    const { control, formState: { errors }, setValue, trigger } = useFormContext<AddonHubs>();

    const onChange = (file: string, key: AddonHubsKeys) => {
        const paths = file.split(osaFolderScenePath + '\\');
        setValue(`addonHubs.${key}`, paths.length === 1 ? paths[0] : paths[1]);
    }

    useEffect(() => {
        trigger();
    }, []);

    return (
        <Grid container spacing={2} sx={{ paddingTop: 2 }}>
            {
                hubFields.map(({ key, label }) => (
                    <Grid item xs={12} key={key}>
                        <Controller
                            name={`addonHubs.${key}`}
                            control={control}
                            rules={{
                                required: `${label} is required.`,
                            }}
                            render={({ field }) => (
                                <Tooltip title={`Path to ${key} hub in Opensex Addon Hub.`}>
                                    <TextFieldFile
                                        {...field}
                                        label={label}
                                        filters={[
                                            {
                                                name: 'xml',
                                                extensions: ['xml']
                                            }
                                        ]}
                                        FieldProps={{
                                            error: !!errors.addonHubs?.[key],
                                            helperText: errors.addonHubs?.[key]?.message,
                                        }}
                                        onChange={(file) => onChange(file, key)}
                                    />
                                </Tooltip>
                            )}
                        />
                    </Grid>
                ))
            }
        </Grid>
    )
}