# Lyth

Lyth is a package manager for Linux.

## Description

Lyth is a simple package manager designed for Linux systems.
It allows you to install, uninstall, and update applications through a simple command-line interface.

## Installation

To install Lyth, you need to have [Bun](https://bun.sh/) and
[Yarn 1.x.x](https://npmjs.com/package/yarn) installed on your system.

```bash
yarn global add github:wxn0brP/Lyth
lyth repo add Lyth wxn0brP/Lyth-repo#master
```

## Usage

```bash
# Install a package
# with refreshing repos (preferred)
lyth -S <package-name>
# without refreshing repos
lyth <package-name>

# Uninstall a package
lyth -R <package-name>
lyth rm <package-name>

# Update a package
lyth -u <package-name>
lyth update <package-name>
lyth up <package-name>

# List installed packages
lyth list
lyth ls

# Search for packages
lyth search <query>
lyth s <query>

# Repository management
lyth repo add <name> <url>
lyth repo remove <name>
lyth repo list
lyth repo pull <name>
lyth repo pull-all

# Update lyth itself
lyth update-self | bash

# Show version
lyth -v
lyth --version
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.