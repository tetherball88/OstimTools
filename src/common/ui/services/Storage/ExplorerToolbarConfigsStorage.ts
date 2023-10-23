import { WebStorage } from "~common/ui/services/Storage/Storage"
import { ExplorerNavTypes } from "~explorer/ui/graph/buildScenesGraphData";

type ToggleEdgesKeys = ExplorerNavTypes | 'tmp-shown'

interface ExplorerToolbarConfigs {
    toggleEdges?: Record<ToggleEdgesKeys, boolean>
    toggleEdgeLabels?: boolean
}

class ExplorerToolbarConfigsStorage extends WebStorage<ExplorerToolbarConfigs> {
    setItem(config: ExplorerToolbarConfigs) {
        this.storage.setItem(this.key, JSON.stringify(config))
    }
    getItem() {
        return (JSON.parse(this.storage.getItem(this.key) || '{}')) as ExplorerToolbarConfigs;
    }

    getToggleEdges() {
        return this.getItem().toggleEdges || {
            'tmp-shown': false,
            'transOrigin': true, 
            'transDestination': true,
            'navOrigin': true,
            'navDestination': true,
            'autoTransActor': true,
            'autoTrans': true
        }
    }

    setToggledEdges(toggleType: ToggleEdgesKeys, enabled: boolean) {
        const currentConfig = this.getItem()
        const toggleEdgesConfig = this.getToggleEdges()

        this.setItem({
            ...currentConfig,
            toggleEdges: {
                ...toggleEdgesConfig,
                [toggleType]: enabled
            }
        })
    }

    getToggleEdgeLabels() {
        return this.getItem().toggleEdgeLabels ?? true
    }

    setToggleEdgeLabels(enabled: boolean) {
        this.setItem({
            ...this.getItem(),
            toggleEdgeLabels: enabled,
        })
    }
}

export const explorerToolbarConfigsStorage = new ExplorerToolbarConfigsStorage('explorer-toolbar-configs')