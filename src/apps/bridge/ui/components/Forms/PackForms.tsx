import { FC, useState } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { PackConfigForm } from './PackConfigForm';

export interface PackFormsProps {
    disablePackName?: boolean
}

export const PackForms: FC<PackFormsProps> = ({ disablePackName = false }) => {
    const [currentTab, setCurrentTab] = useState(0);

    return (
        <>
            <Tabs
                value={currentTab}
                onChange={(event, index) => setCurrentTab(index)}
                aria-label="basic tabs example"
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab label="Base" />
            </Tabs>
            {currentTab === 0 && <PackConfigForm disablePackName={disablePackName} />}
        </>
    )
}