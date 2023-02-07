import { AddonHubsKeys } from "~common/shared/types";

export const osaFolderScenePath = 'meshes\\0SA\\mod\\0Sex\\scene';

export const hubPatterns: Record<AddonHubsKeys, RegExp> = {
    main: /FmHub|FmBedHub/g,
    // bed: /FmBedHub/g,
    bench: /FmBenchHub/g,
    chair: /FmChairHub/g,
    table: /FmTableHub/g,
    wall: /FmWallHub/g
}