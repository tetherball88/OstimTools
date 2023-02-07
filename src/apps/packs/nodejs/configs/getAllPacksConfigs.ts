import { asyncReduce, glob, readYaml } from "~common/nodejs/utils";
import { getPackConfigs } from "~packs/nodejs/configs/packConfig";
import { getPacksConfigPath } from "~packs/nodejs/utils";
import { PackConfig, PackFullConfig } from "~packs/types";


const packsBaseConfigsPath = `${getPacksConfigPath()}\\packsConfigs\\**\\pack.yml`;

export const getAllPacksConfigs = async (): Promise<Record<string, PackFullConfig>> => {
    const files = await glob(packsBaseConfigsPath);
    if(!files?.length) {
        return {};
    }
    const packs = await Promise.all(files.map(async file => (await readYaml(file) as PackConfig).pack.name));

    return asyncReduce<Record<string, PackFullConfig>, string>(packs, async (acc, pack) => ({ ...acc, [pack]: await getPackConfigs(pack) }), {});
}