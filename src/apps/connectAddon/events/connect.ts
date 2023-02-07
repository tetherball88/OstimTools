import { ipcMain } from 'electron';

import { handleConnectAddon, handleConnectAddonLoadConfigs, handleConnectAddonWriteConfigs, handleValidateAllHubXmls, handleValidateParticularHubXml, handleValidateSourceModFolderOrFile } from './handlers';
import { CONECT_ADDON_RUN, CONECT_ADDON_LOAD_CONFIGS, CONECT_ADDON_WRITE_CONFIGS, VALIDATE_ALL_ADDON_HUB_XML, VALIDATE_PARTICULAR_ADDON_HUB_XML, VALIDATE_SOURCE_MOD_FOLDER_OR_FILE } from './events';

ipcMain.handle(CONECT_ADDON_RUN, handleConnectAddon)
ipcMain.handle(CONECT_ADDON_LOAD_CONFIGS, handleConnectAddonLoadConfigs)
ipcMain.handle(CONECT_ADDON_WRITE_CONFIGS, handleConnectAddonWriteConfigs)

ipcMain.handle(VALIDATE_ALL_ADDON_HUB_XML, handleValidateAllHubXmls)
ipcMain.handle(VALIDATE_PARTICULAR_ADDON_HUB_XML, handleValidateParticularHubXml)
ipcMain.handle(VALIDATE_SOURCE_MOD_FOLDER_OR_FILE, handleValidateSourceModFolderOrFile)

console.log('AAAAAAA')