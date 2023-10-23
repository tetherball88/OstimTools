import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Tooltip } from "@mui/material";
import { FC, useEffect } from "react";

import { Controller, FormProvider, useForm } from "react-hook-form";
import { CREATE_FILE_OR_FOLDER, RENAME_FILE_OR_FOLDER } from "~common/events/events";
import { TextFieldDirectory } from "~common/ui/components";
import { emptyScene } from "~explorer/ui/components/JsonEditor/emptyScene";
import { useSendCommand } from "~explorer/ui/hooks/useSendCommand";
import { useExplorerState } from "~explorer/ui/state/ExplorerState";

export interface FileOrFolderData {
    name: string
    path: string
    extension?: string
}

const defaultValues = {
    name: '',
    path: '',
    extension: ''
}

const buildPath = (data: FileOrFolderData) => {
    return `${data.path}/${data.name}` + (data.extension ? `.${data.extension}` : '')
}

export const AddFileOrFolderForm: FC = () => {
    const fileOrFolder = useExplorerState(state => state.fileOrFolder)
    const methods = useForm<FileOrFolderData>({
        defaultValues
    })
    const setFileOrFolder = useExplorerState(state => state.setFileOrFolder)
    const selectedModConfig = useExplorerState(state => state.selectedModConfig)
    const sendCommand = useSendCommand()
    const editScene = useExplorerState(state => state.editScene)
    const loadFolderStructure = useExplorerState(state => state.loadFolderStructure)
    const isEdit = !!fileOrFolder?.name
    const isFile = !!fileOrFolder?.extension

    useEffect(() => {
        if(fileOrFolder) {
            methods.reset(fileOrFolder)
        } else {
            methods.reset(defaultValues)
        }
    }, [fileOrFolder])

    const onSave = async (data: FileOrFolderData) => {
        const finalPath = buildPath(data)
        if(isEdit) {
            await sendCommand(RENAME_FILE_OR_FOLDER, 'Creating...', buildPath(fileOrFolder), finalPath);
        } else {
            await sendCommand(CREATE_FILE_OR_FOLDER, 'Creating...', finalPath);
        }

        if (!isEdit && selectedModConfig && isFile) {
            editScene({
                fileName: data.name,
                filePath: finalPath,
                content: JSON.parse(emptyScene),
                modPath: selectedModConfig?.info.path,
            })
        }

        setFileOrFolder(null)
        loadFolderStructure()
    }

    return (
        <Dialog
            open={!!fileOrFolder}
            onClose={() => setFileOrFolder(null)}
        >
            <form onSubmit={methods.handleSubmit(onSave)}>
                <DialogTitle>{isEdit ? 'Edit' : 'Add'} {isFile ? 'file' : 'folder'}</DialogTitle>
                <DialogContent>
                    <FormProvider {...methods}>
                        <Box sx={{
                            marginTop: '5px',
                            marginBottom: '20px',
                            width: '400px'
                        }}>
                            <Controller
                                name="name"
                                control={methods.control}
                                render={({ field }) => (
                                    <Tooltip title="Name of new file/folder">
                                        <TextField
                                            {...field}
                                            value={field.value || ''}
                                            label="name"
                                            fullWidth
                                            InputProps={{
                                                endAdornment: fileOrFolder?.extension ? `.${fileOrFolder?.extension}` : ''
                                            }}
                                        />
                                    </Tooltip>
                                )}
                            />
                        </Box>

                        <Controller
                            name="path"
                            control={methods.control}
                            render={({ field }) => (
                                <Tooltip title={field.value || "Path to file/folder"}>
                                    <TextFieldDirectory
                                        {...field}
                                        disabled={!!fileOrFolder?.path}
                                        value={field.value || ''}
                                        label="path"
                                        dialogOptions={{
                                            defaultPath: `${selectedModConfig?.info.path}\\SKSE\\Plugins\\OStim\\scenes`
                                        }}
                                    />
                                </Tooltip>
                            )}
                        />

                    </FormProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFileOrFolder(null)}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}