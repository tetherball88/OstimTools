import { ipcMain } from 'electron';
import { handleRunAll, handleCopyFiles, handleSceneHubs, handleScenes, handleHubs, handleXmlToJson, handleCleanModule, handleCleanHkxFiles, handleCleanFnisFiles, handleCleanScenes, handleCleanHubs, handleRemoveModule, handleRemovePack, handleLoadConfigs, handleGetAllAnimations, handleWritePackConfig, handleWriteModuleConfig, handleWriteGlobalConfig, handleLoadGlobalConfig, handleValidateFnisPath, handleValidateInputPath, handleValidateSlalJsonPath } from './handlers';
import { RUN_ALL, RUN_COPY_FILES, RUN_SCENES_HUBS, RUN_SCENES, RUN_HUBS, XML_TO_JSON, CLEAN_MODULE, CLEAN_HKX, CLEAN_FNIS, CLEAN_SCENES, CLEAN_HUBS, REMOVE_MODULE, REMOVE_PACK, LOAD_CONFIGS, GET_ALL_ANIMATIONS, WRITE_PACK_CONFIG, WRITE_MODULE_CONFIG, WRITE_GLOBAL_CONFIG, LOAD_GLOBAL_CONFIG, VALIDATE_FNIS_PATH, VALIDATE_INPUT_PATH, VALIDATE_SLAL_JSON_PATH } from './events';

ipcMain.handle(RUN_ALL, handleRunAll);
ipcMain.handle(RUN_COPY_FILES, handleCopyFiles);
ipcMain.handle(RUN_SCENES_HUBS, handleSceneHubs);
ipcMain.handle(RUN_SCENES, handleScenes);
ipcMain.handle(RUN_HUBS, handleHubs);
ipcMain.handle(XML_TO_JSON, handleXmlToJson);
ipcMain.handle(CLEAN_MODULE, handleCleanModule);
ipcMain.handle(CLEAN_HKX, handleCleanHkxFiles);
ipcMain.handle(CLEAN_FNIS, handleCleanFnisFiles);
ipcMain.handle(CLEAN_SCENES, handleCleanScenes);
ipcMain.handle(CLEAN_HUBS, handleCleanHubs);
ipcMain.handle(REMOVE_MODULE, handleRemoveModule);
ipcMain.handle(REMOVE_PACK, handleRemovePack);
ipcMain.handle(LOAD_CONFIGS, handleLoadConfigs);
ipcMain.handle(GET_ALL_ANIMATIONS, handleGetAllAnimations);
ipcMain.handle(WRITE_PACK_CONFIG, handleWritePackConfig)
ipcMain.handle(WRITE_MODULE_CONFIG, handleWriteModuleConfig)
ipcMain.handle(WRITE_GLOBAL_CONFIG, handleWriteGlobalConfig)
ipcMain.handle(LOAD_GLOBAL_CONFIG, handleLoadGlobalConfig)
ipcMain.handle(VALIDATE_FNIS_PATH, handleValidateFnisPath)
ipcMain.handle(VALIDATE_INPUT_PATH, handleValidateInputPath)
ipcMain.handle(VALIDATE_SLAL_JSON_PATH, handleValidateSlalJsonPath)