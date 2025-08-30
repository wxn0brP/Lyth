import { readdirSync } from "fs";
import { PkgCfg } from "./types/types";
import db, { DBS } from "./utils/db";
import { getPackage } from "./utils/getMeta";
import { isMatch } from "micromatch";
import { join } from "path";
import { s } from "./utils/s";

const dir: string = process.env.LYTH_CFG_PATH + "repos/";

function convert(pkg: [string, PkgCfg]) {
    return {
        name: pkg[0],
        description: pkg[1]?.description
    };
}

function match(pkg: [string, PkgCfg], name: string) {
    const pkgPath = pkg[0].split("/")[1];
    if (isMatch(pkgPath, name)) return true;

    const pkgName = pkg[1]?.name;
    if (pkgName && isMatch(pkgName, name)) return true;

    const desc = pkg[1]?.description;
    if (desc && isMatch(desc, name)) return true;
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
    for (const repoName of repos) {
        const packagesNames =
            readdirSync(join(dir, repoName), { withFileTypes: true })
                .filter(d => d.isDirectory())
                .filter(d => d.name !== ".git")
                .map(d => d.name);

        for (const pkgName of packagesNames) {
            const pkg = getPackage(repoName + "/" + pkgName);
            if (match(pkg, name)) pkgs.push(convert(pkg));
        }
    }

    return pkgs;
}

export default async function (args: string[]) {
    await s(args);
    const pkgs = await search(args[1]);
    if (pkgs.length === 0) return console.log("No packages found");
    console.table(pkgs);
}