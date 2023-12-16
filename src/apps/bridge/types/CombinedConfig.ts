import { OstimAlignmentJson } from "~bridge/nodejs/utils/checkAlignmentJson";
import { GlobalConfig } from "./GlobalConfig";
import { PackConfig, PackModuleConfig, PackFullConfig } from "./PackConfig";

export interface CombinedConfig extends Omit<PackConfig, 'modules'>, PackModuleConfig {
    global: GlobalConfig
    alignment: OstimAlignmentJson | null
}

export type AllConfigs = Record<string, PackFullConfig>