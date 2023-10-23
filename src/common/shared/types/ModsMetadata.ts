export interface ModsMetadataItem {
    value: string
    group: string
}

export interface ModsMetadata {
    actions: ModsMetadataItem[],
    furnitures: ModsMetadataItem[],
    actorTags: ModsMetadataItem[],
    sceneTags: ModsMetadataItem[]
}