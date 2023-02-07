import { FC, useState } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { HubFilesForm, PathsConfigForm } from '~connectAddon/ui/components';
import { Badge } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { AddonConfig } from '~connectAddon/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CommonConfigFormProps {}

export const CommonConfigForm: FC<CommonConfigFormProps> = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const { formState: { errors } } = useFormContext<AddonConfig>();

    return (
        <>
            <Tabs
                value={currentTab}
                onChange={(event, index) => setCurrentTab(index)}
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab label={<Badge badgeContent="!" color="error" invisible={!errors.main}>Paths</Badge>}/>
                <Tab label={<Badge badgeContent="!" color="error" invisible={!errors.addonHubs}>Hub files</Badge>}/>
            </Tabs>
            {currentTab === 0 && <PathsConfigForm />}
            {currentTab === 1 && <HubFilesForm />}
        </>
    )
}