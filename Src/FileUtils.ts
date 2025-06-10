import path from 'path';
import fs from 'fs';
import {readFileSync} from 'fs';

const sourceFilesPath = path.join(process.env['ProgramFiles(x86)']!, 'Steam', 'steamapps', 'common', 'Sins2') + '\\';
const targetFilesPath = path.join(process.env['USERPROFILE']!, "AppData", "Local", "sins2", "mods", "TheBestOverhaulMod") + '\\';
const alreadyOpenedJsonFiles = new Map<string, object>();
const pendingSaves = new Map<string, object>();
const alreadySeenFolders: Map<string, string[]> = new Map();

export function Init() {
    if (fs.existsSync(targetFilesPath)) {
        fs.rmSync(targetFilesPath, {recursive: true});
    }
    CreateMetadataFile();
}

function CreateDirectoryForFileIfNotExists(filePath: string) {
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, {recursive: true});
    }
}

function CreateMetadataFile() {
    SaveJsonFile(".mod_meta_data", {
        "compatibility_version": 2,
        "display_version": "1.0.0",
        "display_name": "The best overhaul mod",
        "short_description": "The best overhaul mod",
    });
}

export function LoadJsonFile(filePath: string): any | undefined {
    filePath = filePath.replaceAll("\\", "/");
    if (alreadyOpenedJsonFiles.has(filePath)) return alreadyOpenedJsonFiles.get(filePath)!;
    filePath = sourceFilesPath + filePath;
    if (!fs.existsSync(filePath)) {
        return undefined;
    }
    const fileContent = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

function IsNumberAndNan(value: any): boolean {
    return typeof value === 'number' && isNaN(value);
}

export function SaveJsonFile(filePath: string, content: object) {
    filePath = filePath.replaceAll("\\", "/");
    alreadyOpenedJsonFiles.set(filePath, content);
    filePath = targetFilesPath + filePath;
    pendingSaves.set(filePath, content);
}

export function SaveAllPendingJsonFiles() {
    pendingSaves.forEach((content, filePath) => {
        const jsonContent = JSON.stringify(content, (key, value) => {
            if (key == "IdName") return;
            if (value !== null && !IsNumberAndNan(value)) return value
        }, 4);
        CreateDirectoryForFileIfNotExists(filePath);
        fs.writeFileSync(filePath, jsonContent);
    });
}

function ReadModifyAndSaveJsonFile(filePath: string, modify: ((content: object) => boolean | undefined) | ((content: object) => void)) {
    let content = LoadJsonFile(filePath)!;
    if (modify(content) === false)
        return;
    SaveJsonFile(filePath, content);
}

export function ReadModifyAndSaveMultipleJsonFiles(filePaths: string[], modify: ((content: object) => boolean | undefined) | ((content: object) => void)) {
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
        let files: string[]
        if (alreadySeenFolders.has(directory)) {
            files = alreadySeenFolders.get(directory)!;
        } else {
            files = fs.readdirSync(directory);
            alreadySeenFolders.set(directory, files);
        }
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

