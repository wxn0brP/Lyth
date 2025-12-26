# Lyth

Lyth is a package manager for Linux.

## Description

Lyth is a simple package manager designed for Linux systems.
It allows you to install, uninstall, and update applications through a simple command-line interface.

## Installation

Make sure [Bun](https://bun.sh/) is installed. Then run:

```bash
curl -fsSL https://raw.githubusercontent.com/wxn0brP/Lyth/HEAD/install.sh | bash
```

This will:
* Clone the Lyth repository into `~/apps/Lyth`
* Prepare the repository (install dependencies)
* Create a symlink in `~/.local/bin/lyth` so you can run `lyth` from anywhere

## Details Docs

[Docs](https://wxn0brp.github.io/Lyth)

## Usage

```bash
# Install/Update a package
# with refreshing repos (preferred)
lyth <package-name>
# without refreshing repos
lyth -N <package-name>
# force install (overwrite existing package)
lyth -f <package-name>

# Update all a package
lyth

# Start GUI
lyth serve

# Uninstall a package
lyth -R <package-name>
lyth rm <package-name>

# List installed packages
lyth list
lyth ls
lyth ls -j # for json output

# Search for packages
lyth search <query>
lyth s <query>
lyth s <query> -j # for json output

# Repository management
lyth repo add <name> <url>
lyth repo remove <name>
lyth repo list
lyth repo pull <name>
lyth repo pull-all

# Update lyth itself
lyth update-self

# Show version
lyth -v
lyth --version
```

## License

MIT [LICENSE](LICENSE)

## Contributing

Contributions are welcome! 