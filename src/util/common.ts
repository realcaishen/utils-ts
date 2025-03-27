import axios from 'axios';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as fsp from 'fs/promises';

export function equalFold(value1: string, value2: string): boolean {
    if (typeof value1 !== 'string' || typeof value2 !== 'string') {
        return false;
    }

    if (value1 === value2) {
        return true;
    }
    if (value1.toUpperCase() === value2.toUpperCase()) {
        return true;
    }
    return false;
}

export async function sleep(ms: number): Promise<void> {
    if (ms === 0) return;
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export async function withTimeout(promise: any, ms: number) {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Operation timed out")), ms)
    );

    return Promise.race([promise, timeout]);
}

export async function request(url: string, body?: any) {
    try {
        let hs = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        const rsp = body
            ? await axios.post(url, body, { headers: hs })
            : await axios.get(url, { headers: hs });

        return await rsp.data;
    } catch (error) {
        throw new Error(
            `http ${url} with ${JSON.stringify(body)} failed, ${error}`
        );
    }
}

export async function requestWithHeader(url: string, hs: any, body?: any) {
    try {
        hs['Content-Type'] = 'application/json'
        hs['Accept'] = 'application/json'
        const rsp = body
            ? await axios.post(url, body, { headers: hs })
            : await axios.get(url, { headers: hs });

        return await rsp.data;
    } catch (error) {
        throw new Error(
            `http ${url} with ${JSON.stringify(body)} failed, ${error}`
        );
    }
}

export async function requestWithAuth(url: string, auth: string, body?: any) {
    try {
        let hs = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': auth,
        }
        const rsp = body
            ? await axios.post(url, body, { headers: hs })
            : await axios.get(url, { headers: hs });

        return await rsp.data;
    } catch (error) {
        throw new Error(
            `http ${url} with ${JSON.stringify(body)} failed, ${error}`
        );
    }
}


export function snakeToCamel(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => snakeToCamel(item));
    }

    const newObj: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const camelKey = key.replace(/(_\w)/g, match => match[1].toUpperCase());
            newObj[camelKey] = snakeToCamel(obj[key]);
        }
    }
    return newObj;
}

export function camelToSnake(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => camelToSnake(item));
    }

    const newObj: any = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const snakeKey = key.replace(
                /[A-Z]/g,
                match => `_${match.toLowerCase()}`
            );
            newObj[snakeKey] = camelToSnake(obj[key]);
        }
    }
    return newObj;
}

export function isObject(variable: any): boolean {
    return variable !== null && typeof variable === 'object' && !Array.isArray(variable);
}

export function isValidNumber(variable: any): boolean {
    return typeof variable === 'number' && isFinite(variable);
}

export function isValidPrice(variable: any): boolean {
    return typeof variable === 'number' && isFinite(variable) && variable > 0;
}

export function normalizeHex(s: string, len: number) {
    s = s.trim()
    if (s == "0x2::sui::SUI") {
        return s
    }

    if (s.length >= 32) {
        return len > 0 ? s.replace(/^(0x[0-9a-f]+)/i, (match) => "0x" + match.toLowerCase().slice(2).padStart(len, '0')) : s
    } else {
        return s.toLowerCase()
    }
}


export async function runCommand(command: string): Promise<void> {
    await new Promise<void>((resolve) => {
        exec(command, () => {//const process = 
            // Simply resolve once the command completes, regardless of success or failure.
            resolve();
        });
    });
}

export async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fsp.access(filePath, fs.constants.F_OK);
        return true; // File exists
    } catch {
        return false; // File does not exist or is inaccessible
    }
}

export function toFloat(value: any): number {
    if (typeof value === "number") {
        return value; // Already a number
    } else if (typeof value === "string") {
        return parseFloat(value); // Parse the string
    }
    return NaN;
}