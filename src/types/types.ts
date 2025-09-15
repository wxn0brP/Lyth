export interface PkgCfg {
    name: string;
    install?: HookType;
    uninstall?: HookType;
    update?: HookType;
    getVersion?: HookType;
    preinstall?: HookType;
    description?: string;
    icon?: string;
}

export type HookType = "sh" | "ts" | "js";