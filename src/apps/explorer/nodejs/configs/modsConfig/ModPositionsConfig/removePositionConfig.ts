import { logger } from '~common/nodejs/utils';
import { readModPositionsConfig } from '~explorer/nodejs/configs/modsConfig/ModPositionsConfig/readModPositionsConfig';
import { writeModPositionsConfig } from '~explorer/nodejs/configs/modsConfig/ModPositionsConfig/writeModPositionsConfig';

export const removePositionsConfig = async (modId:string, positionId: string) => {
    const config = await readModPositionsConfig(modId);

    if(!config) {
        return logger.error('You don\'t have stored positions config. Check if you didn\'t remove it manually from config folder.')
    }

    const index = config.findIndex(item => item.data.id === positionId);

    if(index === -1) {
        return logger.log(`Couldn't find store position for scene ${positionId} in stored positions. Nothing to remove from config.`);
    }

    config.splice(index, 1);

    await writeModPositionsConfig(modId, config);
}