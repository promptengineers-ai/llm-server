export function log(originator: string, value: any, message?: string) {
    if (process.env.NODE_ENV === "development") {
        // Log the message with caller details
        let concatStr = `[${originator}]`;
        if (message) {
            concatStr += `: ${message}`;
        }
        // Use console.log to log the message
        console.log(concatStr, value);
    }
}
