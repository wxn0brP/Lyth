import { execSync } from "child_process";
import { existsSync, rmdirSync, rmSync } from "fs";

const version = await import(import.meta.dirname + "/getVersion.ts").then(m => m.default);

if (existsSync("Discord")) rmdirSync("Discord", { recursive: true });
execSync(`curl -L "https://discord.com/api/download?platform=linux&format=tar.gz" -o Discord.tar.gz`);
execSync("tar -xzf Discord.tar.gz");
rmSync("Discord.tar.gz");

export default version;