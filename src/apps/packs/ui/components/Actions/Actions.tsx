import { FC } from "react";
import { useConfirm } from "material-ui-confirm";

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

import { ModuleSpecificConfig, PackConfig } from '~packs/types';
import { CLEAN_FNIS, CLEAN_HKX, CLEAN_HUBS, CLEAN_MODULE, CLEAN_SCENES, RUN_ALL, RUN_COPY_FILES, RUN_HUBS, RUN_SCENES, RUN_SCENES_HUBS, XML_TO_JSON } from "~packs/events/events";
import { SplitButton, SplitButtonOptionType } from "~common/ui/components";
import { useSendCommand } from "~common/ui/hooks/useSendCommand";

const buttonsGeneral: SplitButtonOptionType[] = [
    {
        command: RUN_ALL,
        tooltip: 'Copy animation files and build all xml files',
        text: 'all',
        message: 'Running copy animation files and build all xml files...',
    },
    {
        command: RUN_COPY_FILES,
        tooltip: 'Copy animation files and run FNIS',
        text: 'copy hkx',
        message: 'Running copy animation files and run FNIS...'
    },
    {
        command: XML_TO_JSON,
        tooltip: 'Export xml to json config',
        text: 'xml to json',
        message: 'Running export xml to json config...'
    },
] as SplitButtonOptionType[]

const confirmScenes = <>Make sure you ran <Box component="span" sx={{ fontWeight: 700 }}>xml to json</Box> before. Otherwise you'll loose any manually typed data in xml files, like: scene tags, actions, actors attributes.</>

const xmlButtons: SplitButtonOptionType = {
    command: RUN_SCENES_HUBS,
    tooltip: 'Build scenes and hubs',
    text: 'scenes & hubs',
    message: 'Running build scenes and hubs...',
    confirm: confirmScenes,
    options: [
        {
            command: RUN_SCENES,
            tooltip: 'Build only scenes',
            text: 'scenes only',
            message: 'Running build scenes only...',
            confirm: confirmScenes,
        },
        {
            command: RUN_HUBS,
            tooltip: 'Build only hubs',
            text: 'hubs only',
            message: 'Running build hubs only...',
            confirm: confirmScenes,
        }
    ]
}

const cleanButtons: SplitButtonOptionType = {
    command: CLEAN_MODULE,
    tooltip: 'Clean all module\'s output files',
    text: 'clean all',
    message: 'Running clean all module\'s output files...',
    options: [
        {
            command: CLEAN_HKX,
            tooltip: 'Clean animations hkx files only',
            text: 'clean hkx',
            message: 'Running clean animations hkx files only...',
        },
        {
            command: CLEAN_FNIS,
            tooltip: 'Clean fnis files only',
            text: 'clean fnis',
            message: 'Running clean fnis files only...',
        },
        {
            command: CLEAN_SCENES,
            tooltip: 'Clean scenes xml files only',
            text: 'clean scenes',
            message: 'Running clean scenes xml files only...',
        },
        {
            command: CLEAN_HUBS,
            tooltip: 'Clean hubs xml files only',
            text: 'clean hubs',
            message: 'Running clean hubs xml files only...',
        }
    ]
}

interface ActionsProps {
    pack: PackConfig
    module: ModuleSpecificConfig
    disabled: boolean
}

export const Actions: FC<ActionsProps> = ({ module, pack, disabled }) => {
    const sendCommand = useSendCommand();
    const confirmHandler = useConfirm()
    
    const onClick = ({command, message, confirm}: SplitButtonOptionType) => async () => {
        try {
            if(confirm) {
                await confirmHandler({ description: confirm })
            }
            
            sendCommand(command, message, pack, module);
        // eslint-disable-next-line no-empty
        } catch {}
    }

    return (
        <>
            <ButtonGroup variant="contained" sx={{ marginRight: '15px' }} disabled={disabled}>
                {buttonsGeneral.map((button) => (
                    <Tooltip key={button.command} title={disabled ? '' : button.tooltip}>
                        <Button onClick={onClick(button)}>
                            {button.text}
                        </Button>
                    </Tooltip>
                ))}
            </ButtonGroup>
            <SplitButton
                button={xmlButtons}
                onClick={onClick}
                arrowTooltip="Other options to build xml files"
                sx={{ marginRight: '15px' }}
                disabled={disabled}
            />
            <SplitButton 
                color="warning" 
                button={cleanButtons} 
                onClick={onClick} 
                arrowTooltip="Other options to clean output files" 
                disabled={disabled}
            />
        </>
    )
}