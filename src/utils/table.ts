/**
 * Prints an array of objects as a simple aligned table.
 * Automatically adjusts column widths based on the longest value.
 * If -json is passed (args), the data is printed as a JSON string.
 */
export function printTable<T extends Record<string, any>>(data: T[], args: string[] = []): void {
    if (args.includes("-json")) {
        console.log(JSON.stringify(data));
        return;
    }

    if (!Array.isArray(data) || data.length === 0) {
        console.log("(no data)");
        return;
    }

    const keys = Object.keys(data[0]);
    const widths = keys.map(key =>
        Math.max(
            key.length,
            ...data.map(row => String(row[key] ?? "").length)
        )
    );

    const pad = (value: unknown, length: number): string =>
        String(value ?? "").padEnd(length, " ");

    // Header
    const header = keys.map((k, i) => pad(k, widths[i])).join(" \t");
    console.log("\x1b[1m" + header + "\x1b[0m");

    // Rows
    for (const row of data) {
        console.log(keys.map((k, i) => pad(row[k], widths[i])).join(" \t"));
    }
}
