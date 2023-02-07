import yaml from 'yaml';
import { readFile } from './readFile';

export const readYaml = async (filePath: string) => {
    return yaml.parse(await readFile(filePath));
}