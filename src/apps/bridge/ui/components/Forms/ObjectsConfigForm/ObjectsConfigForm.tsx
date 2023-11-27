import { FC, useEffect, useState } from 'react';

import { AnimationFromModule } from "~bridge/types";
import { invokeReadObjects } from '~bridge/events/invokers';
import { usePackContext } from '~bridge/ui/components/PacksList/PacksItem';
import { useModuleContext } from '~bridge/ui/components/ModulesList/ModulesItem';
import { Box, Tab, Tabs } from '@mui/material';
import { SkipObjectsConfigForm } from '~bridge/ui/components/Forms/ObjectsConfigForm/SkipObjectsConfigForm';
import { ReplaceObjectsConfigForm } from '~bridge/ui/components/Forms/ObjectsConfigForm/ReplaceObjectsConfigForm';

interface FurnitureMapConfigFormProps {
    selectedAnimations: AnimationFromModule
}

export const ObjectsConfigForm: FC<FurnitureMapConfigFormProps> = ({ selectedAnimations }) => {
    const packConfig = usePackContext().pack
    const moduleConfig = useModuleContext().module
    const [moduleObjects, setModuleObjects] = useState<Record<string, string[]>>({})
    const [currentTab, setCurrentTab] = useState(0)

    useEffect(() => {
        (async () => {
            if (packConfig && moduleConfig) {
                const objects = await invokeReadObjects(packConfig, moduleConfig, false)

                if(!objects) {
                    return
                }

                const objectsRes = Object.keys(objects).reduce<Record<string, string[]>>((acc, name) => {
                    if (!selectedAnimations[name]) {
                        return acc
                    }
                    const objectsActors = objects[name]
                    acc[name] = acc[name] || []

                    Object.values(objectsActors).forEach((values) => {
                        acc[name] = Array.from(new Set([...acc[name], ...values.map(val => val.objects)].flat()))
                    })

                    if (!acc[name].length) {
                        delete acc[name]
                    }

                    return acc
                }, {})

                setModuleObjects(objectsRes)
            }
        })()
    }, [])

    return (
        <Box
            sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', paddingTop: 2 }}
        >
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={currentTab}
                onChange={(e, value) => setCurrentTab(value)}
                sx={{ borderRight: 1, borderColor: 'divider', flexShrink: 0 }}
            >
                <Tab label="Replace" />
                <Tab label="Skip" />
            </Tabs>
            <Box sx={{ paddingLeft: 2 }}>
                {
                    currentTab === 0 && <ReplaceObjectsConfigForm moduleObjects={moduleObjects} />
                }
                {
                    currentTab === 1 && <SkipObjectsConfigForm moduleObjects={moduleObjects} />
                }
            </Box>
        </Box>

    )
}