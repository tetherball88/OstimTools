import { Menu, MenuItem, PopoverPosition } from "@mui/material";
import { FC } from "react";
import { DELETE_FILE_OR_FOLDER } from "~common/events/events";
import { FolderStructure } from "~explorer/nodejs/getFolderStructure";
import { useSendCommand } from "~explorer/ui/hooks/useSendCommand";
import { useExplorerState } from "~explorer/ui/state/ExplorerState";

const useGetFolderMenuItems = (node: FolderStructure): EditorTreeViewMenuItem[] => {
    const setFileOrFolder = useExplorerState(state => state.setFileOrFolder)
    const loadFolderStructure = useExplorerState(state => state.loadFolderStructure)
    const sendCommand = useSendCommand()
    return [
        {
            label: 'add scene',
            onClick: () => {
                setFileOrFolder({
                    path: node.path,
                    name: '',
                    extension: 'json'
                })
            }
        },
        {
            label: 'add folder',
            onClick: () => {
                setFileOrFolder({
                    path: node.path,
                    name: ''
                })
            },
        },
        {
            label: 'rename',
            onClick: () => {
                const path = node.path.split('/')
                path.pop()
                setFileOrFolder({
                    path: path.join('/'),
                    name: node.name
                })
            }
        },
        {
            label: 'delete',
            onClick: async () => {
                await sendCommand(DELETE_FILE_OR_FOLDER, 'Deleting folder...', node.path)
                loadFolderStructure()
            }
        }
    ]
}

const useGetFileMenuItems = (node: FolderStructure): EditorTreeViewMenuItem[] => {
    const setFileOrFolder = useExplorerState(state => state.setFileOrFolder)
    const loadFolderStructure = useExplorerState(state => state.loadFolderStructure)
    const sendCommand = useSendCommand()
    return [
        {
            label: 'rename',
            onClick: () => {
                const [ext, name] = node.name.split('.').reverse()
                const path = node.path.split('/')
                path.pop()
                setFileOrFolder({
                    path: path.join('/'),
                    name: name,
                    extension: ext,
                })
            }
        },
        {
            label: 'delete',
            onClick: async () => {
                await sendCommand(DELETE_FILE_OR_FOLDER, 'Deleting folder...', node.path)
                loadFolderStructure()
            },
        }
    ]
}

export interface EditorTreeViewMenuItem {
    label: string
    onClick: () => void
}

interface EditorTreeViewMenuProps {
    node: FolderStructure
    handleClose: () => void
    anchorPosition: PopoverPosition
}

export const EditorTreeViewMenu: FC<EditorTreeViewMenuProps> = ({
    node,
    handleClose,
    anchorPosition,
}) => {
    const fileItems = useGetFileMenuItems(node)
    const folderItems = useGetFolderMenuItems(node)
    const isFile = node.name.toLowerCase().includes('json')
    const items = isFile ? fileItems : folderItems

    return (
        <Menu
            id="long-menu"
            anchorReference="anchorPosition"
            anchorPosition={anchorPosition} // Use the saved anchorPosition instead of anchorEl
            anchorOrigin={{
                vertical: "top",
                horizontal: "left"
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left"
            }}
            keepMounted
            open={!!anchorPosition}
            onClose={handleClose}
        >
            {items.map(({ label, onClick }) => (
                <MenuItem key={label} onClick={() => {
                    onClick()
                    handleClose()
                }}>
                    {label}
                </MenuItem>
            ))}
        </Menu>
    );
}