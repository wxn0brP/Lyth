import db, { DBS } from "../utils/db";
import { addRepo, addRepoMeta } from "./add";
import { repoPull, repoPullAll } from "./pull";
import { removeRepo } from "./rm";

export default async function (args: string[]) {
    args.shift();
    const op = args.shift();

    switch (op) {
        case "add":
        case "install":
        case "i":
            if (args.length < 2) return console.log("Usage: lyth repo add <name> <url>");
            await addRepo(args[0], args[1]);
            break;
        case "rm":
        case "remove":
        case "delete":
        case "del":
            if (args.length < 1) return console.log("Usage: lyth repo remove <name>");
            await removeRepo(args[0]);
            break;
        case "list":
        case "ls":
            const repos = db.getData(DBS.REPOS);
            console.log(Object.keys(repos).map(k => `${k}: ${repos[k]}`).join("\n"));
            break;
        case "pull":
        case "update":
        case "up":
        case "-S":
            if (args.length < 1) return console.log("Usage: lyth repo pull <name>");
            await repoPull(args[0]);
            break;
        case "pull-all":
        case "pa":
        case "up-all":
        case "update-all":
            await repoPullAll();
            break;
        case "create-meta":
            await addRepoMeta(args[0]);
            break;
        default:
            console.log("Usage: lyth repo <add|remove|list|pull|pull-all>");
            break;
    }
}