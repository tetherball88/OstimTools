import archiver from "archiver";
import fs from "fs"
import { CombinedConfig } from "~bridge/types";
import { glob, logger } from "~common/nodejs/utils";

export const archiveSequence = async (combinedConfig: CombinedConfig): Promise<void> => {
    logger.log(`--- Started archiving sequences for ${combinedConfig.pack.name}`);
    const packOutputPath = combinedConfig.pack.outputPath

    const sequencesFiles = await glob(`${combinedConfig.outputSequencePath}\\**\\*.json`)
    if(!sequencesFiles.length) {
        logger.warn(`--- Pack ${combinedConfig.pack.name} doesn't have sequences. Skip archiving.`);
        return
    }

    await (new Promise<void>((resolve, reject) => {
        const output = fs.createWriteStream(`${packOutputPath}\\${combinedConfig.pack.name}Sequences.zip`);

        const archive = archiver('zip');
    
        output.on('close', () => {
            logger.log(`Archive created: ${archive.pointer()} total bytes`);
            resolve()
        });

        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
            // log warning
            } else {
            // throw error
            throw err;
            }
        });
    
        archive.on('error', (err: any) => {
            reject(err);
        });

        // pipe archive data to the file
        archive.pipe(output);

        const sequencesFilesFolder = `SKSE\\Plugins\\OStim\\sequences\\`
    
        archive.directory(`${packOutputPath}\\${sequencesFilesFolder}`, sequencesFilesFolder);
    
        // Finalize the archive (write to the output stream)
        archive.finalize();
    }))

    logger.log(`--- Finished archiving sequences for ${combinedConfig.pack.name}`);
    
}