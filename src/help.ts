import { readFileSync } from "fs";

export default async function () {
    const { version } = JSON.parse(readFileSync(import.meta.dirname + "/../package.json", "utf-8"));
    const str = `
Usage: lyth <command> [args]

Version: ${version}

Commands:
    [-S] name                                         Install a package (-S refreshes the repo)
    -R, uninstall, rm, remove                         Uninstall a package
    -u, update, up                                    Update a package
    update-self | bash                                Update lyth
`;
    console.log(str.trim());
}