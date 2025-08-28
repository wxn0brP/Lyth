#!/usr/bin/env bun
import { spawn } from "child_process";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { noteDebug } from "./utils/log";

const isDev = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "dev" || process.argv.includes("--dev");
const isInterpreter = ["bun", "node"].some((i) => process.argv0.includes(i));
const args = process.argv.slice(isInterpreter ? 2 : 1);
process.env.LYTH_CFG_PATH = isDev ? "./config/" : process.env.HOME + "/.config/lyth.d/";

if (!existsSync(process.env.LYTH_CFG_PATH)) mkdirSync(process.env.LYTH_CFG_PATH, { recursive: true });

function someCmd(arg: string[], minArgs = 1) {
    return args.some((a) => arg.includes(a) && args.length >= minArgs);
}

let mod: { default: (args: string[]) => Promise<void> };
if (someCmd(["-R", "uninstall", "rm", "remove"])) {
    mod = await import("./uninstall.js");
    noteDebug("[Load] Uninstall");

} else if (someCmd(["update-self"], 0)) {
    console.log(`yarn global add github:wxn0brP/Lyth`);
    process.exit(0);

} else if (someCmd(["-v", "--version"], 0)) {
    const { version } = JSON.parse(readFileSync(import.meta.dirname + "/../package.json", "utf-8"));
    console.log(version);
    process.exit(0);
} else if (args.length > 0) {
    mod = await import("./default.js");
    noteDebug("[Load] Install");
} else {
    mod = await import("./help.js");
    noteDebug("[Load] Help");
}

await mod.default(args);

export { };
