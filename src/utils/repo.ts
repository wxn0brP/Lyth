import { readFileSync, writeFileSync } from "fs";
import { parse } from "toml";

const file = process.env.LYTH_CFG_PATH + "repos.toml";

export function getRepos() {
    try {
        return parse(readFileSync(file, "utf-8"));
    } catch {
        return {};
    }
}

export function setRepos(db: any) {
    try {
        const data = Object.entries(db).map(([k, v]) => `${k} = "${v}"`).join("\n");
        writeFileSync(file, data);
    } catch (e) {
        console.error(e);
    }
}

export function getRepo(name: string): string {
    return getRepos()[name] || null;
}

export function addRepo(name: string, url: string) {
    const db = getRepos();
    db[name] = url;
    setRepos(db);
}

export function removeRepo(name: string) {
    const db = getRepos();
    delete db[name];
    setRepos(db);
}