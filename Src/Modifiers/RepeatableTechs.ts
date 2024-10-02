import {ReadModifyAndSaveMultipleJsonFiles} from "../FileUtils.ts";
import {UnitHelpers} from "../UnitHelpers.ts";
import {
    AddToPlayerNewCategory,
    AddToPlayerResearchSubject,
    CreateResearchSubjectData, ExoticPrice,
    Price,
    SaveTech
} from "../ResearchHelper.ts";

const techToAdd: any[] = [];

function GenericRepeatableCost(i: number) {
    return new Price(0, 2000 + 1000 * i, 2000 + 1000 * i);
}

function GenericRepeatableExotic(i: number) {
    return [{
        exotic_type: "ultimate",
        count: 10 + 2 * i
    }];
}

function GenerateOffensiveTechs() {
    let lastTech: any = null;
    for (let i = 0; i < 10; i++) {
        let effects: any = {
            "weapon_modifiers": [
                {
                    "value_behavior": "scalar",
                    "modifier_type": "damage",
                    "value": 0.05
                },
                {
                    "value_behavior": "scalar",
                    "modifier_type": "cooldown_duration",
                    "value": -0.01
                },
                {
                    "value_behavior": "scalar",
                    "modifier_type": "range",
                    "value": 0.025
                }],

        };
        let tech = CreateResearchSubjectData("offensive_upgrade_" + i,
            ":Boosts weapons.",
            "trader_planet_bombing_damage_0_research_subject_hud_icon",
            "trader_planet_bombing_damage_0_research_subject_tooltip_picture",
            "military",
            "repeatables",
            [i, 0],
            250,
            GenericRepeatableCost(i),
            GenericRepeatableExotic(i),
            effects,
            lastTech ? [[lastTech.IdName]] : []);

        lastTech = tech;
        techToAdd.push(tech);
    }
}

function GenerateDefensiveTechs() {
    let lastTech: any = null;
    for (let i = 0; i < 10; i++) {
        let effects: any = {
            "unit_modifiers": [
                {
                    "modifier_type": "max_shield_points",
                    "value_behavior": "scalar",
                    "value": 0.07
                },
                {
                    "modifier_type": "max_hull_points",
                    "value_behavior": "scalar",
                    "value": 0.07
                },
                {
                    "modifier_type": "max_armor_points",
                    "value_behavior": "scalar",
                    "value": 0.07
                }
            ]
        };
        let tech = CreateResearchSubjectData("defensive_upgrade_" + i,
            ":Boosts defenses.",
            "advent_upgrade_shield_points_0_research_subject_hud_icon",
            "advent_upgrade_shield_points_0_research_subject_tooltip_picture",
            "military",
            "repeatables",
            [i, 1],
            250,
            GenericRepeatableCost(i),
            GenericRepeatableExotic(i),
            effects,
            lastTech ? [[lastTech.IdName]] : []);

        lastTech = tech;
        techToAdd.push(tech);
    }
}

function GenerateStructureTechs() {
    let lastTech: any = null;
    for (let i = 0; i < 10; i++) {
        let effects: any = {
            "planet_modifiers": [
                {
                    "modifier_type": "max_military_structure_slots",
                    "value_behavior": "scalar",
                    "value": 0.1
                },
            ],
            "weapon_modifiers": [
                {
                    "value_behavior": "scalar",
                    "modifier_type": "range",
                    "value": 0.1,
                    "tags": ["structure"]
                },
                {
                    "value_behavior": "scalar",
                    "modifier_type": "tracking_speed",
                    "value": 0.1,
                    "tags": ["structure"]
                }],
        };
        let tech = CreateResearchSubjectData("defensive_structure_upgrade_" + i,
            ":Boosts defensive structures.",
            "trader_unlock_starbase_improve_weapon_item_research_subject_hud_icon",
            "trader_unlock_starbase_improve_weapon_item_research_subject_tooltip_picture",
            "military",
            "repeatables",
            [i, 2],
            250,
            GenericRepeatableCost(i),
            GenericRepeatableExotic(i),
            effects,
            lastTech ? [[lastTech.IdName]] : []);

        lastTech = tech;
        techToAdd.push(tech);
    }
}

export function ApplyRepeeatableTechs() {
    GenerateOffensiveTechs();
    GenerateDefensiveTechs();
    GenerateStructureTechs();
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.AllFactions, (content: any) => {
        for (let tech of techToAdd) {
            AddToPlayerResearchSubject(content, tech);
        }
        AddToPlayerNewCategory(content, true, "repeatables", ":Repeatables", "advent_research_field_picture_military_protection");
    });
}