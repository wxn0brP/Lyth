# Utility Functions (for scripts developers)

Lyth provides a set of utility functions that are used internally and can also be used in package hooks.

## `globalThis.`:

- **`_import(path)`**: Imports a module from the package's directory. (LYTH_PKG_DIR_PATH + path)
- **`__import(path)`**: Imports the default export of a module from the package's directory. (LYTH_PKG_DIR_PATH + path).default
- **`_importSRC(path)`**: Imports a module from Lyth's `src` directory. (LYTH_SRC + path)
- **`createDesktopFile(entry)`**: Creates a `.desktop` file for launching applications.