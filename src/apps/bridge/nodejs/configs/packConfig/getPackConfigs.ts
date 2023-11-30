import { asyncReduce, glob, readYaml, writeYaml } from "~common/nodejs/utils";
import { getBridgeConfigPath } from "~bridge/nodejs/utils";
import { ModuleFurnitureMapConfigDeprecated, ModuleFurnitureMapConfigItem, ModuleSections, ModuleSpecificConfig, PackFullConfig } from "~bridge/types";

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

                if(file.includes('furnitureMap.yml')) {
                    const furnitureMapConfig = config as any as ModuleFurnitureMapConfigDeprecated

                    if(!Array.isArray(furnitureMapConfig.furnitureMap)) {
                        const furnitureArr = Object.entries(furnitureMapConfig.furnitureMap).reduce<ModuleFurnitureMapConfigItem[]>((acc, [furnitureName, animations]) => {
                            animations.forEach(anim => acc.push({
                                animation: anim,
                                furniture: furnitureName,
                            }))

                            return acc;
                        }, []);

                        writeYaml(file, { furnitureMap: furnitureArr })
                    }
                }


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
