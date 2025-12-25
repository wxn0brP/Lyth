# Environment Variables

Lyth uses several environment variables to configure its behavior.

### `LYTH_CFG_PATH`
- **Description:** Specifies the path to Lyth's configuration directory.
- **Default:** `~/.config/lyth.d/`

### `LYTH_SILENT`
- **Description:** If set to `true`, Lyth will suppress most of its output, making it suitable for scripting.
- **Default:** Not set.

## Internal Variables
These variables are set by Lyth internally during the execution of package hooks and are available within the hook scripts.

### `LYTH_PKG_DIR_PATH`
- **Description:** The absolute path to the directory of the package currently being processed.

### `LYTH_SRC`
- **Description:** The absolute path to the `src` directory of Lyth itself.

### `LYTH_PKG_VERSION`
- **Description:** The version of the package currently being processed.
