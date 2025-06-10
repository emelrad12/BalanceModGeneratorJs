import {FindFilesByPattern, ReadModifyAndSaveMultipleJsonFiles, SaveJsonFile} from "../FileUtils.ts";
import {AddUnitTagToManifest} from "../TagsHelpers.ts";
import {AddToPlayerResearchSubject, AddToPlayerStartingResearchSubject, CreateResearchSubjectData, Price} from "../ResearchHelper.ts";
import {UnitHelpers} from "../UnitHelpers.ts";
import {AddActionDataSourceToManifest, AddBuffToManifest} from "../AbilityHelpers.ts";

const availableSupplyTags = [2, 5, 10, 30, 50, 100];

function GetListOfClosestMatchingSumOfTags(supply: number): number[] {
    const result: number[] = [];
    let sum = 0;
    for (const tag of availableSupplyTags) {
        if (sum + tag <= supply) {
            sum += tag;
            result.push(tag);
        }
    }
    return result;
}

function GetSupplyTag(supply: number): string {
    const nthLetter = String.fromCharCode(97 + availableSupplyTags.indexOf(supply));
    return `supply${nthLetter}`;
}

export function ApplyUpkeepChanges() {
    CreateTagsPerUnitSupply();
    CreateUpkeepTechs();
}

function CreateTagsPerUnitSupply() {
    ReadModifyAndSaveMultipleJsonFiles(FindFilesByPattern(".*unit"), (content: any) => {
        if (content.build === undefined || content.build.supply_cost === undefined || content.tags.includes("structure")) {
            return false; // Skip stuff that is not mobile units
        }

        const supply = content.build.supply_cost;
        const supplyTags = GetListOfClosestMatchingSumOfTags(supply);
        for (const tag of supplyTags) {
            const supplyTag = GetSupplyTag(tag);
            content.tags.push(supplyTag);
        }
        // const tag = GetSupplyTag(supply);
        // if (!alreadySeenSupply.has(supply)) {
        //     alreadySeenSupply.add(supply);
        //     AddUnitTagToManifest(tag);
        // }
        // content.tags.push(tag);
    });
    availableSupplyTags.forEach((item) => {
        const supply = GetSupplyTag(item);
        AddUnitTagToManifest(supply);
    });
}

function CreateBuffFile(supply: number, name: string) {
    const value = supply;
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
                "buff_empire_modifier_id": value + "_credit_upkeep_modifier"
            },
            {
                "buff_empire_modifier_id": value + "_metal_upkeep_modifier"
            },
            {
                "buff_empire_modifier_id": value + "_crystal_upkeep_modifier"
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
                            "value_id": value + "_credit_upkeep",
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
                            "value_id": value + "_metal_upkeep",
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
                            "value_id": value + "_crystal_upkeep",
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

function CreateActionDataSource(value: number, name: string) {
    const actionDataSource = {
        "version": 0,
        "level_count": 1,
        "action_values": [
            {
                "action_value_id": value + "_credit_upkeep",
                "action_value": {
                    "values": [-value]
                }
            },
            {
                "action_value_id": value + "_metal_upkeep",
                "action_value": {
                    "values": [-value]
                }
            },
            {
                "action_value_id": value + "_crystal_upkeep",
                "action_value": {
                    "values": [-value]
                }
            }

        ],
        "buff_empire_modifiers": [
            {
                "buff_empire_modifier_id": value + "_credit_upkeep_modifier",
                "buff_empire_modifier": {
                    "modifier_type": "credit_income_rate",
                    "value_behavior": "additive",
                    "value_id": value + "_credit_upkeep"
                }
            },
            {
                "buff_empire_modifier_id": value + "_metal_upkeep_modifier",
                "buff_empire_modifier": {
                    "modifier_type": "metal_income_rate",
                    "value_behavior": "additive",
                    "value_id": value + "_metal_upkeep"
                }
            },
            {
                "buff_empire_modifier_id": value + "_crystal_upkeep_modifier",
                "buff_empire_modifier": {
                    "modifier_type": "crystal_income_rate",
                    "value_behavior": "additive",
                    "value_id": value + "_crystal_upkeep"
                }
            }
        ]
    };
    SaveJsonFile("entities" + "/" + name + ".action_data_source", actionDataSource);
    AddActionDataSourceToManifest(name);
}

function CreateUpkeepTechs() {
    const effects: any = {buff_providers: []};
    const supplyArray = Array.from(availableSupplyTags).sort((a, b) => a - b);
    for (let i = 0; i < supplyArray.length; i++) {
        const item = {
            "scope": "all_owned_units",
            "all_owned_units_target_filter": {
                "unit_types": [
                    GetSupplyTag(supplyArray[i])
                ],
                "ownerships": [
                    "self"
                ]
            },
            "action_data_source": supplyArray[i] + "_upkeep_research_subject",
            "buff": supplyArray[i] + "_upkeep_research_subject"
        }
        CreateActionDataSource(supplyArray[i], item.action_data_source);
        CreateBuffFile(supplyArray[i], item.buff);
        effects.buff_providers.push(item);
    }
    const tech = CreateResearchSubjectData("upkeep_tech",
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
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.AllFactions, (content: any) => {
        AddToPlayerResearchSubject(content, tech);
        AddToPlayerStartingResearchSubject(content, tech);
    });
}