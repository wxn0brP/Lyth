import * as Readline from "readline";

export function question(question: string, defaultAnswer?: string) {
    return new Promise<string>((resolve) => {
        const rl = Readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(question, async (answer) => {
            if (!answer.trim()) answer = defaultAnswer || "";
            resolve(answer);
            rl.close();
        });
    });
}