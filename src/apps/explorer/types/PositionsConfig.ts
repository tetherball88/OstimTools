export interface PositionsConfigItem {
    data: {
        id: string
    }
    position: {
        x: number
        y: number
    }
}

export type PositionsConfig = PositionsConfigItem[]