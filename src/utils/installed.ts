import { existsSync, readFileSync, writeFileSync } from "fs";
import { parse } from "toml";

const file = process.env.LYTH_CFG_PATH + "installed.toml";

export function getInstalled() {
    try {
        return parse(readFileSync(file, "utf-8"));
    } catch {
        return {};
    }
}

export function setInstalled(db: any) {
    try {
        const data = Object.entries(db).map(([k, v]) => `${k} = "${v}"`).join("\n");
        writeFileSync(file, data);
    } catch (e) {
        console.error(e);
    }
}

export function updateInstalled(name: string, version: string) {
    const db = getInstalled();
    db[name] = version;
    setInstalled(db);
}

export function removeInstalled(name: string) {
    const db = getInstalled();
    delete db[name];
    setInstalled(db);
}

export function getInstalledVersion(name: string) {
    const db = getInstalled();
    return db[name] || "";
}

if (!existsSync(file)) setInstalled({});