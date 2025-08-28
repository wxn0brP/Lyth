#!/usr/bin/env bun
import { existsSync, mkdirSync } from "fs";
import { noteDebug } from "./utils/log";
import { execSync } from "child_process";

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
    execSync(`yarn global add github:wxn0brP/Lyth`, { stdio: "inherit" });
    process.exit(0);

} else {
    mod = await import("./help.js");
    noteDebug("[Load] Help");
}

await mod.default(args);

export { }