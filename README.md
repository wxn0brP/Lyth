# Lyth

Lyth is a package manager for Linux.

## Description

Lyth is a simple package manager designed for Linux systems. It allows you to install, uninstall, and update applications through a simple command-line interface.

## Installation

To install Lyth, you need to have [Bun](https://bun.sh/) and [Yarn 1.x.x](https://npmjs.com/package/yarn) installed on your system.

```bash
yarn global add github:wxn0brP/Lyth
lyth repo add Lyth wxn0brP/Lyth-repo#master
```

## Usage

```bash
# Install a package
# like pacman
lyth -S <package-name>
# or like npm
lyth install <package-name>

# Uninstall a package
lyth -R <package-name>
lyth uninstall <package-name>

# Update a package
lyth update <package-name>

# Update lyth itself
lyth update-self | bash
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.