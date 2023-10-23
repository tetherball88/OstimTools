import { FC } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { FormProvider, useForm } from "react-hook-form"
import { useExplorerState } from '~explorer/ui/state/ExplorerState';
import { EditGroup } from '~explorer/ui/state/slices/groupsSlice';
import { useCreateGroup } from '~explorer/ui/graph/hooks/useCreateGroup';
import { useUpdateGroup } from '~explorer/ui/graph/hooks/useUpdateGroup';
import { GroupNodeForm } from '~explorer/ui/components/GroupNodeForm/GroupNodeForm';
import { useUpdateMultiplePositions } from '~explorer/ui/hooks/useUpdateMultiplePositions';

export const GroupNodeDialog: FC = () => {
    const cy = useExplorerState(state => state.cy)
    const groupToEdit = useExplorerState(state => state.groupToEdit)
    const groupFormMode = useExplorerState(state => state.groupFormMode)
    const setGroupToEdit = useExplorerState(state => state.setGroupToEdit)
    const updateMultiplePositions  = useUpdateMultiplePositions()

    const methods = useForm<EditGroup>({
        defaultValues: groupToEdit || {
            name: '',
            children: []
        }
    })

    const groupId = groupToEdit?.id
    const group = cy?.nodes(`#${groupId}`)
    const createGroup = useCreateGroup()
    const updateGroup = useUpdateGroup()
    const closeHandler = () => {
        setGroupToEdit(null)
    }

    const onCancel = () => {
        closeHandler()
        if (groupFormMode === 'create') {
            const children = group?.children()
            children?.forEach(node => {
                node.move({
                    parent: null
                })
            })
            group?.remove()
        }

    }

    const updateNodes = (name: string, children: string[]) => {
        if (!groupId) {
            return
        }

        group?.data('label', name)

        /**
         * Remove nodes from group if they were changed in form
         */
        cy?.nodes(`[parent = "${groupId}"]`).forEach(node => {
            if (!children.includes(node.id())) {
                node.move({
                    parent: null
                })
            }
        })

        /**
         * Add nodes to group if they were changed in form
         */
        children.forEach(child => {
            const node = cy?.nodes(`#${child}`).first()
            if (node && node.parent().first().id() !== groupId) {
                node.move({
                    parent: groupId
                })
            }
        })

        
    }

    const onSave = (data: EditGroup) => {
        if (!groupId) {
            return
        }

        const scenesToAdd: string[] = []
        let scenesToRemove = [...groupToEdit.children]

        data.children.forEach(child => {
            if (!groupToEdit.children.includes(child)) {
                scenesToAdd.push(child);
            } else {
                scenesToRemove = scenesToRemove.filter(scene => scene !== child)
            }
        })

        updateNodes(data.name, data.children)

        if(data.reLayoutChildren) {
            const children = cy?.nodes(data.children.map(child => `#${child}`).join(','))

            const layout = children?.layout({
                name: 'grid',
                cols: 1,
                avoidOverlap: true,
                avoidOverlapPadding: 30,
                boundingBox: {
                    x1: children.first().position().x,
                    y1: children.first().position().y,
                    w: children.length * 100,
                    h: children.length * 100
                }
            })

            layout?.run()

            updateMultiplePositions(children?.toArray() || [])
        }

        if (groupFormMode === 'create') {
            createGroup(groupId, data.name, data.children)
        } else {
            updateGroup(groupId, data.name, scenesToAdd, scenesToRemove)
        }

        closeHandler()
    }

    return (
        <Dialog open={!!groupToEdit} onClose={onCancel}>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSave)}>
                    <DialogTitle>Create group</DialogTitle>
                    <DialogContent>
                        <GroupNodeForm />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={onCancel}>Cancel</Button>
                        <Button variant="contained" type="submit">Save</Button>
                    </DialogActions>
                </form>
            </FormProvider>
        </Dialog>
    )
}