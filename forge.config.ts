import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import express, { static as expressStatic } from 'express';
import { remove, copyFile, writeFile } from './src/common/nodejs/utils'

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';
import { Server } from 'http';
import fs from 'fs';

const pathToReleases = "D:\\ostimtools_release_server"
let server: Server | null = null

const config: ForgeConfig = {
    rebuildConfig: {},
    makers: [
        new MakerSquirrel({
            remoteReleases: "http://localhost:4001",
        }),
    ],
    packagerConfig: {
        asar: true,
        appVersion: "1.0.0",
    },
    plugins: [
        new WebpackPlugin({
            mainConfig,
            renderer: {
                config: rendererConfig,
                entryPoints: [
                    {
                        html: './src/index.html',
                        js: './src/renderer.ts',
                        name: 'main_window',
                        preload: {
                            js: './src/preload.ts',
                        },
                    },
                ],
            },
        }),
        
    ],
    publishers: [
        {
          name: '@electron-forge/publisher-github',
          config: {
            token: process.env.GITHUB_TOKEN,
            repository: {
              owner: 'tetherball88',
              name: 'OstimTools'
            },
            prerelease: false,
            draft: false
          }
        }
    ],
    hooks: {
        preMake: async () => {
            const releasesFilePath = `${pathToReleases}\\RELEASES`
            if(!fs.existsSync(releasesFilePath)) {
                writeFile(releasesFilePath, '');
            }
            const app = express();
            app.use(expressStatic(pathToReleases));
            server = app.listen(4001);
        },
        postMake: async (config, results) => {
            server?.close();
            server = null;

            const artifacts = results[0].artifacts.filter(art => fs.existsSync(art))
            
            for(const [index, art] of artifacts.entries()) {
                const fileName = art.split('\\').reverse()[0]
                try {
                    if(!fileName.endsWith('.exe')) {
                        await copyFile(art, `${pathToReleases}\\${art.split('\\').reverse()[0]}`)
                    }
                } catch(e) {
                    console.error(e);
                }

                //remove fill nupckg before publish
                if(fileName.endsWith('full.nupkg')) {
                    await remove(art)
                }

                if(!fs.existsSync(art)) {
                    artifacts.splice(index, 1);
                }
            }

            results[0].artifacts = artifacts

            return results
        }
    }
};

export default config;
