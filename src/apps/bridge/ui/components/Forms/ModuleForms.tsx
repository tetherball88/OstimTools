import { FC, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Badge from '@mui/material/Badge';

import { ModuleSpecificConfig, AnimationFromModule } from "~bridge/types";
import { ModuleConfigForm } from './ModuleConfigForm';
import { FurnitureMapConfigForm } from './FurnitureMapConfigForm';
import { invokeValidateInputPath, invokeValidateSlalJsonPath } from '~bridge/events/invokers';
import { GET_ALL_ANIMATIONS } from '~bridge/events/events';
import { useSendCommand } from '~bridge/ui/hooks/useSendCommand';
import { TransitionsConfigForm } from '~bridge/ui/components/Forms/TransitionsConfigForm';
import { ObjectsConfigForm } from '~bridge/ui/components/Forms/ObjectsConfigForm/ObjectsConfigForm';
import { ModuleIconsConfigForm } from '~bridge/ui/components/Forms/ModuleIconsConfigForm';

export interface ModuleFormsProps {
    disableModuleName?: boolean
    author: string
}

export const ModuleForms: FC<ModuleFormsProps> = ({ disableModuleName = false, author }) => {
    const [currentTab, setCurrentTab] = useState(0);
    const [allAnimations, setAllAnimations] = useState<AnimationFromModule>({});
    const { getValues, watch, formState: { errors } } = useFormContext<ModuleSpecificConfig>();
    const values = getValues();
    const watchInputPath = watch('module.inputPath');
    const watchSlalConfigPath = watch('module.slalJsonConfig');

    const sendCommand = useSendCommand();

    useEffect(() => {
        if (!watchInputPath) {
            setAllAnimations({});
            return;
        }

        (async () => {
            if (
                watchInputPath
                && watchSlalConfigPath
                && await invokeValidateInputPath(watchInputPath)
                && !(await invokeValidateSlalJsonPath(watchSlalConfigPath))
            ) {
                
                const animations = await sendCommand(GET_ALL_ANIMATIONS, 'Searching animations from input path...', watchInputPath, getValues('module.slalJsonConfig'), author, getValues('module.idPrefix') || "");

                setAllAnimations(animations || {});
            } else {
                setAllAnimations({});
            }
        })();
    }, [watchInputPath, watchSlalConfigPath]);

    const selectedAnimations = Object.keys(allAnimations).reduce<AnimationFromModule>((acc, animName) => {
        if (values.module.include.length && !values.module.include.includes(animName)) {
            return acc;
        }

        if (values.module.exclude.length && values.module.exclude.includes(animName)) {
            return acc;
        }

        return {
            ...acc,
            [animName]: allAnimations[animName]
        }
    }, {});

   return (
        <>
            <Tabs
                value={currentTab}
                onChange={(event, index) => setCurrentTab(index)}
                aria-label="basic tabs example"
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab label={<Badge badgeContent="!" color="error" invisible={!errors.module}>Base</Badge>} />
                <Tab label="Transitions" disabled={!Object.keys(selectedAnimations).length} />
                <Tab label="Objects" disabled={!Object.keys(selectedAnimations).length} />
                <Tab label="Furniture map" disabled={!Object.keys(selectedAnimations).length} />
                <Tab label="Icons" disabled={!Object.keys(selectedAnimations).length} />
            </Tabs>
            {currentTab === 0 && <ModuleConfigForm disableModuleName={disableModuleName} allAnimations={allAnimations} />}
            {currentTab === 1 && <TransitionsConfigForm selectedAnimations={selectedAnimations} />}
            {currentTab === 2 && <ObjectsConfigForm selectedAnimations={selectedAnimations} />}
            {currentTab === 3 && <FurnitureMapConfigForm selectedAnimations={selectedAnimations} />}
            {currentTab === 4 && <ModuleIconsConfigForm selectedAnimations={selectedAnimations} />}
        </>
    )
}