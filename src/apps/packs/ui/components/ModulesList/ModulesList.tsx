import { FC, useState } from 'react';

import { Alert } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { PackFullConfig } from '~packs/types';
import { ModulesItem } from '~packs/ui/components/ModulesList/ModulesItem';
import { CreateModuleConfigModal } from '~packs/ui/components/Dialogs';

interface ModulesListProps {
    pack: PackFullConfig;
}

export const ModulesList: FC<ModulesListProps> = ({ pack }) => {
    const [createModule, setCreateModule] = useState(false);
    const openCreateModuleModal = () => setCreateModule(true)
    const closeCreateModuleModal = () => setCreateModule(false);
    return (
        <Box sx={{ paddingLeft: '50px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', paddingTop: 2, paddingBottom: 2 }}>
                <Typography variant="h6" sx={{marginRight: 3}}>Modules</Typography>
                <Tooltip title="Create new module config">
                    <Button
                        variant="outlined"
                        onClick={(e) => {
                            e.stopPropagation();
                            openCreateModuleModal();
                        }}
                    >
                        Create
                    </Button>
                </Tooltip>
            </Box>
            {
                !pack.modules?.length ? (
                    <Alert severity='info' sx={{ marginBottom: 2, maxWidth: '700px' }}>This pack doesn't have any modules. Please click "Create" to add new module to pack.</Alert>
                ) : null
            }
            {
                pack.modules?.map(module => (<ModulesItem key={module.module.name} pack={pack} module={module} />))
            }
            <CreateModuleConfigModal open={createModule} onClose={closeCreateModuleModal} packName={pack.pack.name} />
        </Box>
    )
}