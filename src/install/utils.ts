import { repoPullAll } from "../repo/pull";
import { InstallResult, PkgCfg } from "../types/types";
import db, { DBS } from "../utils/db";
import { getPackage } from "../utils/getMeta";
import { install } from "./install";
import { update } from "./update";

export async function installUtil(args: string[]): Promise<InstallResult> {
    let name = "";
    let shouldPull = true;

    if (args[0] === "-N") {
        name = args[1];
        shouldPull = false;
    } else {
        name = args[0];
        if (name) {
            await repoPullAll();
        }
    }

    if (!name) {
        return {
            success: false,
            code: 'INVALID_ARGS',
            message: "Usage: lyth <package-name>"
        };
    }

    const pkgConfig = getPackage(name);
    if (!pkgConfig) {
        return {
            success: false,
            code: 'PACKAGE_NOT_FOUND',
            message: `Package "${name}" not found`
        };
    }

    let pkg: PkgCfg;
    [name, pkg] = pkgConfig;

    const version = db.get(DBS.INSTALLED, name);

    try {
        if (version) {
            await update(name, pkg, version, args);
            return {
                success: true,
                action: 'update',
                name
            };
        } else {
            await install(name, pkg, args);
            return {
                success: true,
                action: 'install',
                name
            };
        }
    } catch (error) {
        return {
            success: false,
            code: version ? 'UPDATE_FAILED' : 'INSTALL_FAILED',
            message: `${version ? 'Update' : 'Install'} failed for package "${name}": ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}