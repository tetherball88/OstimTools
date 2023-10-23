import { NodeSingular, StylesheetStyle } from "cytoscape";
const cache: Record<string, string> = {

};
export const functionStyle: StylesheetStyle[] = [
    {
        selector: 'node:parent',
        style: {
            'font-size': (node: NodeSingular) => {
                const width = node.width();
                const height = node.height();
                const diagonal = Math.sqrt(width * width + height * height);
                const label = node.data('label');
                const cacheId = `${width}-${height}-${label}`;

                if (cache[cacheId]) {
                    return cache[cacheId];
                }

                let fontSize = Math.floor(diagonal / 5);
                let labelWidth = getTextWidth(label, fontSize);
                while (fontSize > 4 && (labelWidth > diagonal)) {
                    const mult = (diagonal / labelWidth) * 0.9;
                    fontSize = Math.floor(fontSize * mult) - 1;
                    labelWidth = getTextWidth(label, fontSize);
                }

                node.css('font-size', `${fontSize}px`);

                function getTextWidth(text: string, fontSize: number) {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    if (!context) {
                        return 0;
                    }
                    context.font = `${fontSize}px Arial`;
                    const metrics = context.measureText(text);
                    return metrics.width;
                }

                return cache[cacheId] = fontSize + 'px';
            },
            'text-rotation': (node: NodeSingular) => {
                const angle = Math.atan(node.height() / node.width());

                return angle;
            },
        }
    }
]