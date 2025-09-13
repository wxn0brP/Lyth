import { existsSync, rmSync } from "fs";
import { note } from "../utils/log";
import db, { DBS } from "../utils/db";

export async function removeRepo(name: string) {
    if (!db.get(DBS.REPOS, name))
        return note(`Repo "${name}" not found`, "REPO");

    note(`Removing "${name}"...`, "REPO");

    const path = `${process.env.LYTH_CFG_PATH}repos/${name}`;

    if (existsSync(path))
        rmSync(path, { recursive: true, force: true });

    db.remove(DBS.REPOS, name);
}
