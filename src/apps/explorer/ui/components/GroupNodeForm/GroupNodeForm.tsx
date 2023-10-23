import { Checkbox, FormControlLabel, TextField } from '@mui/material'
import { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { AutocompleteWithCheckboxesControlled } from '~common/ui/components'
import { useExplorerState } from '~explorer/ui/state/ExplorerState'
import { EditGroup } from '~explorer/ui/state/slices/groupsSlice'

export const GroupNodeForm: FC = () => {
    const allScenes = useExplorerState(state => state.allScenes)
    const selectedModId = useExplorerState(state => state.selectedModId)
    const modScenes = allScenes?.[selectedModId || ''] || []
    
    const methods = useFormContext<EditGroup>()

    return (
        <>
            <Controller
                name="reLayoutChildren"
                control={methods.control}
                defaultValue={false}
                render={({ field }) => (
                    <FormControlLabel
                        control={
                            <Checkbox {...field} />
                        } 
                        label="Do you want to relayout scenes inside group" 
                    />
                )}
            />
            <Controller
                name="name"
                control={methods.control}
                defaultValue=''
                rules={{
                    required: 'Please enter name of new group'
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Group name"
                        fullWidth
                        sx={{ marginTop: 3 }}
                        error={!!methods.formState.errors.name}
                        helperText={methods.formState.errors.name?.message}
                    />
                )}
            />
            <AutocompleteWithCheckboxesControlled<EditGroup, string>
                formControl={{
                    name: 'children',
                    rules: {
                        required: 'Please enter name of new group'
                    }
                }}
                disableCloseOnSelect
                options={modScenes.map(({ fileName }) => fileName)}
                getOptionLabel={o => o}
                sx={{ marginTop: 3, minWidth: '300px' }}
                FieldProps={{
                    label: 'Scenes',
                    placeholder: 'Select scene for group'
                }}
            />
        </>
    )
}