import { PkgCfg } from "./types/types";
import db, { DBS } from "./utils/db";
import { getPackage } from "./utils/getMeta";
import { note } from "./utils/log";
import { runHook } from "./utils/runHook";

export async function update(name: string, pkg: PkgCfg, version: string, args: string[]) {
    if (!pkg.update && !pkg.install) return note(`Package "${name}" has no update hook`, "UPDATE");
    const isUpdate = pkg.update;

    let latestVersion = "";
    if (pkg.getVersion) {
        latestVersion = await runHook({
            name,
            pkg,
            hook: "getVersion",
            args,
            version
        });
        latestVersion = latestVersion.trim() || "";
    }

    if (version === latestVersion) {
        note(`Package "${name}" is already up to date`, "UPDATE");
        return false;
    }

    let res = await runHook({
        name,
        pkg,
        hook: isUpdate ? "update" : "install",
        args,
        version
    });

    res = latestVersion || res.trim() || "0.0.0";
    if (res === version) return note(`Package "${name}" is already up to date`, "UPDATE");
    db.update(DBS.INSTALLED, name, res);
    return true;
}

export async function updateAll(args: string[] = []) {
    const installed = db.getData<string>(DBS.INSTALLED);
    const pkgs = Object.keys(installed);
    if (pkgs.length === 0) return note("No packages installed", "UPDATE");

    for (const pkgName of pkgs) {
        const version = installed[pkgName];
        const [name, pkg] = getPackage(pkgName);
        await update(name, pkg, version, args);
    }
}