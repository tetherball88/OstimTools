import archiver from 'archiver';
import fs from 'fs'
import path from 'path'
import { getPackConfigs } from '~bridge/nodejs/configs';
import { CombinedConfig } from "~bridge/types";
import { logger } from '~common/nodejs/utils';

export const archiveFomod = async (combinedConfig: CombinedConfig) => {
    const packOutputPath = combinedConfig.pack.outputPath
    const packConfig = await getPackConfigs(combinedConfig.pack.name)
    const promise = new Promise<void>((resolve, reject) => {
        const output = fs.createWriteStream(`${packOutputPath}\\${path.basename(packOutputPath)}.zip`);

        const archive = archiver('zip');
    
        output.on('close', () => {
            logger.log(`FOMOD archive created: ${archive.pointer()} total bytes`);
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

        packConfig.modules.forEach(moduleConfig => {
            const nemesisEnginePath = `Nemesis_Engine\\mod\\${moduleConfig.module.nemesisPrefix}\\`
            const hkxFilesFolder = `meshes\\actors\\character\\Animations\\${moduleConfig.module.name}\\`
            const scenesFilesFolder = `SKSE\\Plugins\\OStim\\scenes\\${moduleConfig.module.name}\\`
            
            archive.directory(`${packOutputPath}\\${nemesisEnginePath}`, `${moduleConfig.module.name}\\${nemesisEnginePath}`);
            archive.directory(`${packOutputPath}\\${hkxFilesFolder}`, `${moduleConfig.module.name}\\${hkxFilesFolder}`);
            archive.directory(`${packOutputPath}\\${scenesFilesFolder}`, `${moduleConfig.module.name}\\${scenesFilesFolder}`);
        })

        archive.directory(`${packOutputPath}\\fomod`, "")
        archive.directory(`${packOutputPath}\\SKSE\\Plugins\\OStim\\scenes\\packHubs`, "SKSE\\Plugins\\OStim\\scenes\\packHubs")
    
        // Finalize the archive (write to the output stream)
        archive.finalize();
    })
    
    return await promise
}

