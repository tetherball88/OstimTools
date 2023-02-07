import { getFileName, logger } from '~common/nodejs/utils';
import { CombinedConfig } from '~packs/types';

export const animNameRegex = /(.+)_?A(\d+)_S(.+)/i;
export const animNameOsaRegex = /(\w+)_(\w+)-(\w+)_(\d+)_(\d+)/i;

export function parseSlalName(file: string) {
    const fileName = getFileName(file);

    if (!animNameRegex.test(fileName)) {
        logger.error(`Couldn't parse slal file name: ${fileName}. It should follow next format: {whatever name here}A0_S0.hkx`);
        return null;
    }

    const [, id, actorIndex, stageIndex] = fileName.match(animNameRegex) as string[];

    return {
        id: id.toLowerCase(),
        actorIndex: parseInt(actorIndex),
        stageIndex: parseInt(stageIndex),
    }
}

export const parseAnimationPath = (path: string) => {
    const [fileName, animName, classFolder, posFolder] = path.split('/').reverse();

    return { fileName, animName, classFolder, posFolder };
}

export function capitalFirst(str?: string) {
    if (!str) return '';
    return str[0].toUpperCase() + str.slice(1)
}

const removeSlalPrefix = (name: string, prefix: string) => {
    while(new RegExp(`^${prefix}`, 'i').test(name)) {
        name = name.replace(new RegExp(`^${prefix}`, 'i'), '');
    }

    return name;
}

export function formatAnimName(name: string, prefix: string) {
    return removeSlalPrefix(name, prefix).split('_').map(word => word.toLowerCase()).join('');
}

export const getAnimNameFromSlalFile = (file: string, prefix: string) => {
    const parsed = parseSlalName(file);
    if(!parsed) {
        return;
    }
    return formatAnimName(parsed.id, prefix);
}

export const getActorIndexFromSlalFile = (file: string) => {
    return parseSlalName(file)?.actorIndex;
}

export const getStageIndexFromSlalFile = (file: string) => {
    return parseSlalName(file)?.stageIndex;
}

export function getAnimPrefix(actors: string, furniture?: string) {
    return `${actors}${capitalFirst(furniture)}`
}

export function getHubNameFromPrefix(prefix: string, config: CombinedConfig) {
    return `${config.module.name}${capitalFirst(prefix)}Hub`;
}

export function getHubName(config: CombinedConfig, actors: string, furniture?: string,) {
    return getHubNameFromPrefix(getAnimPrefix(actors, furniture), config);
}

/**
 * Function which adds spaces for xml content to make pretty tabulations
 * @param amount 
 * @returns 
 */
export function getTabs(amount: number) {
    const tab = '    ';
    return Array.from({ length: amount }, () => tab).join('')
}