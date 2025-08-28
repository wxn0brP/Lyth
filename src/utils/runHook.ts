import { execSync } from "child_process";
import { join, resolve } from "path";
import { PkgCfg } from "../types/types";
import { note } from "./log";

const dir = process.env.LYTH_CFG_PATH + "packages/";

export interface RunCfg {
    name: string,
    pkg: PkgCfg,
    hook: string,
    args: string[],
    version: string
}

export async function runHook(cfg: RunCfg) {
    const { name, pkg, hook, args, version } = cfg;

    const ext = pkg[hook];
    const path = resolve(join(dir, name, hook) + "." + ext);
    const myDir = process.cwd();
    note(`[Run] hook ${path}`);

    process.env.LYTH_SRC = resolve(import.meta.dirname);
    process.env.LYTH_PKG_VERSION = version
    process.chdir(process.env.HOME + "/apps");

    const userShell = process.env.SHELL || "/bin/bash";
    let res = "";

    if (ext == "ts" || ext == "js") {
        const mod = await import(path);
        if (typeof mod.default === "function") res = await mod.default(args);
        else if (typeof mod.default === "string") res = mod.default;
        else throw new Error("Invalid hook");

    } else if (ext === "sh") {
        execSync("chmod +x " + path, { stdio: "inherit" });
        const cmdArgs = args.map(a => `"${a}"`).join(" ");
        res = execSync(`${path} ${cmdArgs}`, {
            stdio: "inherit",
            env: process.env,
            shell: userShell,
            encoding: "utf-8"
        });
    }

    process.chdir(myDir);
    return res;
}