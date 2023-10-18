import { CombinedConfig } from "~bridge/types";

export const checkIfAnimationExcluded = (animName: string, config: CombinedConfig) => {
    const { module: { include, exclude } } = config
    if(include?.length && !include.includes(animName)) {
        return true;
    }

    if(exclude?.includes(animName)) {
        return true;
    }

    return false
}