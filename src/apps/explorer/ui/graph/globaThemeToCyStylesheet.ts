import { GlobalTheme } from "~explorer/types/GlobalTheme"
import { Stylesheet } from 'cytoscape';
import { ModThemeConfig } from "~explorer/types/ModThemeConfig";

const edgeLineStyle = <T extends {['line-color']: string}>(style: T): T => ({
    ...style,
    ['target-arrow-color']: style["line-color"]
})

export const globaThemeToCyStylesheet = (values?: GlobalTheme | null): Stylesheet[] => {
    if(!values) {
        return []
    }

    const core: (keyof typeof values.core)[] = [
        'core'
    ]

    const edges: (keyof typeof values.edges)[] = [
        'edge',
        'edge[type = "transOrigin"]',
        'edge[type = "transDestination"]',
        'edge[type = "navOrigin"]',
        'edge[type = "navDestination"]',
        'edge[type = "autoTransActor"]',
        'edge[type = "autoTrans"]'
    ]

    const nodes: (keyof typeof values.nodes)[] = [
        'node',
        'node:childless:selected',
        'node:parent',
        'node:parent:selected',
        'node[?missingNode]',
        'node.found'
    ]

    return [
        ...core.map(selector => ({
            selector,
            style: values.core[selector],
        })),
        ...edges.map(selector => ({
            selector,
            style: edgeLineStyle(values.edges[selector])
        })),
        ...nodes.map(selector => ({
            selector,
            style: values.nodes[selector]
        }))
    ]
}

export const sceneStylesToCyStylesheet = (scenesStyles?: ModThemeConfig['scenesStyles']) => {
    if(!scenesStyles) {
        return []
    }
    return Object.keys(scenesStyles).reduce<Stylesheet[]>((acc, key) => {
        acc.push({
            selector: key,
            style: scenesStyles[key],
        })

        return acc;
    }, [])
}