import { AddonHubsKeys } from "~common/shared/types"

export interface AddonMainConfig {
    main: {
        addonHubPath: string
        // generatedPacksPath: string
        outputPath: string
        prependNewOptions: boolean
    }
}

export type ModToConnect = {
    name: string
    isGenerated: boolean
    path: string
    selectedHub?: AddonHubsKeys
}

export interface ModsToConnect {
    modsToConnect: ModToConnect[]
}

export interface AddonHubs {
    addonHubs: Record<AddonHubsKeys, string>
}

export interface AddonConfig extends AddonMainConfig, ModsToConnect, AddonHubs {}

export interface JsonParsedXmlOption {
    $: {
        halo: string,
        icon: string,
        go: string,
        text: string,
        t0: string
    },
    enhance: [
        { $: { a: string } }
    ],
    hhue: [
        { $: { n: string, cmd: string, a: string } }
    ],
    ihue: [
        { $: { cmd: string, a: string } },
        { $: { n: string, cmd: string, a: string } }
    ]
}

export type OptionsByHub = Record<AddonHubsKeys, JsonParsedXmlOption[]>