import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TreeView from '@mui/lab/TreeView';
import { Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { GlobalSettingButton } from '~bridge/ui/components/GlobalSettingButton';
import { PacksItem } from '~bridge/ui/components/PacksList/PacksItem';
import { CreatePackConfigModal } from '~bridge/ui/components/Dialogs';
import { useBridgeState } from '~bridge/ui/state/store';
import { StartingScenesButton } from '~bridge/ui/components/StartingScenesButton';

export const PacksList = () => {
    const [create, setCreate] = useState(false);
    const configs = useBridgeState(state => state.configs);

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
                <StartingScenesButton />
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