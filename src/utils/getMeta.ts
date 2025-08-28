import { existsSync, mkdirSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { parse } from "toml";
import { PkgCfg } from "../types/types";

const dir: string = process.env.LYTH_CFG_PATH + "packages/";

if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

export function getDirectories(): string[] {
    return readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
}

export function getPackageRaw(name: string): Partial<PkgCfg> | null {
    try {
        const path = join(dir, name);
        const file = join(path, "pkg.toml");
        const data = readFileSync(file, "utf-8");
        return parse(data);
    } catch {
        return null;
    }
}

function exists(pkg: string, hook: string): "sh" | "ts" | "js" | "" {
    const path = join(dir, pkg, hook);
    if (existsSync(path + ".sh")) return "sh";
    if (existsSync(path + ".ts")) return "ts";
    if (existsSync(path + ".js")) return "js";
    return "";
}

export function getPackage(name: string): PkgCfg {
    if (!existsSync(join(dir, name))) return null;

    const pkg: Partial<PkgCfg> = {};
    const loadCfg = getPackageRaw(name);
    if (loadCfg) Object.assign(pkg, loadCfg);

    function loadHook(hook: string) {
        const has = exists(name, hook);
        if (has) pkg[hook] = has;
    }
    loadHook("install");
    loadHook("uninstall");
    loadHook("update");
    loadHook("preinstall");
    loadHook("getVersion");

    return pkg as PkgCfg;
}