import { Stylesheet } from 'cytoscape';
import { coreStyle } from '~explorer/ui/graph/styles/coreStyle';
import { focusStyle } from '~explorer/ui/graph/styles/focusStyle';
import { functionStyle } from '~explorer/ui/graph/styles/functionStyles';
import { searchStyle } from '~explorer/ui/graph/styles/searchStyle';

export const style: Stylesheet[] = [
    ...coreStyle,
    ...focusStyle,
    ...searchStyle,
    ...functionStyle
]