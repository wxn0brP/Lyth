import { execSync } from "child_process";
import { existsSync, rmSync } from "fs";
import { addRepo as _addRepo } from "../utils/repo";
import { note } from "../utils/log";

export async function addRepo(name: string, url: string) {
    const origUrl = url;

    let branch = "";
    if (url.includes("#"))
        [url, branch] = url.split("#");

    if (!/^https?:\/\//.test(url) && !url.startsWith("git@"))
        url = "https://github.com/" + url;

    const path = process.env.LYTH_CFG_PATH + "repos/" + name;
    if (existsSync(path))
        rmSync(path, { recursive: true });

    note(`Adding "${name}"...`);
    const branchArg = branch ? `-b ${branch}` : "";
    execSync(`git clone ${branchArg} ${url} ${path}`);
    _addRepo(name, origUrl);
}