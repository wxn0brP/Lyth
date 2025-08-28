#!/usr/bin/env bun
import { spawn } from "child_process";
import { existsSync, mkdirSync, readFileSync } from "fs";
import { noteDebug } from "./utils/log";

const isDev = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "dev" || process.argv.includes("--dev");
const isInterpreter = ["bun", "node"].some((i) => process.argv0.includes(i));
const args = process.argv.slice(isInterpreter ? 2 : 1);
process.env.LYTH_CFG_PATH = isDev ? "./config/" : process.env.HOME + "/.config/lyth.d/";

if (!existsSync(process.env.LYTH_CFG_PATH)) mkdirSync(process.env.LYTH_CFG_PATH, { recursive: true });

function someCmd(arg: string[]) {
    return args.some((a) => arg.includes(a));
}

let mod: { default: (args: string[]) => Promise<void> };
if (someCmd(["-S", "install", "i", "add"])) {
    mod = await import("./install.js");
    noteDebug("[Load] Install");

} else if (someCmd(["-R", "uninstall", "rm", "remove"])) {
    mod = await import("./uninstall.js");
    noteDebug("[Load] Uninstall");

} else if (someCmd(["-u", "update", "up"])) {
    mod = await import("./update.js");
    noteDebug("[Load] Update");

} else if (someCmd(["update-self"])) {
    console.log(`yarn global add github:wxn0brP/Lyth`);
    process.exit(0);

} else if (someCmd(["-v", "--version"])) {
    const { version } = JSON.parse(readFileSync(import.meta.dirname + "/../package.json", "utf-8"));
    console.log(version);
    process.exit(0);
} else {
    mod = await import("./help.js");
    noteDebug("[Load] Help");
}

await mod.default(args);

export { };
