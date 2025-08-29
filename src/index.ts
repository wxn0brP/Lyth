#!/usr/bin/env bun
import { existsSync, mkdirSync, readFileSync } from "fs";
import { noteDebug } from "./utils/log";

const isInterpreter = ["bun", "node"].some((i) => process.argv0.includes(i));
const args = process.argv.slice(isInterpreter ? 2 : 1);
process.env.LYTH_CFG_PATH = process.env.HOME + "/.config/lyth.d/";

if (!existsSync(process.env.LYTH_CFG_PATH)) mkdirSync(process.env.LYTH_CFG_PATH, { recursive: true });

function someCmd(requiredCmds: string[], minArgs = 1) {
    return args.length >= minArgs && requiredCmds.includes(args[0]);
}

let mod: { default: (args: string[]) => Promise<void> };
if (someCmd(["-R", "uninstall", "rm", "remove"])) {
    mod = await import("./uninstall");
    noteDebug("[Load] Uninstall");

} else if (someCmd(["list", "ls"], 0)) {
    mod = await import("./list");
    noteDebug("[Load] List");

} else if (someCmd(["update-self"], 0)) {
    console.log(`yarn global add github:wxn0brP/Lyth`);
    process.exit(0);

} else if (someCmd(["-v", "--version"], 0)) {
    const { version } = JSON.parse(readFileSync(import.meta.dirname + "/../package.json", "utf-8"));
    console.log(version);
    process.exit(0);

} else if (someCmd(["repo"], 2)) {
    mod = await import("./repo");
    noteDebug("[Load] Repo");

} else if (args.length > 0) {
    mod = await import("./default");
    noteDebug("[Load] Install");

} else {
    mod = await import("./help");
    noteDebug("[Load] Help");
}

await mod.default(args);

export { };
