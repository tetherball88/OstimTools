import { FC, useCallback } from "react";
import { Button, Divider, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { SceneTagsAutocomplete } from "~explorer/ui/components/SceneTagsAutocomplete";
import { Core, NodeSingular } from "cytoscape";
import { ActorTagsAutocomplete } from "~explorer/ui/components/ActorTagsAutocomplete";
import { useExplorerState } from "~explorer/ui/state/ExplorerState";
import { getSceneFromCyEle } from "~explorer/ui/utils/getSceneFromCyElement";
import { SceneActionsAutocomplete } from "~explorer/ui/components/SceneActionsAutocomplete";

const removeHidden = (cy: Core) => {
    cy.batch(() => {
        cy.nodes(':childless').removeClass('found');
    });
}

const filter = (cy: Core, f: (ele: NodeSingular, i: number) => boolean) => {
    cy.batch(() => {
        cy.nodes(':childless')
            ?.filter(f)
            .addClass('found')
    })
}

export const Filters: FC = () => {
    const cy = useExplorerState(state => state.cy)
    const filters = useExplorerState(state => state.filters)
    const setFilters = useExplorerState(state => state.setFilters)

    const handleClear = () => {
        if (!cy) {
            return;
        }

        removeHidden(cy);
        setFilters({
            bySceneName: '',
            bySceneId: '',
            bySceneTags: [],
            byActorTags: [],
            byActions: [],
        });
    }

    const handleSearch = useCallback(() => {
        if (!cy) {
            return;
        }

        removeHidden(cy);

        filter(cy, (ele) => {
            if (filters.bySceneName && !ele.data('label').toLowerCase().includes(filters.bySceneName.toLowerCase())) {

                return false;
            }

            if (filters.bySceneId && !ele.id().toLowerCase().includes(filters.bySceneId.toLowerCase())) {
                return false;
            }

            if (filters.byActions.length) {
                let match = false;
                for (const val of filters.byActions) {
                    if (getSceneFromCyEle(ele)?.content.actions?.find(({ type }) => type === val)) {
                        match = true
                        break
                    }
                }

                if (!match) {
                    return false
                }
            }

            if (filters.bySceneTags.length) {
                let match = false;
                for (const val of filters.bySceneTags) {
                    if (getSceneFromCyEle(ele)?.content.tags?.includes(val as any)) {
                        match = true
                        break
                    }
                }

                if (!match) {
                    return false
                }
            }

            if (filters.byActorTags.length) {
                let match = false;
                for (const actor of (getSceneFromCyEle(ele)?.content.actors || [])) {
                    for (const val of filters.byActorTags) {
                        if (actor.tags?.includes(val as any)) {
                            match = true;
                        }
                    }
                }

                if (!match) {
                    return false;
                }
            }

            return true;
        })
    }, [filters])

    return (
        <form onSubmit={(e) => {
            e.preventDefault();

            handleSearch()
        }}>
            <Typography variant="h6" sx={{ mr: 1, p: 2 }}>Filter scenes</Typography>
            <Divider />
            
            <Box
                sx={{
                    p: 2,
                    pt: 4,
                    width: '300px'
                }}
            >
                <TextField
                    label="Search scene by name"
                    value={filters.bySceneName}
                    onChange={(e) => setFilters({ ...filters, bySceneName: e.target.value })}
                    fullWidth
                    sx={{ mb: 3 }}
                />
                <TextField
                    label="Search scene by id"
                    value={filters.bySceneId}
                    onChange={(e) => setFilters({ ...filters, bySceneId: e.target.value })}
                    fullWidth
                    sx={{ mb: 3 }}
                />
                <SceneActionsAutocomplete
                    value={filters.byActions}
                    onChange={(value: any[]) => setFilters({ ...filters, byActions: [...value] })}
                    FieldProps={{
                        label: 'Filter by actions',
                        placeholder: 'Select actions'
                    }}
                    sx={{ mb: 3 }}
                    disableCloseOnSelect
                />
                <SceneTagsAutocomplete
                    value={filters.bySceneTags}
                    onChange={(value: any[]) => setFilters({ ...filters, bySceneTags: [...value] })}
                    FieldProps={{
                        label: 'Filter by scene tags',
                        placeholder: 'Select scene tags'
                    }}
                    sx={{ mb: 3 }}
                    disableCloseOnSelect
                />
                <ActorTagsAutocomplete
                    value={filters.byActorTags}
                    onChange={(value: any[]) => setFilters({ ...filters, byActorTags: [...value] })}
                    defaultValue={[]}
                    FieldProps={{
                        label: 'Filter by scene tags',
                        placeholder: 'Select scene tags'
                    }}
                    sx={{ mb: 2 }}
                    disableCloseOnSelect
                />
            </Box>
            <Divider />
            <Box
                sx={{
                    display: "flex",
                    p: 2,
                }}
            >
                <Button
                    variant="outlined"
                    onClick={handleClear}
                    sx={{ flexGrow: 1, mr: 1 }}
                >Clear</Button>
                <Button
                    variant="contained"
                    onClick={handleSearch}
                    sx={{ flexGrow: 1 }}
                    type="submit"
                >Search</Button>
            </Box>
        </form>
    )
}