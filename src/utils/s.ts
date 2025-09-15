import { repoPullAll } from "../repo/pull";

export async function s(args: string[]) {
    if (args[1] === "-N") {
        const first = args.shift();
        args.shift();
        args.unshift(first);
    } else {
        await repoPullAll();
        console.log();
    }
}