declare global {
    namespace globalThis {
        /**
         * Import a module from a package.
         * @param path The path to the module.
         */
        function _import(path: string): Promise<any>;

        /**
         * Import the default export of a module from a package.
         * @param path The path to the module.
         */
        function __import(path: string): Promise<any>;

        /**
         * Import a module from the source code directory.
         * @param path The path to the module.
         */
        function _importSRC(path: string): any;

        /** 
         * Create a desktop file.
         * @param entry The desktop file entry.
         * @param dest The path to the desktop file. (default: /usr/share/applications/${entry.name}.desktop)
         * @param notOverwrite If the desktop file already exists, don't overwrite it. (default: true)
         */
        function createDesktopFile(entry: DesktopEntry, dest?: string, notOverwrite?: boolean): void;
    }

    interface DesktopEntry {
        name: string;
        exec: string;
        icon?: string;
        iconInternal?: string;
        comment?: string;
        categories?: string[];
        terminal?: boolean;
        type?: "Application" | "Link" | "Directory";
        startupNotify?: boolean;
        mimeType?: string[];
    }
}

export { }