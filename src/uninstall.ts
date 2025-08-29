import { existsSync, rmSync } from "fs";
import { getPackage } from "./utils/getMeta";
import { note } from "./utils/log";
import { question } from "./utils/rl";
import { RunCfg, runHook } from "./utils/runHook";
import { PkgCfg } from "./types/types";
import db, { DBS } from "./utils/db";

export default async function (args: string[]) {
    if (args.length === 1) return note("Usage: lyth -R <package-name>");

    let name = args[1];
    const pkgConfig = getPackage(name);
    if (!pkgConfig) return note(`Package "${name}" not found`);
    let pkg: PkgCfg;
    [name, pkg] = pkgConfig;

    const version = db.get(DBS.INSTALLED, name);
    if (!version) return note(`Package "${name}" is not installed`);

    if (!pkg.uninstall) {
        note(`Package "${name}" has no install hook`);
        const pkgDir = process.env.HOME + "/apps/" + name;
        if (existsSync(pkgDir)) {
            const answer = await question(`Do you want to remove "~/apps/${name}"? (y/N) `, "n");
            if (answer.toLowerCase() === "y") {
                note(`Removing "${name}"...`);
                rmSync(pkgDir, { recursive: true });
            }
        }
        return;
    }
    const cfg: RunCfg = {
        name,
        pkg,
        args,
        version: "0.0.0",
        hook: "uninstall"
    }

    if (pkg.preinstall) await runHook(Object.assign({}, cfg, { hook: "preinstall" }) as RunCfg);

    const installedVersion = await runHook(cfg);
    db.update(DBS.INSTALLED, name, installedVersion.trim() || "0.0.0");
}