import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TreeView from '@mui/lab/TreeView';
import { Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { usePacksState } from '~packs/ui/state/PacksState';
import { GlobalSettingButton } from '~packs/ui/components/GlobalSettingButton';
import { PacksItem } from '~packs/ui/components/PacksList/PacksItem';
import { CreatePackConfigModal } from '~packs/ui/components/Dialogs';

export const PacksList = () => {
    const [create, setCreate] = useState(false);
    const { configs } = usePacksState();

    const openModal = () => setCreate(true)
    const closeModal = () => setCreate(false);

    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}
            >
                <Tooltip title="Create new pack config">
                    <Button variant="contained" onClick={(e) => {
                        e.stopPropagation();
                        openModal();
                    }}>
                        Create new pack
                    </Button>
                </Tooltip>
                <GlobalSettingButton />
            </Box>
            {
                !Object.keys(configs).length ? (
                    <Alert severity='info'>You didn't add any pack yet. Please click "Create new pack" button to add your first pack.</Alert>
                ) : null
            }

            <TreeView
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
            >
                {
                    Object.keys(configs).map(key => (<PacksItem key={key} packKey={key} />))
                }
            </TreeView>
            <CreatePackConfigModal open={create} onClose={closeModal} />
        </Box>
    )
}