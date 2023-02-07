import yaml from 'yaml';
import { writeFile } from './writeFile';

export const writeYaml = (file: string, content: any) => {
    return writeFile(file, yaml.stringify(content, { indent: 4 }));
}