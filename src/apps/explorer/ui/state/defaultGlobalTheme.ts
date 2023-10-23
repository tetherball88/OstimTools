import { GlobalTheme } from "~explorer/types/GlobalTheme"

export const defaultGlobalColors: GlobalTheme = {
    "core": {
        "core": {
            "background-color": "#fff",
        },
    },
    "edges": {
        "edge": {
            "text-outline-color": "#fff",
            "line-color": "#ccc"
        },
        "edge[type = \"autoTrans\"]": {
            "line-color": "#d6af43"
        },
        "edge[type = \"autoTransActor\"]": {
            "line-color": "#ae71e4"
        },
        "edge[type = \"navDestination\"]": {
            "line-color": "#58a0cc"
        },
        "edge[type = \"navOrigin\"]": {
            "line-color": "#99c95a"
        },
        "edge[type = \"transDestination\"]": {
            "line-color": "#d37272"
        },
        "edge[type = \"transOrigin\"]": {
            "line-color": "#41bb88"
        }
    },
    "nodes": {
        "node": {
            "text-outline-color": "#fff",
            "overlay-color": "#fff",
            "background-color": "#7989cb",
            "color": "#000"
        },
        "node.found": {
            "background-color": "#2ec3c3"
        },
        "node:childless:selected": {
            "border-color": "#45ff50"
        },
        "node:parent": {
            "background-color": "#feffff",
            "border-color": "#3b5c6d",
            "color": "#88a7b6",
            "text-outline-color": "#383a3a"
        },
        "node:parent:selected": {
            "border-color": "#9ada55"
        },
        "node[?missingNode]": {
            "background-color": "#ee7d7f"
        }
    }
}
