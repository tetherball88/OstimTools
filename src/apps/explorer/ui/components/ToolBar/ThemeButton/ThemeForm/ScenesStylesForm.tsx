import { FC, useEffect, useState } from "react";
import validator from '@rjsf/validator-ajv8';
import childScenesSchema from '~common/shared/jsonValidators/explorerScenesStyles.json'
import explorerGroupsStyles from '~common/shared/jsonValidators/explorerGroupsStyles.json'
import Form from "@rjsf/core";

import { CustomObjectField } from "~explorer/ui/components/ToolBar/ThemeButton/ThemeForm/CustomObjectField";
import { CustomBaseInput } from "~explorer/ui/components/ToolBar/ThemeButton/ThemeForm/CustomBaseInput";
import { CustomFieldTemplate } from "~explorer/ui/components/ToolBar/ThemeButton/ThemeForm/CustomFieldTemplate";
import { GroupsStyles, ScenesStyles } from "~explorer/types/ScenesStyles";
import { useExplorerState } from "~explorer/ui/state/ExplorerState";
import { NodeSingular } from "cytoscape";
import { Alert } from "@mui/material";

type ThemesTypes = 'single' | 'group' | 'mix'

const useSelectedHasSameStyles = (type: ThemesTypes | null, selectedNodes: string[]) => {
    const scenesTheme = useExplorerState(state => state.scenesTheme)
    const groupsTheme = useExplorerState(state => state.groupsTheme)

    if (type === 'mix' || type === null) {
        return null
    }

    const theme: typeof scenesTheme | typeof groupsTheme = type === 'single' ? scenesTheme : groupsTheme

    const selector = `node#${selectedNodes?.[0]}`

    return selectedNodes?.reduce<ScenesStyles[string]>((acc, id) => {
        if (JSON.stringify(theme?.[`node#${id}`]) === JSON.stringify(acc)) {
            return acc
        }

        return {}
    }, theme?.[selector] || {})
}

function filterNullProperties<T extends Record<string, any>>(obj: T) {
    return Object.keys(obj).reduce((filtered, key) => {
        if (obj[key] !== null) {
            filtered[key as keyof T] = obj[key];
        }
        return filtered;
    }, {} as Partial<T>);
}

export const ChildScenesStylesForm: FC = () => {
    const [type, setType] = useState<ThemesTypes | null>(null)
    const setScenesTheme = useExplorerState(state => state.setScenesTheme)
    const setGroupsTheme = useExplorerState(state => state.setGroupsTheme)
    const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
    const defaultValues = useSelectedHasSameStyles(type, selectedNodes.map(id => id))
    const cy = useExplorerState(state => state.cy)
    const scenesTheme = useExplorerState(state => state.scenesTheme)
    const groupsTheme = useExplorerState(state => state.groupsTheme)
    const setTouched = useExplorerState(state => state.setTouched)

    const selectHandler = () => {
        const types = new Set<'single' | 'group'>()
        const res = cy?.elements('node:selected').map(ele => {
            if ((ele as NodeSingular).isParent()) {
                types.add('group')
            } else {
                types.add('single')
            }
            return ele.id()
        }) || []

        if (types.size > 1) {
            setType('mix')
        } else {
            setType(Array.from(types)[0])
        }

        setSelectedNodes(res)
    }

    useEffect(() => {
        if (!cy) {
            return
        }
        const nodes = cy.elements('node')

        selectHandler()

        if (nodes) {
            cy.on('select', 'node', selectHandler)
            cy.on('unselect', 'node', selectHandler)

            return () => {
                cy.removeListener('select', 'node', selectHandler)
                cy.removeListener('unselect', 'node', selectHandler)
            }
        }
    }, [cy])

    if (type === 'mix') {
        return (
            <Alert
                severity="warning"
                sx={{
                    margin: '15px'
                }}
            >You selected group and single nodes. Please select one kind of nodes: singular or group</Alert>
        )
    }

    if (type === null || !selectedNodes.length) {
        return (
            <Alert
                severity="info"
                sx={{
                    margin: '15px'
                }}
            >Select any node to change its colors</Alert>
        )
    }

    const setTheme = type === 'single' ? setScenesTheme : setGroupsTheme
    const currentTheme = (type === 'single' ? scenesTheme : groupsTheme) || {}

    return (
        <Form<ScenesStyles[string] | GroupsStyles[string] | null>
            onChange={({ formData }) => {
                setTouched(true)
                if (!formData) {
                    return
                }

                selectedNodes.forEach((id) => {
                    if (!Object.keys(filterNullProperties(formData)).length) {
                        delete currentTheme[`node#${id}`]
                    } else {
                        currentTheme[`node#${id}`] = filterNullProperties({
                            ...(currentTheme[`node#${id}`] || {}),
                            ...formData
                        })
                    }
                })

                if (!Object.keys(filterNullProperties(currentTheme)).length) {
                    setTheme(null)
                } else {
                    setTheme({ ...currentTheme })
                }


            }}
            formData={defaultValues}
            schema={type === 'single' ? childScenesSchema : explorerGroupsStyles as any}
            validator={validator}
            uiSchema={{
                'ui:options': {
                    label: false,
                    title: ''
                }
            }}
            templates={{
                FieldTemplate: CustomFieldTemplate,
                ObjectFieldTemplate: CustomObjectField,
                BaseInputTemplate: CustomBaseInput,
                ButtonTemplates: {
                    SubmitButton: () => null,
                }
            }}
        />
    )
}