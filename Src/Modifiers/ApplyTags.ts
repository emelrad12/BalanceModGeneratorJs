import {FindFilesByPattern, LoadJsonFile, ReadModifyAndSaveMultipleJsonFiles} from "../FileUtils.ts";

export function ApplyTags() {
    let allUnits = FindFilesByPattern('^.*\\.unit$').map((file: string) => {
        return LoadJsonFile(file);
    });
    let allUnitsWithStructureTag: any[] = allUnits.filter((unit: any) => {
        if (unit.tags === undefined) {
            return
        }
        return unit.tags.includes("structure") || unit.tags.includes("starbase");
    });
    const weaponFilesToModify = new Set<string>();
    for (let unit of allUnitsWithStructureTag) {
        if (unit.weapons === undefined) continue;
        for (let weapon of unit.weapons.weapons) {
            weaponFilesToModify.add("entities\\" + weapon.weapon + ".weapon");
        }
    }
    ReadModifyAndSaveMultipleJsonFiles(Array.from(weaponFilesToModify), (content: any) => {
        content.tags.push("structure");
    });
}