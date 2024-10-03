import {ReadModifyAndSaveMultipleJsonFiles, SaveJsonFile} from "./FileUtils.ts";
import {Race, UnitHelpers} from "./UnitHelpers.ts";
import {AddItemToManifest} from "./ItemHelpers.ts";

let free = false;

function GetBase(newItemName: string, unit_modifier: any, required_tag: string, price: any, ability = false) {
    let result: any = {
        "version": 0,
        "item_type": "ship_component",
        "hud_icon": "vasari_upgrade_hull_armor_1_research_subject_hud_icon",
        "name": `:${newItemName}`,
        "description": ":Makes the ship a super capital",
        "build_time": free ? 1 : 100.0,
        "price": price,
        "required_unit_tags": [
            required_tag
        ],
        "weapon_modifiers": [
            {
                "modifier_type": "cooldown_duration",
                "value_behavior": "scalar",
                "values": [-0.5],
            }, {
                "modifier_type": "range",
                "value_behavior": "scalar",
                "values": [0.25]
            }],
        "unit_modifiers": unit_modifier,
        "max_count_on_unit": 1,
        "build_group_id": "utility",
    }
    if (ability) {
        result.ability = newItemName;
    }
    return result;
}

function GetModifiersForTEC() {
    return [
        {
            "modifier_type": "max_hull_points",
            "value_behavior": "additive",
            "values": [5000.0]
        },
        {
            "modifier_type": "max_armor_points",
            "value_behavior": "additive",
            "values": [3000.0]
        },
        {
            "modifier_type": "max_shield_points",
            "value_behavior": "additive",
            "values": [2000.0]
        }]

}

function GetPriceForTEC() {
    return {
        "credits": 4000.0,
        "metal": 3000.0,
        "crystal": 3000.0
    }
}

function GetModifiersForAdvent() {
    return [
        {
            "modifier_type": "max_hull_points",
            "value_behavior": "additive",
            "values": [2000.0]
        },
        {
            "modifier_type": "max_armor_points",
            "value_behavior": "additive",
            "values": [2000.0]
        },
        {
            "modifier_type": "max_shield_points",
            "value_behavior": "additive",
            "values": [6000.0]
        }]

}

function GetPriceForAdvent() {
    return {
        "credits": 4000.0,
        "metal": 3000.0,
        "crystal": 3000.0
    }
}

function GetModifiersForVasari() {
    return [
        {
            "modifier_type": "max_hull_points",
            "value_behavior": "additive",
            "values": [3000.0]
        },
        {
            "modifier_type": "max_armor_points",
            "value_behavior": "additive",
            "values": [4000.0]
        },
        {
            "modifier_type": "max_shield_points",
            "value_behavior": "additive",
            "values": [3000.0]
        }]

}

function GetPriceForVasari() {
    return {
        "metal": 4000.0,
        "crystal": 4000.0
    }
}

function GetPriceForRace(id: Race) {
    if (id == Race.TEC) return GetPriceForTEC();
    if (id == Race.Advent) return GetPriceForAdvent();
    if (id == Race.Vasari) return GetPriceForVasari();
}

function GetModifiersForRace(id: Race) {
    if (id == Race.TEC) return GetModifiersForTEC();
    if (id == Race.Advent) return GetModifiersForAdvent();
    if (id == Race.Vasari) return GetModifiersForVasari();
}

export function Preprocess(ability: any, actionDataSource: any) {
    ability.level_source = "unit_item";
    ability.min_required_unit_levels = undefined;
    actionDataSource.level_count = 1;
    for (let item of actionDataSource.action_values) {
        item.action_value.values = [item.action_value.values[item.action_value.values.length - 1]];
        if (item.action_value.ratio !== undefined) {
            item.action_value.ratio.ratio_values = [item.action_value.ratio.ratio_values[item.action_value.ratio.ratio_values.length - 1]];
        }
    }
}

export function CreateItemWithAbility(newItemName: string, capitalType: string, race: Race) {
    SaveJsonFile(`entities/${newItemName}.unit_item`, GetBase(newItemName, GetModifiersForRace(race), capitalType, GetPriceForRace(race), true));
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.GetFactionBasedOnId(race), (content: any) => {
        content.ship_components.push(newItemName);
    });
}

export function CreateItem(newItemName: string, capitalType: string, race: Race) {
    SaveJsonFile(`entities/${newItemName}.unit_item`, GetBase(newItemName, GetModifiersForRace(race), capitalType, GetPriceForRace(race), false));
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.GetFactionBasedOnId(race), (content: any) => {
        content.ship_components.push(newItemName);
    });
    AddItemToManifest(newItemName);
}