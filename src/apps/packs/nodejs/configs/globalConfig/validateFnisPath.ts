import fs from 'fs';
import { fnisPathes } from "./fnisPathes";

export const validateFnisPath = async (fnisPath: string) => {
    const { exe, output } = fnisPathes(fnisPath);
    const reasons: string[] = [];

    if(!fs.existsSync(exe)) {
        reasons.push("Couldn't find 'GenerateFNISforModders.exe' file in provided path.");
    }

    if(!fs.existsSync(output)) {
        reasons.push("Couldn't find FNIS' bheavior output folder where it's supposed to be.");
    }

    if(reasons.length) {
        reasons.push("Make sure folder structure in your fnis folder is exactly as it's when you extract from nexus' archive.");
    }

    if(!reasons.length) {
        return '';
    }

    return reasons.join('\n');
}