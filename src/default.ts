import { install } from "./install";
import { update } from "./update";
import { getPackage } from "./utils/getMeta";
import { getInstalledVersion } from "./utils/installed";
import { note } from "./utils/log";

export default async function (args: string[]) {
    let name = "";
    if (args[0] === "-S") {
        name = args[1];
        // TODO update repo
    } else {
        name = args[0];
    }

    const pkg = getPackage(name);
    if (!pkg) return note(`Package "${name}" not found`);

    const version = getInstalledVersion(name);
    if (version) {
        await update(name, pkg, version, args);
    } else {
        await install(name, pkg, args);
    }
}