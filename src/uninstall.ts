import { existsSync, rmSync } from "fs";
import { PkgCfg, UninstallResult } from "./types/types";
import db, { DBS } from "./utils/db";
import { getPackage } from "./utils/getMeta";
import { note } from "./utils/log";
import { RunCfg, runHook } from "./utils/runHook";

export async function uninstallUtil(name: string, args: string[]): Promise<UninstallResult> {
    const pkgConfig = getPackage(name);
    if (!pkgConfig) {
        return {
            success: false,
            code: "PACKAGE_NOT_FOUND",
            message: `Package "${name}" not found`
        };
    }

    let pkg: PkgCfg;
    [name, pkg] = pkgConfig;

    const version = db.get(DBS.INSTALLED, name);
    if (!version) {
        return {
            success: false,
            code: "NOT_INSTALLED",
            message: `Package "${name}" is not installed`
        };
    }

    if (!pkg.uninstall) {
        const pkgDir = process.env.HOME + "/apps/" + name;
        if (existsSync(pkgDir)) {
            rmSync(pkgDir, { recursive: true });
        }
        db.remove(DBS.INSTALLED, name);
        return { success: true };
    }

    try {
        const cfg: RunCfg = {
            name,
            pkg,
            args,
            version: "0.0.0",
            hook: "uninstall"
        };

        await runHook(cfg);
        db.remove(DBS.INSTALLED, name);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            code: "UNINSTALL_FAILED",
            message: `Uninstall hook failed for package "${name}": ${error instanceof Error ? error.message : "Unknown error"}`
        }
    }
}

export default async function (args: string[]) {
    if (args.length === 1) return note("Usage: lyth -R <package-name>", "UNINSTALL");

    let name = args[1];

    const result = await uninstallUtil(name, args);
    note(result.success === true ? `Uninstalled "${name}"` : result.message, "UNINSTALL");
}