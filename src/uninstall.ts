import { existsSync, rmdirSync } from "fs";
import { getPackage } from "./utils/getMeta";
import { getInstalledVersion, updateInstalled } from "./utils/installed";
import { note } from "./utils/log";
import { RunCfg, runHook } from "./utils/runHook";
import { question } from "./utils/rl";

export default async function (args: string[]) {
    if (args.length === 1) return note("Usage: lyth -S <package-name>");

    const name = args[1];
    const pkg = getPackage(name);
    if (!pkg) return note(`Package "${name}" not found`);

    const version = getInstalledVersion(name);
    if (!version) return note(`Package "${name}" is not installed`);

    if (!pkg.uninstall) {
        note(`Package "${name}" has no install hook`);
        const pkgDir = process.env.HOME + "/apps/" + name;
        if (existsSync(pkgDir)) {
            const answer = await question(`Do you want to remove "~/apps/${name}"? (y/N) `, "n");
            if (answer.toLowerCase() === "y") {
                note(`Removing "${name}"...`);
                rmdirSync(pkgDir, { recursive: true });
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
    updateInstalled(name, installedVersion.trim() || "0.0.0");
}