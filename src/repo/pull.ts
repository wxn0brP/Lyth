import { execSync } from "child_process";
import { existsSync } from "fs";
import db, { DBS } from "../utils/db";
import { note } from "../utils/log";

export async function repoPull(name: string) {
    const repo = db.get(DBS.REPOS, name);
    if (!repo)
        throw new Error(`Repository "${name}" is not registered.`);

    const path = `${process.env.LYTH_CFG_PATH}repos/${name}`;
    if (!existsSync(path))
        throw new Error(`Path for "${name}" does not exist.`);

    if (!existsSync(`${path}/.git`)) {
        note(`Repository "${name}" is not a git repository. Skipping...`, "REPO");
        return;
    }

    note(`Pulling "${name}"...`, "REPO");

    let branch = "";
    const [_, maybeBranch] = repo.split("#", 2);
    if (maybeBranch) branch = maybeBranch;

    const pullCmd = branch
        ? `git -C ${path} pull origin ${branch}`
        : `git -C ${path} pull`;

    const isSilent = process.env.LYTH_SILENT;
    execSync(pullCmd, { stdio: isSilent ? "ignore" : "inherit" });
}

export async function repoPullAll() {
    note("Pulling all repos...", "REPO");
    const repos = db.getData(DBS.REPOS);
    for (const name of Object.keys(repos))
        await repoPull(name);
}