import { existsSync, mkdirSync, readFileSync } from "fs";
import { join } from "path";
import { PkgCfg } from "../types/types";
import db, { DBS } from "./db";

const dir: string = process.env.LYTH_CFG_PATH + "repos/";

if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

export function getPackageRaw(name: string): Partial<PkgCfg> | null {
    try {
        const path = join(dir, name);
        const file = join(path, "pkg.json");
        const data = readFileSync(file, "utf-8");
        return JSON.parse(data);
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

export function getPackage(name: string): [string, PkgCfg] {
    if (!name.includes("/")) {
        return getPackageByRepos(name);
    }

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

    return [name, pkg as PkgCfg];
}

export function getPackageByRepos(name: string): [string, PkgCfg] {
    const repos = db.getData(DBS.REPOS);
    for (const repoName of Object.keys(repos)) {
        const pkg = getPackage(repoName + "/" + name);
        if (pkg) return pkg;
    }
    return null;
}