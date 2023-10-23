import { Button, Tooltip } from "@mui/material"
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { FC, PropsWithChildren, useState } from "react";
import { ModInfoConfig } from "~explorer/types/ModsConfig";
import { ModInfoModal } from "~explorer/ui/components/AddModsButton/AddModsModal";

export const AddModButton: FC<PropsWithChildren> = ({children}) => {
    const [modToEdit, setModToEdit] = useState<ModInfoConfig | null>(null)
    const [opened, setOpened] = useState(false)

    return (
        <>
            <Tooltip title="Add mod">
                <Button variant="contained" onClick={() => {
                    setModToEdit(null)
                    setOpened(true)
                }}>{children ? children : <LibraryAddIcon />}</Button>
            </Tooltip>
            {opened && <ModInfoModal open={opened} onClose={() => setOpened(false)} defaultValues={modToEdit} />}
        </>
    )
}