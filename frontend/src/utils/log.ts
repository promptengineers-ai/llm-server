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

export const logFilter = (log: any, existingLogs: any[]) => {
    // Example filter: only show logs that are not of type 'warn'
    if (log.method !== "info") {
        return false;
    }

    // Remove duplicates within the log.data
    if (Array.isArray(log.data)) {
        log.data = Array.from(new Set(log.data));
    }

    // Create a hash of the log.data
    const hash = crypto
        .createHash("sha256")
        .update(JSON.stringify(log.data))
        .digest("hex");

    // Create a Set of existing log hashes
    const existingLogHashes = new Set(
        existingLogs.map((existingLog) =>
            crypto
                .createHash("sha256")
                .update(JSON.stringify(existingLog.data))
                .digest("hex")
        )
    );

    // Check if the hash already exists in the set
    if (existingLogHashes.has(hash)) {
        return false;
    }

    // Add the hash to the set (if you want to keep track of it within this function scope)
    existingLogHashes.add(hash);

    return true;
};