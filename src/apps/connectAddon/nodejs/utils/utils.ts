import { osaFolderScenePath } from "~common/shared/utils";

export const separateByCapitalLetters = (str: string) => {
    return str.match(/[A-Z][a-z]+/g);
}

export const directorySearchPattern = (generatedPacksPath: string) => `${generatedPacksPath}\\${osaFolderScenePath}\\**\\Hubs\\*.xml`.replace(/\\/g, '/');