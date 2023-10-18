import { asyncReduce, glob, readYaml } from "~common/nodejs/utils";
import { getBridgeConfigPath } from "~bridge/nodejs/utils";
import { ModuleSections, ModuleSpecificConfig, PackFullConfig } from "~bridge/types";

const packsConfigsPath = `${getBridgeConfigPath()}\\packsConfigs`;

export const getPackConfigs = async (packName: string): Promise<PackFullConfig> => {
    const modulesPattern = `${packsConfigsPath}/${packName}\\modules\\*`;

    const packConfig = await (await glob(`${packsConfigsPath}/${packName}\\pack.{yml,yaml}`)).map(readYaml)[0];

    const modulesFiles = await glob(modulesPattern);
    let modules: ModuleSpecificConfig[] = []

    if (modulesFiles?.length) {
        modules = await Promise.all(modulesFiles.map(async modulePattern => {
            const modulePatterns = await glob(`${modulePattern}\\*.{yml,yaml}`);
            
            const moduleConfig = await asyncReduce<ModuleSpecificConfig, string>(modulePatterns, async (acc, file) => {
                const config = await readYaml(file) as Pick<ModuleSpecificConfig, ModuleSections>;


                return {
                    ...acc,
                    ...config,
                }
            }, {} as ModuleSpecificConfig);

            return moduleConfig;
        }));
    }


    return {
        ...packConfig,
        modules,
    }
}
