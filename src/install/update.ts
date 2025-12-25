import { PkgCfg } from "../types/types";
import db, { DBS } from "../utils/db";
import { getPackage } from "../utils/getMeta";
import { getLatestRelease, ghInstall } from "../utils/gh";
import { note } from "../utils/log";
import { runHook } from "../utils/runHook";

export async function update(name: string, pkg: PkgCfg, version: string, args: string[]) {
    if (!pkg.update && !pkg.install && !pkg.gh) return note(`Package "${name}" has no update hook`, "UPDATE");
    const isUpdate = pkg.update;

    let latestVersion = "";

    if (pkg.gh) {
        latestVersion = await getLatestRelease(pkg.gh.owner, pkg.gh.repo);
    } else if (pkg.getVersion) {
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

    let resVersion: string;
    if (pkg.gh) {
        resVersion = await ghInstall(name, pkg,);
        if (pkg.install || pkg.update) await updateHook();
    }
    else resVersion = await updateHook();

    async function updateHook() {
        const v = await runHook({
            name,
            pkg,
            hook: isUpdate ? "update" : "install",
            args,
            version
        });

        return (latestVersion || v.trim() || "0.0.0");
    }

    if (resVersion === version) return note(`Package "${name}" is already up to date`, "UPDATE");
    db.update(DBS.INSTALLED, name, resVersion);
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