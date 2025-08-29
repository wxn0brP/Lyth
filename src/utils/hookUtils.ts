import { writeFileSync } from "fs";
import { resolve } from "path";

globalThis._import = async (path: string) => {
    return await import(process.env.LYTH_PKG_DIR_PATH + "/" + path);
}

globalThis.__import = async (path: string) => {
    return await import(process.env.LYTH_PKG_DIR_PATH + "/" + path).then(m => m.default);
}

globalThis._importSRC = (path: string) => {
    return require(process.env.LYTH_SRC + "/" + path);
}

export interface DesktopEntry {
    name: string;
    exec: string;
    icon?: string;
    comment?: string;
    categories?: string[];
    terminal?: boolean;
    type?: "Application" | "Link" | "Directory";
    startupNotify?: boolean;
    mimeType?: string[];
}

globalThis.createDesktopFile = createDesktopFile;

function _resolve(path: string) {
    if (!path.startsWith("/")) {
        path = process.env.HOME + "/apps/" + path;
    }
    return resolve(path);
}

export function createDesktopFile(entry: DesktopEntry, dest: string) {
    const lines = [
        "[Desktop Entry]",
        `Name="${entry.name}"`,
        `Exec="${_resolve(entry.exec)}"`,
        entry.icon ? `Icon="${_resolve(entry.icon)}"` : null,
        entry.comment ? `Comment=${entry.comment}` : null,
        `Terminal=${entry.terminal ?? false}`,
        `Type=${entry.type ?? "Application"}`,
        entry.startupNotify !== undefined ? `StartupNotify=${entry.startupNotify}` : null,
        entry.categories?.length ? `Categories=${entry.categories.join(";")};` : null,
        entry.mimeType?.length ? `MimeType=${entry.mimeType.join(";")};` : null,
    ].filter(Boolean).join("\n");

    const content = lines + "\n";

    if (!dest.startsWith("/")) dest = process.env.HOME + "/.local/share/applications/" + dest;
    if (!dest.endsWith(".desktop")) dest += ".desktop";
    writeFileSync(resolve(dest), content, { mode: 0o755 });
}
