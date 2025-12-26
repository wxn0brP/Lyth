const match = ["-j", "--json", "-json"];

export function isJsonMode(args: string[]) {
    return args.some(arg => match.includes(arg));
}