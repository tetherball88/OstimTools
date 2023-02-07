/**
 * render list of attributes in xml format
 * @param attrs 
 * @returns 
 */
export const renderAttrs = (attrs: Record<string, string | undefined>) => {
    if(!attrs) {
        return '';
    }
    
    return Object.keys(attrs).filter(key => !!attrs[key]).map((key) => `${key}="${attrs[key]}"`).join(' ');
}