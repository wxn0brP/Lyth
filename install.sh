#!/bin/bash
set -e

APPS_DIR="$HOME/apps"
APP_NAME="Lyth"
APP_PATH="$APPS_DIR/$APP_NAME"
BIN_PATH="$HOME/.local/bin/lyth"

mkdir -p "$APPS_DIR"

# If the directory does not exist, clone it, otherwise update it
if [ ! -d "$APP_PATH" ]; then
    git clone https://github.com/wxn0brP/Lyth.git "$APP_PATH"
else
    cd "$APP_PATH"
    git pull
fi

cd "$APP_PATH"
chmod +x update.sh
chmod +x src/index.ts
./update.sh

# Add the Lyth repo
./src/index.ts repo add Lyth wxn0brP/Lyth-repo#master
mkdir -p "$HOME/.config/lyth.d/repos/custom"
./src/index.ts repo create-meta custom

mkdir -p "$HOME/.local/bin"

# If the link does not exist or points to something else - update
if [ ! -L "$BIN_PATH" ] || [ "$(readlink -f "$BIN_PATH")" != "$APP_PATH/src/index.ts" ]; then
    ln -sf "$APP_PATH/src/index.ts" "$BIN_PATH"
fi

echo "Installation finished. Make sure ~/.local/bin is in your PATH."
