import { PkgCfg } from "../types/types";
import db, { DBS } from "../utils/db";
import { ghInstall } from "../utils/gh";
import { note } from "../utils/log";
import { RunCfg, runHook } from "../utils/runHook";

export async function install(name: string, pkg: PkgCfg, args: string[]) {
    if (!pkg.install && !pkg.gh) return note(`Package "${name}" has no install hook`, "INSTALL");

    const cfg: RunCfg = {
        name,
        pkg,
        args,
        version: "0.0.0",
        hook: "install"
    }

    if (pkg.preinstall) await runHook(Object.assign({}, cfg, { hook: "preinstall" }) as RunCfg);
    let installedVersion: string;

    if (pkg.gh) {
        installedVersion = await ghInstall(name, pkg);
        if (pkg.install) await runHook(cfg);
    } else {
        installedVersion = await runHook(cfg);
    }

    db.update(DBS.INSTALLED, name, installedVersion.trim() || "0.0.0");
}