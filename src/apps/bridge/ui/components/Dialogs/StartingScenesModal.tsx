import { FC, Fragment } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import { useSendCommand } from '~bridge/ui/hooks/useSendCommand';
import { SEARCH_STARTING_SCENES, WRITE_STARTING_SCENES_CONFIG } from '~bridge/events/events';
import { useBridgeState } from '~bridge/ui/state/store';
import { Accordion, AccordionDetails, AccordionSummary, Divider, IconButton, List, ListItem, Typography } from '@mui/material';
import DeleteForever from '@mui/icons-material/DeleteForever';
import { SELECT_DIRECTORY } from '~common/events/events';

export interface EditBridgeGlobalConfigModalProps {
    open: boolean
    onClose: () => void
}

export const StartingScenesModal: FC<EditBridgeGlobalConfigModalProps> = ({
    open,
    onClose,
}) => {
    const updateStartingScenesConfig = useBridgeState(state => state.updateStartingScenesConfig);
    const startingScenesConfig = useBridgeState(state => ({...state.startingScenesConfig}));

    const sendCommand = useSendCommand();

    const onSave = async () => {
        await sendCommand(WRITE_STARTING_SCENES_CONFIG, 'Updating starting scenes config...', startingScenesConfig);
        onClose();
    }

    const searchScenesInPath = async (path: string) => {
        let foundScenes = await sendCommand(SEARCH_STARTING_SCENES, 'Searching starting scenes....', path);

        foundScenes = foundScenes?.filter(scene => {
            if(startingScenesConfig.scenes.find(({ name }) => name === scene.name)) {
                console.warn(`You already had such scene ${scene.name} from another source. Overriding with newly found scene.`);
                return false
            }

            return true;
        }) || null

        startingScenesConfig.scenes.push(...(foundScenes || []))

        updateStartingScenesConfig(startingScenesConfig)
    }

    const onButtonClick = async () => {
        const res = await sendCommand(SELECT_DIRECTORY, 'Selecting directory...', {});

        if(res) {
            const { filePaths: [folder] } = res;

            if(!startingScenesConfig.sources.includes(folder)) {
                startingScenesConfig.sources.push(folder)

                await searchScenesInPath(folder)
            }
        }
    }

    const onUpdateSearchResults = async () => {
        startingScenesConfig.scenes = []
        for(const source of startingScenesConfig.sources) {
            await searchScenesInPath(source)
        }
    }
    const onRemoveSource = async (index: number) => {
        startingScenesConfig.sources.splice(index, 1)
        await onUpdateSearchResults()
        updateStartingScenesConfig(startingScenesConfig)
    }

    const onRemoveScene = async (index: number) => {
        startingScenesConfig.scenes.splice(index, 1)
        updateStartingScenesConfig(startingScenesConfig)
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>Edit bridge global config</DialogTitle>
            <DialogContent>
                <Button onClick={onButtonClick}>
                    Add Starting scenes source
                </Button>
                <Accordion expanded>
                    <AccordionSummary>Sources for starting scenes</AccordionSummary>
                    <AccordionDetails>
                        {startingScenesConfig.sources.length ? (
                            <List>
                                {
                                    startingScenesConfig.sources.map((source, index) => (
                                        <Fragment key={source}>
                                            <ListItem 
                                                secondaryAction={
                                                    <IconButton color="error" onClick={() => onRemoveSource(index)}><DeleteForever /></IconButton>
                                                }
                                            >
                                                {startingScenesConfig.sources[index]}
                                            </ListItem>
                                            <Divider component="li" />
                                        </Fragment>
                                    ))
                                }
                            </List>
                        ) : <Typography>Please add at least Ostim Standalone mod folder path as source for starting scenes</Typography>}
                    </AccordionDetails>
                    
                </Accordion>
                <Button onClick={onUpdateSearchResults}>
                    Update search results
                </Button>
                <Accordion>
                    <AccordionSummary>Found starting scenes ({startingScenesConfig.scenes.length})</AccordionSummary>
                    <AccordionDetails>
                        {startingScenesConfig.sources.length ? (
                            <List>
                                {
                                    startingScenesConfig.scenes.map((scene, index) => (
                                        <Fragment key={scene.name}>
                                        <ListItem 
                                            secondaryAction={
                                                <IconButton color="error" onClick={() => onRemoveScene(index)}><DeleteForever /></IconButton>
                                            }
                                        >
                                            {scene.name}
                                        </ListItem>
                                        <Divider component="li" />
                                        </Fragment>
                                        
                                    ))
                                }
                            </List>
                        ) : <Typography>We search for starting scenes from sources. Only scenes with "intro" tag qualify as starting.</Typography>}
                    </AccordionDetails>
                </Accordion>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onSave}>Update</Button>
            </DialogActions>
        </Dialog>
    )
}