export function setStyles(
    element: HTMLElement,
    theme: Record<string, any>
): void {
    Object.keys(theme).forEach((property) => {
        // Using the bracket notation to access properties since we're using a string index
        element.style[property as any] = theme[property];
    });
}
