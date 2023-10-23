import { TreeItem, TreeView } from '@mui/x-tree-view'
import { FC, MouseEvent, useEffect, useState } from "react";
import { invokeReadScene } from "~explorer/events/invokers";
import { FolderStructure } from "~explorer/nodejs/getFolderStructure";
import { useExplorerState } from "~explorer/ui/state/ExplorerState";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { EditorTreeViewMenu } from '~explorer/ui/components/JsonEditor/EditorTreeVIew/components/EditorTreeViewMenu';
import { IconButton, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

interface EditorTreeViewProps {
    onFileOpen: () => Promise<void>
}

const renderTree = (nodes: FolderStructure, onContextMenu: (name: string, event: MouseEvent) => void) => (
    <TreeItem
        key={nodes.name}
        nodeId={nodes.name}
        label={nodes.name}
        onContextMenu={(e) => {
            e.preventDefault()
            e.stopPropagation()

            onContextMenu(nodes.name, e)
        }}
    >
        {Array.isArray(nodes.children)
            ? nodes.children.map((node) => renderTree(node, onContextMenu))
            : null}
    </TreeItem>
);

const filterTree = (node: FolderStructure, query: string) => {
    if (!node) {
        return null;
    }

    if (!node.children) {
        if (node.name.toLowerCase().includes(query.toLowerCase())) {
            return { ...node }
        } else {
            return null
        }
    }

    const filteredNode: Required<FolderStructure> = { ...node, children: [] }

    for (const child of node.children) {
        const filteredChild = filterTree(child, query);
        if (filteredChild) {
            filteredNode.children.push(filteredChild);
        }
    }

    if (filteredNode.children.length > 0 || filteredNode.name.toLowerCase().includes(query.toLowerCase())) {
        return filteredNode;
    }

    return null;
}

export const EditorTreeView: FC<EditorTreeViewProps> = ({ onFileOpen }) => {
    const selectedModId = useExplorerState(state => state.selectedModId)
    const selectedSceneJson = useExplorerState(state => state.selectedSceneJson)
    const setSelectedSceneJson = useExplorerState(state => state.setSelectedSceneJson)
    const folderStructure = useExplorerState(state => state.folderStructure)
    const loadFolderStructure = useExplorerState(state => state.loadFolderStructure)
    const editorTouched = useExplorerState(state => state.editorTouched)
    const [selectedItem, setSelectedItem] = useState<string>('')
    const [query, setQuery] = useState('')
    const [expanded, setExpanded] = useState<string[]>([])
    const [contextMenu, setContextMenu] = useState<{
        top: number
        left: number
        selectedNode: FolderStructure
    } | null>(null)

    useEffect(() => {
        if(selectedSceneJson) {
            const path = selectedSceneJson.filePath.replaceAll('/', '\\')
            const scenesKeywordIndex = path.toLowerCase().indexOf('scenes')
            const currentExpanded = path.slice(scenesKeywordIndex).split('\\')
            const fileName = currentExpanded.pop() as string
            setExpanded(Array.from(new Set([...expanded, ...currentExpanded])))
            setSelectedItem(fileName)
        }
    }, [selectedSceneJson])

    useEffect(() => {
        if (!selectedModId) {
            return
        }

        loadFolderStructure()
    }, [selectedModId])

    if (!folderStructure) {
        return null
    }

    const onContextMenu = (name: string, e: MouseEvent) => {
        setContextMenu({
            top: e.clientY - 6,
            left: e.clientX + 2,
            selectedNode: folderStructure.flat[name],
        })
    }

    
    const filteredStructure = query ? filterTree(folderStructure.tree, query) : folderStructure.tree

    return (
        <>
            {!!contextMenu?.top && (
                <EditorTreeViewMenu
                    node={contextMenu.selectedNode}
                    handleClose={() => setContextMenu(null)}
                    anchorPosition={{ top: contextMenu.top, left: contextMenu.left }} />
            )}
            <TextField
                label="Search scene"
                value={query}
                size="small"
                fullWidth
                variant="filled"
                onChange={(e) => {
                    const value = e.target.value
                    setQuery(value)
                }}
                sx={{ mt: 1, mb: 1 }}
                InputProps={{
                    endAdornment: <IconButton onClick={() => setQuery('')}><ClearIcon /></IconButton>
                }}
            />
            <TreeView
                aria-label="file system navigator"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                defaultEndIcon={<TextSnippetIcon />}
                sx={{ 
                    height: 'calc(100% - 64px)', 
                    flexGrow: 1, 
                    overflowY: 'auto',
                    ['& .Mui-selected']: editorTouched ? {
                        color: (theme) => theme.palette.secondary.main
                    } : {}
                }}
                expanded={expanded}
                onNodeToggle={(e, ids) => {
                    setExpanded(ids)}
                }
                selected={selectedItem}
                onNodeSelect={async (e, nodeId) => {
                    const node = folderStructure.flat[nodeId]

                    if (!node.children) {
                        try {
                            await onFileOpen()
                        } catch (e) {
                            //
                        }

                        const sceneJson = await invokeReadScene(node.path)

                        setSelectedSceneJson({
                            fileName: node.name.replace(/\.json|\.JSON/, ''),
                            modPath: node.path.split('SKSE')[0],
                            content: sceneJson,
                            filePath: node.path
                        })

                    }
                }}
            >
                {filteredStructure && renderTree(filteredStructure, onContextMenu)}
            </TreeView>
        </>

    )
}