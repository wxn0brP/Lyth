import { updateAll } from "./install/update";
import { s } from "./utils/s";

export default async function (args: string[]) {
    await s(args);
    await updateAll(args);
}