import { getPackage } from "./utils/getMeta";
import { getInstalledVersion, updateInstalled } from "./utils/installed";
import { note } from "./utils/log";
import { runHook } from "./utils/runHook";

export default async function (args: string[]) {
    if (args.length === 1) return note("Usage: lyth -U <package-name>");

    const name = args[1];
    const pkg = getPackage(name);

    if (!pkg) return note(`Package "${name}" not found`);

    if (!pkg.update && !pkg.install) return note(`Package "${name}" has no update hook`);

    const isUpdate = pkg.update;
    const version = getInstalledVersion(name) || "0.0.0";

    let latestVersion = "";
    if (pkg.getVersion) {
        latestVersion = await runHook({
            name,
            pkg,
            hook: "getVersion",
            args,
            version
        });
        latestVersion = latestVersion.trim() || "";
    }

    if (version === latestVersion) return note(`Package "${name}" is already up to date`);

    let res = await runHook({
        name,
        pkg,
        hook: isUpdate ? "update" : "install",
        args,
        version
    });

    res = latestVersion || res.trim() || "0.0.0";
    if (res === version) return note(`Package "${name}" is already up to date`);
    updateInstalled(name, res);
}