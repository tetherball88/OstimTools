import { FC } from "react";
import { useConfirm } from "material-ui-confirm";

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";

import { ModuleSpecificConfig, PackConfig } from '~bridge/types';
import { ARCHIVE_MOD, CLEAN_NEMESIS, CLEAN_HKX, CLEAN_MODULE, CLEAN_HUBS_AND_SCENES, RUN_ALL, RUN_ALL_2, RUN_COPY_FILES, ANALYZE_ANNOTATIONS, APPLY_ANNOTATIONS, RUN_SCENES_HUBS, SCENES_TO_CONFIG } from "~bridge/events/events";
import { SplitButton, SplitButtonOptionType } from "~common/ui/components";
import { useSendCommand } from "~bridge/ui/hooks/useSendCommand";


const buttonsGeneral: SplitButtonOptionType[] = [
    {
        command: RUN_ALL,
        tooltip: 'Copy animation files and build all scene files',
        text: 'initial all',
        message: 'Running copy animation files and build all scene files...',
    },
    {
        command: RUN_ALL_2,
        tooltip: 'Apply all updates to animations files and scene files',
        text: 'following all',
        message: 'Applying all updates to animations files and scene files...',
    },
    {
        command: ARCHIVE_MOD,
        tooltip: 'Archive mod',
        text: 'archive',
        message: 'Archiving mod...'
    },
] as SplitButtonOptionType[]

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
            command: CLEAN_NEMESIS,
            tooltip: 'Clean nemesis files only',
            text: 'clean nemesis',
            message: 'Running clean nemesis files only...',
        },
        {
            command: CLEAN_HUBS_AND_SCENES,
            tooltip: 'Clean hubs and scenes files only',
            text: 'clean hubs & scenes',
            message: 'Running clean hubs and scenes files only...',
        }
    ]
}

const copyHkxButtons: SplitButtonOptionType = {
    command: RUN_COPY_FILES,
    tooltip: 'Copy hkx files and run nemesis animlist tool',
    text: 'copy hkx',
    message: 'Copying hkx files...',
    options: [
        {
            command: ANALYZE_ANNOTATIONS,
            tooltip: 'Get hkx files annotations',
            text: 'analize hkx',
            message: 'Getting hkx files annotations...',
        },
        {
            command: APPLY_ANNOTATIONS,
            tooltip: 'Add annotations(climax, spank events) to hkx annotations',
            text: 'add annotations to hkx',
            message: 'Adding annotations to hkx annotations...',
        }
    ]
}

const otherActionsButtons: SplitButtonOptionType[] = [
    {
        command: SCENES_TO_CONFIG,
        tooltip: 'Save changed data from scenes to this tool config',
        text: 'scenes to config',
        message: 'Saving changed data from scenes to this tool config...',
    },
    {
        command: RUN_SCENES_HUBS,
        tooltip: 'Generate hubs and scenes files',
        text: 'run scenes & hubs',
        message: 'Generating hubs and scenes files...',
    },
] as SplitButtonOptionType[]

interface ActionsProps {
    pack: PackConfig
    module: ModuleSpecificConfig
    disabled: boolean
}

export const Actions: FC<ActionsProps> = ({ module, pack, disabled }) => {
    const sendCommand = useSendCommand();
    const confirmHandler = useConfirm()

    const onClick = ({ command, message, confirm }: SplitButtonOptionType) => async () => {
        try {
            if (confirm) {
                await confirmHandler({ description: confirm })
            }

            sendCommand(command, message, pack, module);
            // eslint-disable-next-line no-empty
        } catch { }
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
                color="warning"
                button={cleanButtons}
                onClick={onClick}
                arrowTooltip="Other options to clean output files"
                disabled={disabled}
            />
            <Accordion sx={{ marginTop: 1 }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Other Actions</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <SplitButton
                        button={copyHkxButtons}
                        onClick={onClick}
                        arrowTooltip="Other actions with hkx files"
                        disabled={disabled}
                    />
                    <ButtonGroup variant="contained" sx={{ marginLeft: '15px' }} disabled={disabled}>
                        {otherActionsButtons.map((button) => (
                            <Tooltip key={button.command} title={disabled ? '' : button.tooltip}>
                                <Button onClick={onClick(button)}>
                                    {button.text}
                                </Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>
                </AccordionDetails>
            </Accordion>
        </>
    )
}