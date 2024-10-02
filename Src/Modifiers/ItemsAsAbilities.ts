import {CopyExistingAbilityAsNewOne} from "../AbilityHelpers.ts";
import {ReadModifyAndSaveMultipleJsonFiles, SaveJsonFile} from "../FileUtils.ts";
import {UnitHelpers} from "../UnitHelpers.ts";

let free = true;

function GetBase(newItemName: string, unit_modifier: any, required_tag: string) {
    return {
        "version": 0,
        "item_type": "ship_component",
        "hud_icon": "vasari_upgrade_hull_armor_1_research_subject_hud_icon",
        "name": `:${newItemName}`,
        "description": ":Makes the ship a super capital",
        "build_time": free ? 1 : 100.0,
        "price":
            {
                "credits": free ? 0 : 7500.0,
                "metal": free ? 0 : 4000.0,
                "crystal": free ? 0 : 4000.0
            },
        "required_unit_tags": [
            required_tag
        ],
        "weapon_modifiers": [
            {
                "modifier_type": "cooldown_duration",
                "value_behavior": "scalar",
                "values": [-1],
            }, {
                "modifier_type": "range",
                "value_behavior": "scalar",
                "values": [0.25]
            }],
        "unit_modifiers": unit_modifier,
        "max_count_on_unit": 1,
        "build_group_id": "utility",
        "ability": newItemName,
    }
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

function GetModifiersForAdvent() {
    return {
        "unit_modifiers": [
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
}

function GetModifiersForVasari() {
    return {
        "unit_modifiers": [
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
}

function Preprocess(ability: any, actionDataSource: any) {
    ability.level_source = "unit_item";
    ability.min_required_unit_levels = undefined;
    actionDataSource.level_count = 1;
    for (let item of actionDataSource.action_values) {
        item.action_value.values = [item.action_value.values[item.action_value.values.length - 1]];
    }
}

function PostProcess(newItemName: string, capitalType: string) {
    SaveJsonFile(`entities/${newItemName}.unit_item`, GetBase(newItemName, GetModifiersForTEC(), capitalType));
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.AllFactions, (content: any) => {
        content.ship_components.push(newItemName);
    });
}

function KolAbility() {
    let newItemName = "kol_super_capital";
    CopyExistingAbilityAsNewOne("trader_rebel_titan_piercing_shot", newItemName, (ability, actionDataSource) => {
        Preprocess(ability, actionDataSource);
        ability.active_actions.actions.actions[0].operators.pop();
        PostProcess(newItemName, "battle_capital");
    })
}

function AkkanAbility() {
    let newItemName = "akkan_super_capital";
    CopyExistingAbilityAsNewOne("vasari_carrier_capital_ship_nanite_armor", newItemName, (ability, actionDataSource, buff) => {
        Preprocess(ability, actionDataSource);
        buff.trigger_event_actions.shift();
        ability.active_actions.actions.actions[0].operators.pop();
        ability.active_actions.actions.actions[0].operators.at(-1).buff = newItemName;
        actionDataSource.target_filters[0].target_filter.constraints.at(-1).constraint.buff = newItemName;
        actionDataSource.target_filters[1].target_filter.constraints.at(-1).constraint.buff = newItemName;
        PostProcess(newItemName, "colony_capital");
    })
}

function DuronAbility() {
    let newItemName = "duron_super_capital";
    CopyExistingAbilityAsNewOne("advent_rebel_titan_chastic_burst", newItemName, (ability, actionDataSource) => {
        Preprocess(ability, actionDataSource);
        ability.active_actions.actions.actions.pop();
        ability.active_actions.actions.actions.pop();
        PostProcess(newItemName, "support_capital");
    })
}

function SolAbility() {
    let newItemName = "sol_super_capital";
    CopyExistingAbilityAsNewOne("advent_carrier_capital_ship_anima_tempest", newItemName, (ability, actionDataSource) => {
        Preprocess(ability, actionDataSource);
        ability.active_actions.actions.actions.pop();
        PostProcess(newItemName, "siege_capital");
    })
}

export function GenerateSuperCapitalItems() {
    KolAbility();
    AkkanAbility();
    DuronAbility();
    SolAbility();
}