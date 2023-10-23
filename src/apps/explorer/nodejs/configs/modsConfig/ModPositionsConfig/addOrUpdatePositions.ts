import { logger } from '~common/nodejs/utils';
import { readModPositionsConfig } from '~explorer/nodejs/configs/modsConfig/ModPositionsConfig/readModPositionsConfig';
import { writeModPositionsConfig } from '~explorer/nodejs/configs/modsConfig/ModPositionsConfig/writeModPositionsConfig';
import { PositionsConfigItem } from '~explorer/types/PositionsConfig';

export const addOrUpdatePositions = async (modId: string, eles: PositionsConfigItem[]) => {
    const config = await readModPositionsConfig(modId);

    if(!config) {
        return logger.error('You don\'t have stored positions config. Check if you didn\'t remove it manually from config folder.');
    }

    for(const ele of eles) {
        const foundIndex = config.findIndex(({ data }) => data.id === ele.data.id)

        if(foundIndex !== -1) {
            config[foundIndex] = ele;
        } else {
            config.push(ele);
        }
    }

    await writeModPositionsConfig(modId, config);
}