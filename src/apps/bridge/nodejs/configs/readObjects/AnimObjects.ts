export type AnimObjectsActor = { stage: number | 'all'; objects: string[] }
export type AnimObjects = Record<string, AnimObjectsActor[]>