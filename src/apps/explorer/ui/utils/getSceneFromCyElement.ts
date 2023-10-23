import { NodeSingular, Singular } from "cytoscape";
import { ExplorerOstimScene } from "~explorer/nodejs/readScenes";

export const getSceneFromCyEle = (ele: Singular | NodeSingular): ExplorerOstimScene =>ele.data('explorerScene')