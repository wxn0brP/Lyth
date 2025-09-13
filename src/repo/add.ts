import { execSync } from "child_process";
import { cpSync, existsSync, rmSync } from "fs";
import { note } from "../utils/log";
import db, { DBS } from "../utils/db";

const validPrefixes = ["http://", "https://", "git@", "ssh://", "git+", "file://"];

function rmRepoDir(path: string, name: string) {
    if (existsSync(path)) {
        note(`Repository "${name}" already exists. Removing "${path}"...`, "REPO");
        rmSync(path, { recursive: true, force: true });
    }
}

export async function addRepo(name: string, url: string) {
    const origUrl = url;

    let branch = "";
    if (url.includes("#"))
        [url, branch] = url.split("#");

    const path = process.env.LYTH_CFG_PATH + "repos/" + name;

    if (/^\/|^\.\.?\//.test(url)) {
        if (!existsSync(url)) {
            throw new Error(`Local path does not exist: ${url}`);
        }

        rmRepoDir(path, name);
        note(`Copying local repository "${name}" from "${url}"...`, "REPO");
        cpSync(url, path, { recursive: true });
        db.add(DBS.REPOS, name, path);
        return;
    }

    if (!validPrefixes.some(prefix => url.startsWith(prefix))) {
        url = "https://github.com/" + url;
    }

    rmRepoDir(path, name);
    note(`Adding "${name}"...`, "REPO");
    const branchArg = branch ? `-b ${branch}` : "";
    execSync(`git clone ${branchArg} ${url} ${path}`);
    db.add(DBS.REPOS, name, origUrl);
}

export async function addRepoMeta(name: string) {
    const path = process.env.LYTH_CFG_PATH + "repos/" + name;
    note(`Adding meta for "${name}"...`, "REPO");
    db.add(DBS.REPOS, name, path);
}