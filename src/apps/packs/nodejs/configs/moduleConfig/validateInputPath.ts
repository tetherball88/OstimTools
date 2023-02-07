import { glob } from "~common/nodejs/utils";

export const validateInputPath = async (inputPath: string) => {
    const files = await glob(`${inputPath}\\*.hkx`);

    return !!files?.length;
}