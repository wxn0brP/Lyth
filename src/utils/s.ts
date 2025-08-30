import { repoPullAll } from "../repo/pull";

export async function s(args: string[]) {
    if (args[1] === "-S") {
        const first = args.shift();
        args.shift();
        args.unshift(first);
        await repoPullAll();
    }
}