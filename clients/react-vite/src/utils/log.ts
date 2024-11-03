import crypto from "crypto";

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

export const logFilter = (log: any) => {
    // Example filter: only show logs that are not of type 'warn'
    return log.method === "info";
};