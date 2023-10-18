import fs from 'fs';

export const validateNemesisTransitionToolPath = async (nemesisExe?: string) => {
    const reasons: string[] = [];

    if(!nemesisExe) {
        reasons.push("You didn't rpovide 'Animlist Transition Tool.exe' path.");
    }

    if(nemesisExe && !fs.existsSync(nemesisExe)) {
        reasons.push("Couldn't find 'Animlist Transition Tool.exe' file in provided path.");
    }

    if(!reasons.length) {
        return '';
    }

    return reasons.join('\n');
}