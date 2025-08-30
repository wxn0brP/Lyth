import { updateAll } from "./update";
import { s } from "./utils/s";

export default async function (args: string[]) {
    await s(args);
    await updateAll(args);
}