import { readFileSync } from "fs";

export default async function () {
  const { version } = JSON.parse(readFileSync(import.meta.dirname + "/../package.json", "utf-8"));
  const str = `
Usage: lyth <command> [args]
Version: ${version}

Commands:
  name                                  Install a package
    -f                                  Force install (overwrite existing files)
    -N                                  Don't refresh repositories

  -R, rm                                Uninstall a package
  update, up                            Update all packages
  list, ls                              List installed packages
    -j                                  - Output in JSON format

  search, s                             Search for packages
    -j                                  - Output in JSON format

  serve, gui                            Start Lyth GUI

  repo                                  Repository management
    add <name> <url>                    Add a repository
    rm <name>                           Remove a repository
    list                                List repositories
    pull <name>                         Update a repository
    pull-all, pa                        Update all repositories
    create-meta <name>                  Add existing repository to database

  update-self                           Update lyth
  -v, --version                         Show version
`;
  console.log(str.trim());
}