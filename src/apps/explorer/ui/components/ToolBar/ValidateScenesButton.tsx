import { useState, useEffect } from 'react'
import RuleIcon from '@mui/icons-material/Rule';
import { Badge, Button, Dialog, DialogContent, DialogTitle, List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material';
import { useExplorerState } from '~explorer/ui/state/ExplorerState';
import Ajv, { ErrorObject } from 'ajv'
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';

const validator = new Ajv()


export const ValidateScenesButton = () => {
    const [open, setOpen] = useState(false)
    const allScenes = useExplorerState(state => state.allScenes)
    const selectedModId = useExplorerState(state => state.selectedModId)
    const ostimSceneJsonSchema = useExplorerState(state => state.ostimSceneJsonSchema)
    const editScene = useExplorerState(state => state.editScene)
    const selectedModScenes = allScenes?.[selectedModId || ''] || []
    const [failedScenes, setFailedScenes] = useState<Record<string, ErrorObject[]>>({})

    useEffect(() => {
        if (!ostimSceneJsonSchema) {
            return
        }

        const validate = validator.compile(ostimSceneJsonSchema)

        const errors: Record<string, ErrorObject[]> = {}

        selectedModScenes.forEach(scene => {
            const valid = validate(scene.content)
            if (!valid) {
                errors[scene.fileName] = validate.errors as ErrorObject[]
            }
        })

        setFailedScenes(errors);
    }, [selectedModScenes])

    const onClick = () => {
        setOpen(true)
    }

    const amountFailedScenes = Object.keys(failedScenes).length

    return (
        <>
            <Tooltip title={amountFailedScenes > 0 ? 'Some scenes have errors' : 'All scenes are good'}>
                <Badge badgeContent={amountFailedScenes} color="error">
                    <Button onClick={onClick}><RuleIcon /></Button>
                </Badge>
            </Tooltip>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>
                    {amountFailedScenes > 0 ? 'Failed scenes' : 'All scenes are good'}
                </DialogTitle>
                <DialogContent sx={{ minWidth: '500px' }}>
                    {
                        amountFailedScenes === 0 ? <Typography>All scenes are valid.</Typography> : (
                            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                                {Object.entries(failedScenes).map(([id]) => {
                                    const sceneToEdit = selectedModScenes.find(({ fileName }) => fileName === id)
                                    return (
                                        <ListItem
                                            key={id}
                                            disableGutters
                                            secondaryAction={
                                                <Button variant="contained" onClick={() => sceneToEdit && editScene(sceneToEdit)}>
                                                    <AutoFixNormalIcon />
                                                </Button>
                                            }
                                        >
                                            <ListItemText primary={id} />
                                        </ListItem>
                                    )
                                })}
                            </List>
                        )
                    }

                </DialogContent>
            </Dialog>
        </>

    )
}