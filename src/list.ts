import db, { DBS } from "./utils/db";
import { note } from "./utils/log";

export default async function () {
    const installed = db.getData(DBS.INSTALLED);
    const pkgs = Object.keys(installed);
    if (pkgs.length === 0) return note("No packages installed");

    pkgs.forEach(pkg => {
        const version = installed[pkg];
        console.log(`${pkg} ${version}`);
    });
}