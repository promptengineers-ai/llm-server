
export const constructBubbleMessage = (
    sender: string,
    src?: string,
    label?: string
) => {
    const image = (src: string) => {
        return `<img src=${src} alt="${sender} avatar" />`;
    };

    if (sender === "user")
        return `${src ? image(src) : "👨‍💻 "} ${label ? label : "You"}`;

    return `${src ? image(src) : "🤖 "} ${label ? label : "Assistant"}`;
};

export function filterModels(
    source: { [key: string]: string },
    compare: { [key: string]: string },
    include: boolean = true // True to include common keys, false to exclude them
): { [key: string]: string } {
    const onPremKeys = new Set(Object.keys(compare));
    const resultModels: { [key: string]: string } = {};

    for (const key in source) {
        if (onPremKeys.has(key) === include) {
            // Adjusts based on the include flag
            resultModels[key] = source[key];
        }
    }
    return resultModels;
}