import { readFileSync, writeFileSync } from "fs";

export enum DBS {
    INSTALLED = "installed",
    REPOS = "repos"
}

function getFile(db: DBS) {
    return process.env.LYTH_CFG_PATH + db + ".json";
}

function getData(db: DBS) {
    try {
        return JSON.parse(readFileSync(getFile(db), "utf-8"));
    } catch {
        return {};
    }
}

function setInstalled(db: DBS, data: any) {
    try {
        writeFileSync(getFile(db), JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

function update<T = any>(db: DBS, name: string, data: T) {
    const d = getData(db);
    d[name] = data;
    setInstalled(db, d);
}


function remove(db: DBS, name: string) {
    const d = getData(db);
    delete d[name];
    setInstalled(db, d);
}

function add<T = any>(db: DBS, name: string, data: T) {
    const d = getData(db);
    d[name] = data;
    setInstalled(db, d);
}

function get<T = any>(db: DBS, name: string): T {
    return getData(db)[name];
}

const db = {
    update,
    remove,
    add,
    get,
    getData,
}

export default db;