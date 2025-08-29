import { existsSync, rmSync } from "fs";
import { removeRepo as _removeRepo, getRepo } from "../utils/repo";
import { note } from "../utils/log";

export async function removeRepo(name: string) {
    if (!getRepo(name))
        return note(`Repo "${name}" not found`);

    note(`Removing "${name}"...`);

    const path = `${process.env.LYTH_CFG_PATH}repos/${name}`;

    if (existsSync(path))
        rmSync(path, { recursive: true, force: true });

    _removeRepo(name);
}
