import { $ } from "bun";
import { existsSync, unlinkSync } from "fs";
import { PkgCfg } from "../types/types";
import { createDesktopFile } from "./hookUtils";
import { note } from "./log";
import { execSync } from "child_process";

const cache = new Map<string, string>();
const commands: Record<string, string> = {
    ".tar.gz": "tar xzf",
    ".tar.xz": "tar xJf",
    ".tar": "tar xf",
    ".zip": "unzip",
    ".7z": "7z x",
    ".AppImage": "chmod +x"
};
const nonDirCommands = [".AppImage"];

export async function getLatestRelease(owner: string, repoName: string) {
    const repo = `${owner}/${repoName}`;
    if (cache.has(repo)) return cache.get(repo);

    const url = `https://api.github.com/repos/${repo}/releases/latest`;
    const response = await fetch(url);
    const data = await response.json();
    const tag_name: string = data.tag_name || data.name;

    cache.set(repo, tag_name);
    return tag_name;
}

export async function ghInstall(name: string, pkg: PkgCfg) {
    const { gh } = pkg;
    if (!gh.owner || !gh.repo) throw new Error("gh.owner and gh.repo is required");
    if (!gh.fileFN && !gh.filePattern) throw new Error("gh.fileFN or gh.filePattern is required");

    const tag_name = await getLatestRelease(gh.owner, gh.repo);

    const appName = name.split("/").pop();
    const fileNameData = {
        v: tag_name.replace("v", ""),
        version: tag_name,
        arch: process.arch
    }

    const fileName = getFileName(pkg, fileNameData);

    const cwd = process.cwd();
    process.chdir(process.env.HOME + "/apps/");

    if (existsSync(fileName)) unlinkSync(fileName);
    if (existsSync(appName)) await $`rm -rf ${appName}`;

    const url = `https://github.com/${gh.owner}/${gh.repo}/releases/download/${tag_name}/${fileName}`;
    note(`Downloading ${url}`, "INSTALL");

    await $`curl -L ${url} -o ${fileName}`;

    if (gh.cmd) await $`${gh.cmd}`;
    else {
        for (const [ext, cmd] of Object.entries(commands)) {
            if (fileName.endsWith(ext)) {
                const baseName = nonDirCommands.includes(ext) ? fileName : fileName.replace(ext, "");
                execSync(`${cmd} ${fileName}`, { stdio: "inherit" });
                await $`mv ${baseName} ${appName}`;
                break;
            }
        }
    }


    if (gh.desktop) createDesktopFile(gh.desktop);

    unlinkSync(fileName);
    process.chdir(cwd);

    return tag_name;
}

function evalFileNamePattern(schema: string, data: Record<string, any>): string {
    return schema.replace(/\$(\w+)/g, (_, key) => data[key] ?? "");
}

function evalFileName(schema: string, data: Record<string, any>): string {
    return new Function("data", `return ${schema}`)(data);
}

function getFileName({ gh }: PkgCfg, data: Record<string, any>) {
    if (gh.filePattern) return evalFileNamePattern(gh.filePattern, data);
    else if (gh.fileFN) return evalFileName(gh.fileFN, data);
}