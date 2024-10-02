import path from 'path';
import fs from 'fs';
import {readFileSync} from 'fs';

const sourceFilesPath = path.join(process.env['ProgramFiles(x86)']!, 'Steam', 'steamapps', 'common', 'Sins2') + '\\';
const targetFilesPath = path.join(process.env['USERPROFILE']!, "AppData", "Local", "sins2", "mods", "TheBestOverhaulMod") + '\\';
const alreadyModifiedFiles = new Map<string, object>();

export function safeAssign(obj: any, path: any, value: any) {
    let keys = path.split('.');
    let lastKey = keys.pop();
    let target = obj;

    for (let key of keys) {
        if (!(key in target)) {
            console.warn(`Property ${key} does not exist.`);
            return; // Exit if any part of the path does not exist.
        }
        target = target[key];
    }

    if (lastKey in target) {
        target[lastKey] = value; // Only assign if the last property exists.
    } else {
        console.warn(`Property ${lastKey} does not exist on the object.`);
    }
}

export function Init() {
    if (fs.existsSync(targetFilesPath)) {
        fs.rmSync(targetFilesPath, {recursive: true});
    }
}

function CreateDirectoryForFileIfNotExists(filePath: string) {
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, {recursive: true});
    }
}

export function LoadJsonFile(filePath: string): object {
    if (alreadyModifiedFiles.has(filePath)) return alreadyModifiedFiles.get(filePath)!;
    filePath = sourceFilesPath + filePath;
    const fileContent = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

function IsNumberAndNan(value: any): boolean {
    return typeof value === 'number' && isNaN(value);
}

export function SaveJsonFile(filePath: string, content: object) {
    alreadyModifiedFiles.set(filePath, content);
    filePath = targetFilesPath + filePath;
    const jsonContent = JSON.stringify(content, (key, value) => {
        if (key == "IdName") return;
        if (value !== null && !IsNumberAndNan(value)) return value
    }, 4);
    CreateDirectoryForFileIfNotExists(filePath);
    fs.writeFileSync(filePath, jsonContent);
}

function ReadModifyAndSaveJsonFile(filePath: string, modify: (content: object) => void) {
    let content = LoadJsonFile(filePath);
    modify(content);
    SaveJsonFile(filePath, content);
}

export function ReadModifyAndSaveMultipleJsonFiles(filePaths: string[], modify: (content: object) => void) {
    if (filePaths.length === 0) {
        console.warn("No files found for modification.");
        return;
    }
    filePaths.forEach(filePath => ReadModifyAndSaveJsonFile(filePath, modify));
}

function FindFilesByPatternImpl(dir: string, regexPattern: string): string[] {
    const regex = new RegExp(regexPattern);
    let result: string[] = [];

    function searchDirectory(directory: string): void {
        const files = fs.readdirSync(directory);

        files.forEach((file) => {
            const fullPath = path.join(directory, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // Recursively search in subdirectories
                searchDirectory(fullPath);
            } else {
                // Test if the file name matches the regex pattern
                if (regex.test(file)) {
                    let newPath = keepLastTwoSegments(fullPath);
                    if (CheckIfFileIsForTheJsonFolders(newPath)) {
                        result.push(newPath);
                    }
                }
            }
        });
    }

    searchDirectory(dir);
    return result;
}

export function FindFilesByPattern(pattern: string): string[] {
    return FindFilesByPatternImpl(sourceFilesPath, pattern);
}

export function FindFilesBySimplePattern(first: string, second: string): string[] {
    return FindFilesByPatternImpl(sourceFilesPath, ".*" + first + ".*" + second + ".*");
}


function keepLastTwoSegments(fullPath: string): string {
    // Normalize the path to ensure consistent format
    const normalizedFullPath = path.normalize(fullPath);

    // Split the path into its segments
    const pathSegments = normalizedFullPath.split(path.sep);

    // Get the last two segments
    const lastTwoSegments = pathSegments.slice(-2).join(path.sep);
    return lastTwoSegments;
}

function CheckIfFileIsForTheJsonFolders(filePath: string): boolean {
    return filePath.includes("entities\\") || filePath.includes("uniforms\\");
}

