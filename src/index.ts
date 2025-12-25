#!/usr/bin/env bun

import { $ } from "bun";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { noteDebug } from "./utils/log";

const isInterpreter = ["bun", "node"].some((i) => process.argv0.includes(i));
const args = process.argv.slice(isInterpreter ? 2 : 1);
process.env.LYTH_CFG_PATH = process.env.HOME + "/.config/lyth.d/";

if (!existsSync(process.env.LYTH_CFG_PATH)) mkdirSync(process.env.LYTH_CFG_PATH, { recursive: true });

function someCmd(requiredCmds: string[], minArgs = 1) {
    return args.length >= minArgs && requiredCmds.includes(args[0]);
}

const aliases: Record<string, [string[], number]> = {
    uninstall: [["-R", "uninstall", "rm", "remove"], 1],
    list: [["list", "ls"], 0],
    search: [["search", "s"], 1],
    updateAll: [["update", "up"], 0],
    repo: [["repo"], 2],
    help: [["-h", "--help"], 0],
    serve: [["serve", "gui"], 0],
}

let mod: { default: (args: string[]) => Promise<void> };

async function checkAlias() {
    for (const [alias, cmds] of Object.entries(aliases)) {
        if (someCmd(cmds[0], cmds[1])) {
            mod = await import("./" + alias);
            return true;
        }
    }
    return false;
}
if (await checkAlias()) {

} else if (someCmd(["update-self"], 0)) {
    await $`${process.env.HOME}/apps/Lyth/update.sh`;
    process.exit(0);

} else if (someCmd(["-v", "--version"], 0)) {
    const { version } = JSON.parse(readFileSync(import.meta.dirname + "/../package.json", "utf-8"));
    console.log(version);
    process.exit(0);

} else if (args.length > 0) {
    mod = await import("./install");
    noteDebug("[Load] Install");

} else {
    mod = await import("./updateAll");
    args.push("");
    noteDebug("[Load] Full update");
}

await mod.default(args);

export { };
