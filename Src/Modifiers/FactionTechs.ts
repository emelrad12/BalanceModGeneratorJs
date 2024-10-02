import {
    AddToPlayerNewCategory,
    AddToPlayerResearchSubject,
    CreateResearchSubjectData,
    ExoticPrice,
    Price
} from "../ResearchHelper.ts";
import {ReadModifyAndSaveMultipleJsonFiles} from "../FileUtils.ts";
import {UnitHelpers} from "../UnitHelpers.ts";

export function GenerateFactionTechs() {
    let tech = CreateResearchSubjectData("advent_pd_upgrade",
        ":Boosts pd.",
        "trader_planet_bombing_damage_0_research_subject_hud_icon",
        "trader_planet_bombing_damage_0_research_subject_tooltip_picture",
        "military",
        "repeatables",
        [0, 3],
        250,
        new Price(2000, 750, 1500),
        [new ExoticPrice("ultimate", 25)],
        {
            "weapon_modifiers": [
                {
                    "value_behavior": "scalar",
                    "modifier_type": "range",
                    "value": 0.5,
                    "tags": ["point_defense"]
                }
            ],
        },
        []);
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.Advent, (content: any) => {
        AddToPlayerResearchSubject(content, tech);
    });
}