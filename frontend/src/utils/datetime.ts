

export function formatDate(
    date: Date = new Date(),
    timezone: string = "America/Chicago"
): string {
    return date.toLocaleString("en-US", { timeZone: timezone });
}