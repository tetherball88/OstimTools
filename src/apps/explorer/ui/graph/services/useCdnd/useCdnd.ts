import { NodeCollection, NodeSingular } from 'cytoscape';
import { useEffect, useRef } from 'react';
import { ModGroupsConfig } from '~explorer/types/ModsConfig';
import { useUpdateGroup } from '~explorer/ui/graph/hooks/useUpdateGroup';
import { useExplorerState } from "~explorer/ui/state/ExplorerState"

export const useCdnd = () => {
    const cy = useExplorerState(state => state.cy)
    const setGroupToEdit = useExplorerState(state => state.setGroupToEdit)
    const selectedModConfig = useExplorerState(state => state.selectedModConfig)
    const updateGroup = useUpdateGroup()
    const parentRef = useRef<NodeSingular | null>(null)
    const groupsRef = useRef<ModGroupsConfig | undefined>()
    groupsRef.current = selectedModConfig?.groups

    const onDrop = async (event: any, dropParent: NodeCollection, dropSibling: NodeCollection) => {
        parentRef.current = dropParent.first() || null
        const parentId = parentRef.current?.id()
        const siblingId = dropSibling.first().id()
        const group = groupsRef.current?.[parentId]
        const currentChildren = group?.children

        if (group && event.target.parent()) {
            const addChildren = []
            if (siblingId && !currentChildren?.includes(siblingId)) {
                addChildren.push(siblingId)
            }
            if(event.target.id() && !currentChildren?.includes(event.target.id())) {
                addChildren.push(event.target.id())
            }
            updateGroup(parentId, group.name, addChildren)
        }

        if (!parentRef.current || !cy || group) {
            return
        }

        if (!parentRef.current.id()) {
            return
        }

        setGroupToEdit({
            id: parentRef.current.id(),
            name: '',
            children: parentRef.current.children().map(ele => ele.id())
        })
    }

    const onOut = (event: any, dropTarget: NodeSingular) => {
        const parentId = dropTarget.id()
        const group = groupsRef.current?.[parentId]
        if(!group) {
            return
        }
        updateGroup(dropTarget.id(), group.name, undefined, [event.target.id()])
    }

    useEffect(() => {
        cy?.on('cdnddrop', onDrop)
        cy?.on('cdndout ', onOut)

        return () => {
            cy?.off('cdnddrop', onDrop)
            cy?.off('cdndout ', onOut)
        }
    }, [cy])
}