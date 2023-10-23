import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, ThemeProvider, createTheme } from "@mui/material";
import { FC, useCallback, useEffect, useRef } from "react";
import { Editor, useMonaco, OnMount, BeforeMount } from '@monaco-editor/react';
import { editor } from 'monaco-editor'
import { OstimScene } from "~common/shared/types/OstimScene";
import { useExplorerState } from "~explorer/ui/state/ExplorerState";
import { ExplorerOstimScene } from "~explorer/nodejs/readScenes";
import { emptyScene } from "~explorer/ui/components/JsonEditor/emptyScene";
import { useUpdateScene } from "~explorer/ui/graph/hooks/useUpdateScene";
import { useConfirm } from "material-ui-confirm";
import { EditorTreeView } from "~explorer/ui/components/JsonEditor/EditorTreeVIew/EditorTreeView";

export const prettifyJsonString = (scene: OstimScene | null): string => {
    try {
        return JSON.stringify(scene, null, "\t");
    } catch (err) {
        return JSON.stringify(scene);
    }
};

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export const JsonEditor: FC = () => {
    const schema = useExplorerState(state => state.ostimSceneJsonSchema)
    const setEditorTouched = useExplorerState(state => state.setEditorTouched)
    const editorTouched = useExplorerState(state => state.editorTouched)
    const monaco = useMonaco();
    const opened = useExplorerState(state => state.editorOpened)
    const setOpened = useExplorerState(state => state.setEditorOpened)
    const selectedScene = useExplorerState(state => state.selectedSceneJson)
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const updateScene = useUpdateScene()
    const confirmLoosingChanges = useConfirm()

    const onLooseChanges = async () => {
        if(editorTouched) {
            await confirmLoosingChanges({
                title: 'You didn\'t save changes',
                description: 'You made some changes to the file and didn\'t save them. Do you want to save them?',
                confirmationText: 'Save',
                cancellationText: 'Don\'t save'
            })

            return saveScene()
        }
    }

    const handleEditorUpdateValue = useCallback((value: ExplorerOstimScene | null) => {
        const editor = editorRef.current;
        if (!editor) return;

        editor.setValue(value ? prettifyJsonString(value.content) : emptyScene)

        value && editor.getAction("editor.action.formatDocument")?.run();
    }, []);

    useEffect(() => {
        handleEditorUpdateValue(selectedScene);
    }, [selectedScene])

    const selectedSceneRef = useRef<ExplorerOstimScene | null>(null)
    selectedSceneRef.current = selectedScene

    const saveScene = () => {
        if (selectedSceneRef.current && editorRef.current) {
            setEditorTouched(false)
            updateScene(selectedSceneRef.current, editorRef.current)
        }
    }

    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor;

        editor.getModel()?.updateOptions({ tabSize: 4, insertSpaces: false });

        if (monaco) {
            editor.addAction({
                id: 'file-save',
                label: 'Save',
                keybindings: [
                    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                ],
                run: saveScene,
                contextMenuGroupId: '1_modification'
            })
        }

        handleEditorUpdateValue(selectedScene)
    }

    const handleEditorWillMount: BeforeMount = () => {
        monaco?.languages.json.jsonDefaults.setDiagnosticsOptions({
            validate: true,
            schemas: schema
                ? [
                    {
                        uri: window.location.href, // id of the first schema
                        fileMatch: ["*"], // associate with our model
                        schema,
                    },
                ]
                : undefined,
            schemaValidation: 'error',
        });
    };

    const onClose = async () => {
        try {
            await onLooseChanges()
            
        } catch(e) {
            //
        }
        setOpened(false)
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Dialog open={opened} onClose={onClose} fullScreen>
                <DialogTitle>Edit scene json file</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '33% 67%',
                            height: '100%',
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                borderRight: '1px solid',
                                paddingRight: '10px',
                                marginRight: '10px',
                                maxHeight: '100%',
                                overflow: 'auto',
                                scrollbarWidth: 'thin',
                            }}
                        >
                            <EditorTreeView onFileOpen={async () => onLooseChanges()} />
                        </Box>
                        <Editor
                            language="json"
                            options={{
                                automaticLayout: true,
                                autoClosingBrackets: "always",
                                autoClosingQuotes: "always",
                                formatOnPaste: true,
                                formatOnType: true,
                                scrollBeyondLastLine: false,
                            }}
                            onMount={handleEditorDidMount}
                            beforeMount={handleEditorWillMount}
                            theme="vs-dark"
                            onChange={(val, e) => {
                                if(e.isFlush) {
                                    setEditorTouched(false)
                                } else {
                                    setEditorTouched(true)
                                }
                            }}
                        />
                    </Box>


                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                    <Button variant="contained" onClick={saveScene}>Save</Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>

    )
}