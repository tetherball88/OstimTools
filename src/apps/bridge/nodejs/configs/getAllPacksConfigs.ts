import { asyncReduce, glob, readYaml } from "~common/nodejs/utils";
import { getPackConfigs } from "~bridge/nodejs/configs/packConfig";
import { getBridgeConfigPath } from "~bridge/nodejs/utils";
import { PackConfig, PackFullConfig } from "~bridge/types";


const packsBaseConfigsPath = `${getBridgeConfigPath()}\\packsConfigs\\**\\pack.yml`;

export const getPacksConfigs = async (): Promise<Record<string, PackFullConfig>> => {
    const files = await glob(packsBaseConfigsPath);
    if(!files?.length) {
        return {};
    }
    const packs = await Promise.all(files.map(async file => (await readYaml(file) as PackConfig).pack.name));

    return asyncReduce<Record<string, PackFullConfig>, string>(packs, async (acc, pack) => ({ ...acc, [pack]: await getPackConfigs(pack) }), {});
}