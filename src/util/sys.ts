import { isObject } from "./common"

export function isNode() {
    return isObject(process) &&
        isObject(process.versions) &&
        (typeof process.versions.node === 'string' && process.versions.node.trim() !== '');
}

export async function runCommand(command: string): Promise<void> {
    // Only import child_process in Node.js
    if (isNode()) {
        const { exec } = await import('child_process');
        await new Promise<void>((resolve) => {
            exec(command, () => {
                // Resolve once the command completes
                resolve();
            });
        });
    } else {
        console.warn('child_process is not available in the browser');
    }
}

export async function fileExists(filePath: string): Promise<boolean> {
    // Only import fs modules in Node.js
    if (isNode()) {
        const fs = await import('fs');
        const fsp = await import('fs/promises');

        try {
            await fsp.access(filePath, fs.constants.F_OK);
            return true; // File exists
        } catch {
            return false; // File does not exist or is inaccessible
        }
    } else {
        console.warn('fs is not available in the browser');
        return false;
    }
}