export abstract class WebStorage<Value> {
    protected storage: Storage

    constructor(protected key: string, type: 'local' | 'session' = 'local') {
        this.storage = type === 'local' ? window.localStorage : window.sessionStorage
    }

    abstract setItem(value: Value): void
    abstract getItem(): Value | null
    
    removeItem() {
        this.storage.removeItem(this.key)
    }
}