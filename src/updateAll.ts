import { updateAll } from "./install/update";
import { refreshReposIfNeeded } from "./utils/s";

export default async function (args: string[]) {
    await refreshReposIfNeeded(args);
    await updateAll(args);
}