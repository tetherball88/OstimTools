import { FC, useState } from 'react';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import TreeItem from '@mui/lab/TreeItem';

import { usePacksState } from '~packs/ui/state/PacksState';
import { useSendCommand } from '~common/ui/hooks/useSendCommand';
import { REMOVE_PACK } from '~packs/events/events';
import { ConfirmRemoveButton } from '~packs/ui/components/ConfirmRemoveButton';
import { ModulesList } from '~packs/ui/components/ModulesList';
import { EditPackConfigModal } from '~packs/ui/components/Dialogs';

interface PacksItemProps {
    packKey: string;
}

export const PacksItem: FC<PacksItemProps> = ({ packKey }) => {
    const [editPack, setEditPack] = useState(false);

    const { configs, removePack } = usePacksState();
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