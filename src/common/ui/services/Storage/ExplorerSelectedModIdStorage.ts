import { WebStorage } from "~common/ui/services/Storage/Storage"

class ExplorerSelectedModIdStorage extends WebStorage<string> {
    setItem(value: string) {
        this.storage.setItem(this.key, value)
    }
    getItem() {
        return this.storage.getItem(this.key);
    }
}

export const explorerSelectedModIdStorage = new ExplorerSelectedModIdStorage('explorer-selected-mod-id')