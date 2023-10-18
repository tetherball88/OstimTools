import { GlobalConfig } from "./GlobalConfig";
import { PackConfig, PackModuleConfig, PackFullConfig } from "./PackConfig";

export interface CombinedConfig extends Omit<PackConfig, 'modules'>, PackModuleConfig {
    global: GlobalConfig
}

export type AllConfigs = Record<string, PackFullConfig>