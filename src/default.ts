import { install } from "./install";
import { repoPullAll } from "./repo/pull";
import { PkgCfg } from "./types/types";
import { update } from "./update";
import db, { DBS } from "./utils/db";
import { getPackage } from "./utils/getMeta";
import { note } from "./utils/log";

export default async function (args: string[]) {
    let name = "";
    if (args[0] === "-N") {
        name = args[1];
    } else {
        name = args[0];
        await repoPullAll();
        if (!process.env.LYTH_SILENT) console.log();
    }
    if (!name) return note("Usage: lyth <package-name>", "INSTALL");

    const pkgConfig = getPackage(name);
    if (!pkgConfig) return note(`Package "${name}" not found`, "INSTALL");
    let pkg: PkgCfg;
    [name, pkg] = pkgConfig;
    note(`Installing "${name}"...`, "INSTALL");

    const version = db.get(DBS.INSTALLED, name);
    if (version) {
        await update(name, pkg, version, args);
    } else {
        await install(name, pkg, args);
    }
}