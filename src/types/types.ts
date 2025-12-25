import { DesktopEntry } from "../utils/hookUtils";

export interface PkgCfg {
    name: string;
    install?: HookType;
    uninstall?: HookType;
    update?: HookType;
    getVersion?: HookType;
    preinstall?: HookType;
    description?: string;
    icon?: string;
    gh?: {
        owner: string;
        repo: string;
        fileFN: string;
        filePattern: string;
        cmd?: string;
        desktop?: DesktopEntry;
    }
}

export type HookType = "sh" | "ts" | "js";

export interface UninstallSuccess {
    success: true;
}

export interface UninstallError {
    success: false;
    code: "PACKAGE_NOT_FOUND" | "NOT_INSTALLED" | "UNINSTALL_FAILED" | "NO_HOOK";
    message: string;
}

export type UninstallResult = UninstallSuccess | UninstallError;

export interface InstallSuccess {
    success: true;
    action: "install" | "update";
    name: string;
}

export interface InstallError {
    success: false;
    code: "PACKAGE_NOT_FOUND" | "INSTALL_FAILED" | "UPDATE_FAILED" | "INVALID_ARGS";
    message: string;
}

export type InstallResult = InstallSuccess | InstallError;