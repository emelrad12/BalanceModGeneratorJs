import {ReadModifyAndSaveMultipleJsonFiles, SaveJsonFile} from "../FileUtils.ts";
import {AddToPlayerResearchSubject, AddToPlayerStartingResearchSubject, CreateResearchSubjectData, Price} from "../ResearchHelper.ts";
import {UnitHelpers} from "../UnitHelpers.ts";
import {AddActionDataSourceToManifest, AddBuffToManifest} from "../AbilityHelpers.ts";
import {Race} from "../UnitHelpers.ts"

const availableSupplyTags = [2];

export function ApplyUpkeepChanges() {
    CreateUpkeepTechs(Race.Advent);
    CreateUpkeepTechs(Race.TEC);
    CreateUpkeepTechs(Race.Vasari);
}

function GetSupplyCostsBasedOnRace(race: Race) {
    switch (race) {
        case (Race.Advent):
            return GetSupplyCosts(new Price(20 / 1000, 10 / 1000, 10 / 1000));
        case (Race.TEC):
            return GetSupplyCosts(new Price(20 / 1000, 7.5 / 1000, 7.5 / 1000));
        case (Race.Vasari):
            return GetSupplyCosts(new Price(0 / 1000, 20 / 1000, 15 / 1000));
    }
}

function GetSupplyCosts(base: Price) {
    return {
        corvette: base.Multiply(3),
        frigate: base.Multiply(5),
        cruiser: base.Multiply(10),
        capital_ship: base.Multiply(50),
        titan: base.Multiply(300),
    }
}

function CreateBuffFile(name: string) {
    const buff = {
        "version": 0,
        "stacking_limit": {
            "stacking_limit": "fixed_one",
            "stacking_limit_met_behavior": "restart_existing_buff"
        },
        "stacking_ownership_type": "for_all_players",
        "restart_other_stacked_buffs_when_started": true,
        "make_dead_on_current_spawner_ownership_changed_from_buff_ownership": true,
        "empire_modifiers": [
            {
                "buff_empire_modifier_id": name + "_credit_upkeep_modifier"
            },
            {
                "buff_empire_modifier_id": name + "_metal_upkeep_modifier"
            },
            {
                "buff_empire_modifier_id": name + "_crystal_upkeep_modifier"
            }
        ],
        "gui": {
            "hud_icon": "trader_planet_bombing_damage_0_research_subject_hud_icon",
            "name": ":Upkeep",
            "is_visible_within_unit_tooltip": true,
            "visibility_scope": "negative",
            "tooltip_line_groups": [
                {
                    "lines": [
                        {
                            "rendering_type": "single_value",
                            "label_text": ":credit_upkeep",
                            "value_id": name + "_credit_upkeep",
                            "value_color": "negative",
                            "value_float_format": "three_decimal_place_with_sign",
                            "value_suffix": "per_second"
                        }
                    ]
                },
                {
                    "lines": [
                        {
                            "rendering_type": "single_value",
                            "label_text": ":metal_upkeep",
                            "value_id": name + "_metal_upkeep",
                            "value_color": "negative",
                            "value_float_format": "three_decimal_place_with_sign",
                            "value_suffix": "per_second"
                        }
                    ]
                },
                {
                    "lines": [
                        {
                            "rendering_type": "single_value",
                            "label_text": ":crystal_upkeep",
                            "value_id": name + "_crystal_upkeep",
                            "value_color": "negative",
                            "value_float_format": "three_decimal_place_with_sign",
                            "value_suffix": "per_second"
                        }
                    ]
                }
            ]
        }
    }
    SaveJsonFile("entities" + "/" + name + ".buff", buff);
    AddBuffToManifest(name);
}

function CreateActionDataSource(value: Price, name: string) {
    const actionDataSource = {
        "version": 0,
        "level_count": 1,
        "action_values": [
            {
                "action_value_id": name + "_credit_upkeep",
                "action_value": {
                    "values": [-value.credits],
                }
            },
            {
                "action_value_id": name + "_metal_upkeep",
                "action_value": {
                    "values": [-value.metal],
                }
            },
            {
                "action_value_id": name + "_crystal_upkeep",
                "action_value": {
                    "values": [-value.crystal],
                }
            }

        ],
        "buff_empire_modifiers": [
            {
                "buff_empire_modifier_id": name + "_credit_upkeep_modifier",
                "buff_empire_modifier": {
                    "modifier_type": "credit_income_rate",
                    "value_behavior": "additive",
                    "value_id": name + "_credit_upkeep"
                }
            },
            {
                "buff_empire_modifier_id": name + "_metal_upkeep_modifier",
                "buff_empire_modifier": {
                    "modifier_type": "metal_income_rate",
                    "value_behavior": "additive",
                    "value_id": name + "_metal_upkeep"
                }
            },
            {
                "buff_empire_modifier_id": name + "_crystal_upkeep_modifier",
                "buff_empire_modifier": {
                    "modifier_type": "crystal_income_rate",
                    "value_behavior": "additive",
                    "value_id": name + "_crystal_upkeep"
                }
            }
        ]
    };
    SaveJsonFile("entities" + "/" + name + ".action_data_source", actionDataSource);
    AddActionDataSourceToManifest(name);
}

function CreateUpkeepTechs(race: Race) {
    const supplyCosts = GetSupplyCostsBasedOnRace(race);
    const effects: any = {buff_providers: []};
    const supplyArray = ["corvette", "frigate", "cruiser", "capital_ship", "titan"];
    for (let i = 0; i < supplyArray.length; i++) {
        const supplyTag = supplyArray[i];
        const item = {
            "scope": "all_owned_units",
            "all_owned_units_target_filter": {
                "unit_types": [
                    supplyTag
                ],
                "ownerships": [
                    "self"
                ]
            },
            "action_data_source": supplyTag + race.toString() + "_upkeep",
            "buff": supplyTag + race.toString() + "_upkeep"
        }
        CreateActionDataSource(supplyCosts[supplyTag as keyof typeof supplyCosts], item.action_data_source);
        CreateBuffFile(item.buff);
        effects.buff_providers.push(item);
    }
    const tech = CreateResearchSubjectData("upkeep_tech" + race.toString(),
        ":Gives units upkeep.",
        "trader_planet_bombing_damage_0_research_subject_hud_icon",
        "trader_planet_bombing_damage_0_research_subject_tooltip_picture",
        "military",
        "repeatables",
        [0, 0],
        250,
        new Price(0, 0, 0),
        [],
        effects,
        []);
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.GetFactionBasedOnId(race), (content: any) => {
        AddToPlayerResearchSubject(content, tech);
        AddToPlayerStartingResearchSubject(content, tech);
    });
}