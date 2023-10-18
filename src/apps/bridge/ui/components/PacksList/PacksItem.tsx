import { FC, useState } from 'react';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import TreeItem from '@mui/lab/TreeItem';

import { useSendCommand } from '~bridge/ui/hooks/useSendCommand';
import { REMOVE_PACK } from '~bridge/events/events';
import { ConfirmRemoveButton } from '~bridge/ui/components/ConfirmRemoveButton';
import { ModulesList } from '~bridge/ui/components/ModulesList';
import { EditPackConfigModal } from '~bridge/ui/components/Dialogs';
import { useBridgeState } from '~bridge/ui/state/store';

interface PacksItemProps {
    packKey: string;
}

export const PacksItem: FC<PacksItemProps> = ({ packKey }) => {
    const [editPack, setEditPack] = useState(false);

    const configs = useBridgeState(state => state.configs);
    const removePack = useBridgeState(state => state.removePack);
    const packConfig = configs[packKey];
    const { pack: { name } } = packConfig;

    const openEditPackModal = () => setEditPack(true)
    const closeEditPackModal = () => setEditPack(false);

    const sendCommand = useSendCommand();

    const removePackHandler = async () => {
        await sendCommand(REMOVE_PACK, 'Removing pack config...', packConfig);
        removePack(packConfig.pack.name);
    }

    return (
        <>
            <TreeItem
                nodeId={packKey}
                label={(
                    <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
                        <Typography variant="h5">{packKey}</Typography>
                        <Tooltip title="Edit pack config">
                            <Button
                                variant="outlined"
                                sx={{ marginLeft: '46px', marginRight: '15px' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openEditPackModal();
                                }}
                            >
                                Edit
                            </Button>
                        </Tooltip>
                        <ConfirmRemoveButton tooltip="Remove pack with all modules config files along with output files" onConfirm={removePackHandler} />
                    </Box>
                )}
                sx={{ 
                    marginTop: 4,
                    background: '#fff',
                    '& .MuiTreeItem-group': {
                        background: '#fff',
                        paddingLeft: '17px',
                        marginLeft: 0,
                    }
                }}
            >
                <ModulesList pack={packConfig} />
            </TreeItem>
            <EditPackConfigModal open={editPack} onClose={closeEditPackModal} packName={name} />
        </>
    )
}