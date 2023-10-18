import fs from 'fs'
import childProcess from 'child_process';
import { CombinedConfig } from '~bridge/types';

const noHkanno = () => {
    throw new Error(`--- You don't have hkanno tool, please visit https://www.nexusmods.com/skyrimspecialedition/mods/54244 and download it and provide path in global settings.`);
};
const noHavok = () => {
    throw new Error(`--- Couldn't find installed Havok tools, please download it from here https://drive.google.com/open?id=0B8SgSQGjqypSMTNWSUloUWdKMEk and isntall if you want annotated hkx files`)
}

const checkHavokInstalled = `@echo off
setlocal

rem cd to here
cd /d %~dp0

rem HCT installed?
bin\\hct.exe`

export const verifyHavocTool = async () => {
    return new Promise((resolve, reject) => {
        const spawnedCmd = childProcess.spawn('cmd.exe', ['/c', checkHavokInstalled]);
        
        spawnedCmd.on('error', (err) => {
            reject(err)
        });
    
        spawnedCmd.on('exit', (code) => {
            if(code === 301) {
                resolve(false)
            }
            
            resolve(true)
        });

          
    })
   
}

export const checkHkanno = async ({ global: { hkannoExe: hkanno } }: CombinedConfig) => {
    if(hkanno) {
        try {
            await fs.promises.access(hkanno, fs.constants.F_OK);
        } catch(e) {
            noHkanno()
        }

        try {
            if(await verifyHavocTool()) {
                return true
            } else {
                noHavok()
            }
        } catch(e) {
            noHavok()
        }
        
        return true;
    } else {
        noHkanno()
    }

    throw new Error('--- Couldn\'t find hkanno or havoc installed');
}
