import { AddonHubsKeys } from "~common/shared/types";
import { defaultHubPaths } from "./defaultHubPaths"

export const hubPathToId = (config: Record<AddonHubsKeys, string>) => {
    return Object.keys(config).reduce<Record<AddonHubsKeys, string>>((acc, key: AddonHubsKeys) => {
        const res = defaultHubPaths[key].split('\\').reverse();
        // 0 is filename
        res[0] = res[0].replace('.xml', '');
        // 2 is index of pos folder like StaSta
        res[2] = res[2].split(/(?=[A-Z])/).join('!');
        acc[key] = res.reverse().join('|');
        return acc
    }, {} as Record<AddonHubsKeys, string>)
}
