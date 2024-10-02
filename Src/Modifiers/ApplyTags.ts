import {FindFilesByPattern, LoadJsonFile, ReadModifyAndSaveMultipleJsonFiles} from "../FileUtils.ts";

function ApplyStructureTags() {
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

function ApplyTagsToShips(ships: string[], tag: string) {
    ships = ships.map(item => "entities\\" + item + ".unit");
    ReadModifyAndSaveMultipleJsonFiles(ships, (content: any) => {
        content.tags.push(tag);
    });
}

function ApplyTagsToCapital() {
    ApplyTagsToShips(["trader_battle_capital_ship", "advent_battle_capital_ship", "vasari_battle_capital_ship"], "battle_capital");
    ApplyTagsToShips(["trader_colony_capital_ship", "advent_colony_capital_ship", "vasari_colony_capital_ship"], "colony_capital");
    ApplyTagsToShips(["trader_carrier_capital_ship", "advent_carrier_capital_ship", "vasari_carrier_capital_ship"], "carrier_capital");
    ApplyTagsToShips(["trader_support_capital_ship", "advent_battle_psionic_capital_ship", "vasari_marauder_capital_ship"], "support_capital");
    ApplyTagsToShips(["trader_siege_capital_ship", "advent_planet_psionic_capital_ship", "vasari_siege_capital_ship"], "siege_capital");
}

export function ApplyTags() {
    ApplyStructureTags();
    ApplyTagsToCapital();
}