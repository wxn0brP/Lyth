import { existsSync } from "fs";
import { execSync } from "child_process";
import { getRepo, getRepos } from "../utils/repo";
import { note } from "../utils/log";

export async function repoPull(name: string) {
    const repo = getRepo(name);
    if (!repo)
        throw new Error(`Repository "${name}" is not registered.`);

    note(`Pulling "${name}"...`);

    const path = `${process.env.LYTH_CFG_PATH}repos/${name}`;
    if (!existsSync(path))
        throw new Error(`Path for "${name}" does not exist.`);

    if (!existsSync(`${path}/.git`))
        throw new Error(`Path "${path}" is not a git repository.`);

    let branch = "";
    const [_, maybeBranch] = repo.split("#", 2);
    if (maybeBranch) branch = maybeBranch;

    const pullCmd = branch
        ? `git -C ${path} pull origin ${branch}`
        : `git -C ${path} pull`;

    execSync(pullCmd, { stdio: "inherit" });
}

export async function repoPullAll() {
    const repos = getRepos();
    for (const name of Object.keys(repos))
        await repoPull(name);
}