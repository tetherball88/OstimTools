import { CombinedConfig, OstimConfigSequence } from '~bridge/types';
import { writeJson } from '~common/nodejs/utils';

export const renderSequence = async (animName: string, sequence: OstimConfigSequence, config: CombinedConfig) => {
    const {
        outputSequencePath,
    } = config

    return await writeJson(`${outputSequencePath}\\${animName}Seq.json`, sequence);
}
