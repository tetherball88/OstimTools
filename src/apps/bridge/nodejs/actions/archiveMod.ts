import fs from 'fs'
import archiver from 'archiver'
import { CombinedConfig } from '~bridge/types';
import { logger } from '~common/nodejs/utils';

export const archiveMod = (combinedConfig: CombinedConfig): Promise<void> => {
    const packOutputPath = combinedConfig.pack.outputPath
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(`${packOutputPath}\\${combinedConfig.module.name}.zip`);

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

        const nemesisEnginePath = `Nemesis_Engine\\mod\\${combinedConfig.module.nemesisPrefix}\\`
        const hkxFilesFolder = `meshes\\actors\\character\\Animations\\${combinedConfig.module.name}\\`
        const scenesFilesFolder = `SKSE\\Plugins\\OStim\\scenes\\${combinedConfig.module.name}\\`
    
        archive.directory(`${packOutputPath}\\${nemesisEnginePath}`, nemesisEnginePath);
        archive.directory(`${packOutputPath}\\${hkxFilesFolder}`, hkxFilesFolder);
        archive.directory(`${packOutputPath}\\${scenesFilesFolder}`, scenesFilesFolder);
    
        // Finalize the archive (write to the output stream)
        archive.finalize();
    })
    
}