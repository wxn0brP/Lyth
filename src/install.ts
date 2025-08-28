import update from "./update";
import { getPackage } from "./utils/getMeta";
import { getInstalledVersion, updateInstalled } from "./utils/installed";
import { note } from "./utils/log";
import { question } from "./utils/rl";
import { RunCfg, runHook } from "./utils/runHook";

export default async function (args: string[]) {
    if (args.length === 1) return note("Usage: lyth -S <package-name>");

    const name = args[1];
    const pkg = getPackage(name);
    if (!pkg) return note(`Package "${name}" not found`);

    if (!pkg.install) return note(`Package "${name}" has no install hook`);

    const version = getInstalledVersion(name);
    if (version) {
        note(`Package "${name}" is already installed`);
        const answer = await question(`Do you want to update "${name}"? (Y/n) `, "y");
        if (answer.toLowerCase() === "y") {
            await update(["-u", name]);
        }
        return;
    }

    const cfg: RunCfg = {
        name,
        pkg,
        args,
        version: "0.0.0",
        hook: "install"
    }

    if (pkg.preinstall) await runHook(Object.assign({}, cfg, { hook: "preinstall" }) as RunCfg);

    const installedVersion = await runHook(cfg);
    updateInstalled(name, installedVersion.trim() || "0.0.0");
}