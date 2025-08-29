import { getRepos } from "../utils/repo";
import { addRepo } from "./add";
import { repoPull } from "./pull";
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
            const repos = getRepos();
            console.log(Object.keys(repos).map(k => `${k}: ${repos[k]}`).join("\n"));
            break;
        case "pull":
        case "-S":
            if (args.length < 1) return console.log("Usage: lyth repo pull <name>");
            await repoPull(args[0]);
            break;
        default:
            console.log("Usage: lyth repo <add|remove|list|pull>");
            break;
    }
}