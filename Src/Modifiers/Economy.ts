import {FindFilesBySimplePattern, ReadModifyAndSaveMultipleJsonFiles} from "../FileUtils.ts";
import {UnitHelpers} from "../UnitHelpers.ts";

function FindAndReplace(array: string[], stringToFind: string, replacementString: string) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === stringToFind) {
            array[i] = replacementString;
        }
    }
}

function FindAndRemove(array: string[], stringToFind: string[]) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < stringToFind.length; j++) {
            if (stringToFind[j] === array[i]) {
                array.splice(i, 1);
                i--;
            }
        }
    }
}

function AddIfNotContains(array: string[], stringsToAdd: string[]) {
    for (let i = 0; i < stringsToAdd.length; i++) {
        if (!array.includes(stringsToAdd[i])) {
            array.push(stringsToAdd[i]);
        }
    }
}


function Allow2Titans() {
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.AllFactions, (content: any) => {
        content.unit_limits.global[0].unit_limit = 2;
    });
}

export function ApplyEconomyChanges() {
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.AllExtractors, (content: any) => {
        content.structure.slots_required = 0;
    });

    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.Player, (content: any) => {
        content.marginal_tax_rate_levels.credits = [{
            rate_taxable: 1,
            tax_rate: 0
        }]
        content.marginal_tax_rate_levels.metal = [{
            rate_taxable: 1,
            tax_rate: 0
        }]
        content.marginal_tax_rate_levels.crystal = [{
            rate_taxable: 1,
            tax_rate: 0
        }]
    });

    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.AllFactions, (content: any) => {
        for (let i = 0; i < content.max_supply.levels.length; i++) {
            content.max_supply.levels[i].max_supply *= 5;
        }
    });

    ReadModifyAndSaveMultipleJsonFiles(FindFilesBySimplePattern("max_supply", "research_subject"), (content: any) => {
        content.price.credits *= 5;
        content.price.metal *= 5;
        content.price.crystal *= 5;
    });

    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.Planet, (content: any) => {
        for (let key in content) {
            if (content.hasOwnProperty(key)) {
                delete content[key];
            }
        }
        content.chance_of_first_planet_bonus = 1;
        content.chance_of_first_planet_bonus = 1;
        content.artifact_to_planet_count_ratio = 0.25;
    });
    Allow2Titans();
}