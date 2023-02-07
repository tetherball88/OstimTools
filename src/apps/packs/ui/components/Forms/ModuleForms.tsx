import { FC, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Badge from '@mui/material/Badge';

import { ModuleSpecificConfig, AnimationFromModule } from "~packs/types";
import { ModuleConfigForm } from './ModuleConfigForm';
import { FurnitureMapConfigForm } from './FurnitureMapConfigForm';
import { CustomScaleConfigForm } from './CustomScale';
import { SpecialSwapRulesConfigForm } from './SpecialSwapRules';
import { IconsConfigForm } from './IconsConfigForm';
import { useSendCommand } from '~common/ui/hooks/useSendCommand';
import { invokeValidateInputPath, invokeValidateSlalJsonPath } from '~packs/events/invokers';
import { GET_ALL_ANIMATIONS } from '~packs/events/events';

export interface ModuleFormsProps {
    disableModuleName?: boolean
}

export const ModuleForms: FC<ModuleFormsProps> = ({ disableModuleName = false }) => {
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
                
                const animations = await sendCommand(GET_ALL_ANIMATIONS, 'Searching animations from input path...', watchInputPath, getValues('module.slalJsonConfig'));

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
                <Tab label="Furniture map" disabled={!Object.keys(selectedAnimations).length} />
                <Tab label="Custom scale" disabled={!Object.keys(selectedAnimations).length} />
                <Tab label="Swap Rules" disabled={!Object.keys(selectedAnimations).length} />
                <Tab label="Icons" disabled={!Object.keys(selectedAnimations).length} />
            </Tabs>
            {currentTab === 0 && <ModuleConfigForm disableModuleName={disableModuleName} allAnimations={allAnimations} />}
            {currentTab === 1 && <FurnitureMapConfigForm selectedAnimations={selectedAnimations} />}
            {currentTab === 2 && <CustomScaleConfigForm selectedAnimations={selectedAnimations} />}
            {currentTab === 3 && <SpecialSwapRulesConfigForm selectedAnimations={selectedAnimations} />}
            {currentTab === 4 && <IconsConfigForm selectedAnimations={selectedAnimations} />}
        </>
    )
}