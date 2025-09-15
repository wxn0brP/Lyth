export const colors = {
    RESET: "\x1b[0m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m",
    WHITE: "\x1b[37m",
    GRAY: "\x1b[90m"
};

export const categoryColors: Record<string, string> = {
    "INFO": colors.BLUE,
    "INSTALL": colors.GREEN,
    "UPDATE": colors.CYAN,
    "UNINSTALL": colors.RED,
    "LIST": colors.MAGENTA,
    "REPO": colors.YELLOW,
    "HOOK": colors.WHITE,
    "DEBUG": colors.WHITE
};

export function note(msg: string, category: string = "INFO", ...args: any[]) {
    if (process.env.LYTH_SILENT) return;
    const color = categoryColors[category] || colors.WHITE;
    console.log(`${color}[${category}]${colors.RESET} ${msg}`, ...args);
}

export function noteDebug(msg: string, category: string = "DEBUG", ...args: any[]) {
    if (!process.env.DEBUG) return;
    if (process.env.LYTH_SILENT) return;
    const color = categoryColors[category] || colors.WHITE;
    console.debug(`${color}[${category}]${colors.RESET} ${msg}`, ...args);
}