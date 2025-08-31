import db, { DBS } from "./utils/db";
import { getPackage } from "./utils/getMeta";
import { note } from "./utils/log";
import { printTable } from "./utils/table";

export default async function (args: string[]) {
    const installed = db.getData<string>(DBS.INSTALLED);
    const pkgs = Object.keys(installed);
    if (pkgs.length === 0) return note("No packages installed");

    if (!args.includes("-json")) console.log("Installed packages:");
    const packages: any = [];
    pkgs.forEach(pkgName => {
        const version = installed[pkgName];
        const [name, meta] = getPackage(pkgName);
        const pkg = {
            name,
            version,
            description: meta?.description
        };
        packages.push(pkg);
    });
    printTable(packages, args);
}