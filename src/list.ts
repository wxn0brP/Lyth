import { getInstalled } from "./utils/installed";
import { note } from "./utils/log";

export default async function () {
    const installed = getInstalled();
    const pkgs = Object.keys(installed);
    if (pkgs.length === 0) return note("No packages installed");

    pkgs.forEach(pkg => {
        const version = installed[pkg];
        console.log(`${pkg} ${version}`);
    });
}