import { updateInstalled } from "./utils/installed";
import { note } from "./utils/log";
import { runHook } from "./utils/runHook";

export async function update(name: string, pkg: any, version: string, args: string[]) {
    if (!pkg.update && !pkg.install) return note(`Package "${name}" has no update hook`);
    const isUpdate = pkg.update;

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