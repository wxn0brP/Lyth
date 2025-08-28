export default async function () {
    const str = `
Usage: lyth <command> [args]

Commands:
  -S, install, i, add                               Install a package
  -R, uninstall, rm, remove                         Uninstall a package
  -u, update, up                                    Update a package
  update-self                                       Update lyth
`;
    console.log(str);
}