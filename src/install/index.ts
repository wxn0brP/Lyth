import { note } from "../utils/log";
import { installUtil } from "./utils";

export default async function (args: string[]) {
    const result = await installUtil(args);

    if (result.success === true) {
        if (!process.env.LYTH_SILENT) {
            console.log();
        }
        note(`Successfully ${result.action === "install" ? "installed" : "updated"} "${result.name}"`, "INSTALL");
        return;
    }

    switch (result.code) {
        case "INVALID_ARGS":
        case "PACKAGE_NOT_FOUND":
        case "INSTALL_FAILED":
            return note(result.message, "INSTALL");
        case "UPDATE_FAILED":
            return note(result.message, "UPDATE");
        default:
            return note(`Unknown error occurred`, "INSTALL");
    }
}