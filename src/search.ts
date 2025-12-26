import { readdirSync } from "fs";
import { PkgCfg } from "./types/types";
import db, { DBS } from "./utils/db";
import { getPackage } from "./utils/getMeta";
import { join } from "path";
import { refreshReposIfNeeded } from "./utils/s";
import { printTable } from "./utils/table";
import { isJsonMode } from "./utils/isJsonMode";

const dir: string = process.env.LYTH_CFG_PATH + "repos/";

export interface PkgMeta {
    name: string;
    description: string;
    icon: string;
}

function convert(pkg: [string, PkgCfg]): PkgMeta {
    return {
        name: pkg[0],
        description: pkg[1]?.description,
        icon: pkg[1]?.icon
    };
}

function createRegex(name: string) {
    const regexPattern = name
        .split("*")
        .map(s => s.replace(/[.+^${}()|[\]\\]/g, "\\$&"))
        .join(".*");
    return new RegExp(".*" + regexPattern + ".*");
}

function match(pkg: [string, PkgCfg], name: string, regex: RegExp = null) {
    if (name === "*") return true;
    if (!regex) regex = createRegex(name);
    if (regex.test(pkg[0])) return true;

    const pkgName = pkg[1]?.name;
    if (pkgName && regex.test(pkgName)) return true;

    const desc = pkg[1]?.description;
    if (desc && regex.test(desc)) return true;
    return false;
}

export async function search(name: string) {
    let repos = [];
    if (name.includes("/")) {
        repos.push(name);
    } else {
        const _repos = db.getData(DBS.REPOS);
        repos = Object.keys(_repos);
    }

    const pkgs: ReturnType<typeof convert>[] = [];
    const regex = createRegex(name);
    for (const repoName of repos) {
        const packagesNames =
            readdirSync(join(dir, repoName), { withFileTypes: true })
                .filter(d => d.isDirectory())
                .filter(d => d.name !== ".git")
                .map(d => d.name);

        for (const pkgName of packagesNames) {
            const pkg = getPackage(repoName + "/" + pkgName);
            if (match(pkg, name, regex)) pkgs.push(convert(pkg));
        }
    }

    return pkgs;
}

export default async function (args: string[]) {
    const isJson = isJsonMode(args);

    if (isJson) process.env.LYTH_SILENT = "true";

    await refreshReposIfNeeded(args);
    const pkgs = await search(args[1]);

    if (pkgs.length === 0) return isJson ? console.log("[]") : console.log("No packages found");

    printTable(pkgs, args);
}