export function note(msg: string, ...args: any[]) {
    console.log(msg, ...args);
}

export function noteDebug(msg: string, ...args: any[]) {
    if (!process.env.DEBUG) return;
    console.debug(msg, ...args);
}