import FalconFrame from "@wxn0brp/falcon-frame";
import { execSync } from "child_process";
import crypto from "crypto";
import http from "http";
import db, { DBS } from "./utils/db";
import { PkgMeta, search } from "./search";
import { update, updateAll } from "./install/update";
import { install } from "./install/install";
import { getPackage } from "./utils/getMeta";
import { repoPullAll } from "./repo/pull";
import { RunCfg, runHook } from "./utils/runHook";
import { s } from "./utils/s";
import { uninstallUtil } from "./uninstall";

const app = new FalconFrame();
const token = crypto.randomBytes(32).toString("hex");
let unauthorizedTry = 0;

interface Package extends PkgMeta {
    version?: string;
}

app.use((req, res, next) => {
    const hostHeader = req.headers.host || "";
    const hostname = hostHeader.split(":")[0];

    function err() {
        unauthorizedTry++;
        if (unauthorizedTry > 3) {
            console.error(`[SECURITY ALERT] Detected multiple unauthorized access attempts. The server will terminate to prevent potential intrusion.`);
            process.exit(0);
        } else {
            console.warn(`[WARNING] Unauthorized access attempt.`);
        }
        res.status(403);
        return "403 Forbidden";
    }

    if (hostname !== "127.0.0.1" && hostname !== "localhost") return err();

    const authToken = req.query.auth_token;
    if (!authToken || authToken !== token) return err();

    next();
});

app.all("/exit", () => {
    process.exit(0);
});

app.get("/", (req, res) => res.render(import.meta.dirname + "/index.html"));

app.get("/packages", async (req, res) => {
    const installedPkgs = db.getData<string>(DBS.INSTALLED);
    const installed = Object.keys(installedPkgs);

    const all = await search("*") as Package[];

    installed.forEach(pkgName => {
        const find = all.find(pkg => pkg.name === pkgName);
        if (!find) return;
        find.version = installedPkgs[pkgName];
    });
    return all;
});

app.get("/update-all", async () => {
    await updateAll();
    return { success: true };
});

app.get("/install", async (req) => {
    const pkgName = req.query.name;
    if (!pkgName) return { success: false, message: "No package name provided" };

    if (req.query.noRefresh !== "true") {
        await repoPullAll();
    }

    const pkgRaw = getPackage(pkgName);
    if (!pkgRaw) return { success: false, message: "Package not found" };
    const [name, pkg] = pkgRaw;

    const version = db.get(DBS.INSTALLED, name);

    const res: any = { success: true };
    if (version) {
        const u = await update(name, pkg, version, []);
        res.u = u;
    } else {
        await install(name, pkg, []);
    }

    return res;
});

app.get("/uninstall", async (req, res) => {
    const pkgName = req.query.name;
    if (!pkgName) return { success: false, message: "No package name provided" };
    return await uninstallUtil(pkgName, []);
});

const server = http.createServer(app.getApp());

export default async (args: string[]) => {
    s(args);
    server.listen(0, "127.0.0.1", () => {
        const address = server.address();
        if (typeof address === "string") return;
        const url = "http://localhost:" + address.port + "/?auth_token=" + token;
        execSync(`xdg-open "${url}"`);
    });
};