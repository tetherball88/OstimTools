import { FC, useEffect } from 'react';
import { useForm, FormProvider, useFieldArray, UseFormReturn, UseFieldArrayReturn } from 'react-hook-form';

import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { AddonConfig } from '~connectAddon/types';
import { invokeValidateAllHubXmls, invokeValidateParticularHubXml, invokeValidateSourceModFolderOrFile } from '~connectAddon/events/invokers';
import { AddonHubsKeys } from '~common/shared/types';
import { useSendCommand } from '~common/ui/hooks/useSendCommand';
import { CONECT_ADDON_RUN, CONECT_ADDON_WRITE_CONFIGS } from '~connectAddon/events/events';
import { ConnectAddonConfigButton } from '~connectAddon/ui/components/ConnectAddonConfigButton';
import { ModsToConnectForm } from '~connectAddon/ui/components/Forms';

interface ConnectAddonProps {
    config: AddonConfig
}

const useValidations = (methods: UseFormReturn<AddonConfig, any>, arrayField: UseFieldArrayReturn<AddonConfig, "modsToConnect", "id">) => {
    methods.register('main.addonHubPath', {
        required: 'Addon Hub path is required.',
        validate: async (value) => {
            const validationMsg = await invokeValidateAllHubXmls(value, {addonHubs: methods.getValues('addonHubs')});

            return validationMsg ? validationMsg : true;
        }
    });

    methods.register('main.outputPath', {
        required: 'Output Path - is reuiqred.',
    })

    const hubKeys: AddonHubsKeys[] = ['bench', 'chair', 'main', 'table', 'wall'];

    for (const key of hubKeys) {
        methods.register(`addonHubs.${key}`, {
            required: 'Hub xml file path is required.',
            validate: async (value) => {
                const validationMsg = await invokeValidateParticularHubXml(value, methods.getValues('main.addonHubPath'));

                return validationMsg ? validationMsg : true;
            }
        });
    }

    arrayField.fields.forEach((field, index) => {
        methods.register(`modsToConnect.${index}.name`, {
            required: 'Name is required'
        });

        

        methods.register(`modsToConnect.${index}.path`, {
            required: 'Path is required.',
            validate: async (value) => {
                const validationMsg = await invokeValidateSourceModFolderOrFile(value, methods.watch(`modsToConnect.${index}.isGenerated`));

                return validationMsg ? validationMsg : true;
            }
        })
    })
}

export const ConnectAddon: FC<ConnectAddonProps> = ({ config }) => {
    const methods = useForm<AddonConfig>({ defaultValues: config, mode: 'onBlur' });
    const sendCommand = useSendCommand();
    const arrayField = useFieldArray<AddonConfig>({
        control: methods.control,
        name: 'modsToConnect',
    });

    useValidations(methods, arrayField)

    const onSave = async (data: AddonConfig) => {
        await sendCommand(CONECT_ADDON_WRITE_CONFIGS, 'Saving config...', data);
    }

    const onSubmit = async (data: AddonConfig) => {
        await onSave(data);
        await sendCommand(CONECT_ADDON_RUN, 'Adding generated hubs to Addon Hub...');
    }

    useEffect(() => {
        methods.trigger();
    }, [])

    return (
        <Container
            sx={{
                paddingTop: '16px',
                maxWidth: '700px',
                background: '#fff',
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
        >
            <Alert severity='info' sx={{ marginBottom: 2 }}>This tool will help you to connect hubs generated in "Packs" to Hub Addon(mod from nexus).</Alert>
            <Alert severity='info' sx={{ marginBottom: 2 }}>You can drag & drop mods by draggable icon to change order in the addon hub.</Alert>
            <Alert severity='warning' sx={{ marginBottom: 2 }}>Output path should point to mod folder which will be below Hub Addon mod in your mods order.</Alert>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <Box
                        sx={{
                            paddingTop: 2,
                            paddingBottom: 2,
                        }}
                    >
                        <Button
                            onClick={() => arrayField.prepend({
                                name: '',
                                path: '',
                                isGenerated: true,
                            })}
                            variant="contained"
                            sx={{
                                marginRight: 1,
                            }}
                        >
                            Add mod
                        </Button>
                        <ConnectAddonConfigButton />
                    </Box>
                    <ModsToConnectForm arrayField={arrayField} />
                    <Button type="submit" color="primary" variant="contained" sx={{ marginTop: 4, marginRight: 2 }}>Connect generated hubs to Addon Hub</Button>
                    <Button
                        onClick={async () => {
                            const valid = await methods.trigger()

                            if (!valid) {
                                return;
                            }
                            onSave(methods.getValues())
                        }}
                        color="primary"
                        variant="contained"
                        sx={{ marginTop: 4 }}
                    >Update mods configs</Button>
                </form>
            </FormProvider>
        </Container>
    )
}