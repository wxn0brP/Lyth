import { execSync, spawn } from "child_process";
import { dirname, join, resolve } from "path";
import { PkgCfg } from "../types/types";
import { note } from "./log";

const dir = process.env.LYTH_CFG_PATH + "repos/";

export interface RunCfg {
    name: string,
    pkg: PkgCfg,
    hook: string,
    args: string[],
    version: string
}

export async function runHook(cfg: RunCfg): Promise<string> {
    const { name, pkg, hook, args, version } = cfg;
    await import("./hookUtils");

    const ext = pkg[hook];
    const path = resolve(join(dir, name, hook) + "." + ext);
    const myDir = process.cwd();
    note(`[Run] hook ${path}`, "HOOK");

    process.env.LYTH_SRC = resolve(import.meta.dirname);
    process.env.LYTH_PKG_VERSION = version;
    process.env.LYTH_PKG_DIR_PATH = dirname(path);
    process.chdir(process.env.HOME + "/apps");

    const userShell = process.env.SHELL || "/bin/bash";
    let res = "";

    if (ext == "ts" || ext == "js") {
        const mod = await import(path);
        if (typeof mod.default === "function") res = await mod.default(args);
        else if (typeof mod.default === "string") res = mod.default;
        else throw new Error("Invalid hook");

    } else if (ext === "sh") {
        execSync("chmod +x " + path, { stdio: "inherit" });
        const tmpRes = await execLive(path, args, {
            stdio: "pipe",
            env: process.env,
            shell: userShell,
            encoding: "utf-8"
        });
        res = extractOrParse(tmpRes.toString());
    }

    process.chdir(myDir);
    return res;
}

export function extractOrParse(input: string): string {
    const resMatch = input.match(/\[res\](.*?)\[\/res\]/s);
    if (resMatch)
        return resMatch[1];

    return input;
}

async function execLive(
    command: string,
    args: string[],
    options: any
): Promise<string> {
    return new Promise((resolve, reject) => {
        let output = "";

        const child = spawn(command, args, options);

        const onData = (data: Buffer) => {
            const text = data.toString();
            process.stdout.write(text);
            output += text;
        };

        child.stdout.on("data", onData);
        child.stderr.on("data", onData);

        child.on("close", (code) => {
            if (code !== 0) {
                reject(new Error(`Exit code ${code}`));
            } else {
                resolve(output);
            }
        });
    });
}
