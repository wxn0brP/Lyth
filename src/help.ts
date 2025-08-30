import { readFileSync } from "fs";

export default async function () {
    const { version } = JSON.parse(readFileSync(import.meta.dirname + "/../package.json", "utf-8"));
    const str = `
Usage: lyth <command> [args]
Version: ${version}

Commands:
    [-S] name                               Install a package (-S refreshes the repo)
    -R, rm                                  Uninstall a package
    update, up                              Update all packages
    list, ls                                List installed packages
    search, s                               Search for packages

    repo                                    Repository management
        add <name> <url>                    Add a repository
        rm <name>                           Remove a repository
        list                                List repositories
        pull <name>                         Update a repository
        pull-all, pa                        Update all repositories

    update-self                             Update lyth
    -v, --version                           Show version
`;
    console.log(str.trim());
}