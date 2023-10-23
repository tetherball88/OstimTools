import { StateCreator } from "zustand"

export interface EditGroup {
    id: string
    name: string
    children: string[]
    reLayoutChildren?: boolean
}

interface GroupsSlice {
    groupToEdit: EditGroup | null
    groupFormMode: 'create' | 'edit'
    setGroupToEdit: (groupToEdit: EditGroup | null, mode?: 'create' | 'edit') => void
}

export const groupsSlice: StateCreator<GroupsSlice> = (set) => ({
    groupToEdit: null,
    groupFormMode: 'create',
    setGroupToEdit: (groupToEdit, groupFormMode = 'create') => set(state => {
        return ({
            ...state,
            groupToEdit,
            groupFormMode
        })}
    ),
})