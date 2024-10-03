import {FindFilesByPattern, FindFilesBySimplePattern, ReadModifyAndSaveMultipleJsonFiles} from "../FileUtils.ts";
import {UnitHelpers} from "../UnitHelpers.ts";

export function ApplyStarBaseChanges() {
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.AllStarbases, (content: any) => {
        content.health.durability += 100;
        content.health.levels[0].max_hull_points *= 2;
        content.health.levels[0].max_armor_points *= 2;
        content.health.levels[0].max_shield_points *= 2;
        content.build.price.credits *= 2;
        content.build.price.metal *= 2;
        content.build.price.crystal *= 2;
        content.build.exotic_price[0].count *= 2;
    });

    ReadModifyAndSaveMultipleJsonFiles(FindFilesBySimplePattern("starbase", "weapon"), (content: any) => {
        content.cooldown_duration /= 2;
    });

    ReadModifyAndSaveMultipleJsonFiles(FindFilesByPattern('^.*\\.unit_item$'), (content: any) => {
        if (content.required_unit_tags === undefined) return false;
        if (content.required_unit_tags.includes("starbase")) {
            if (content.price === undefined || content.unit_modifiers === undefined) return false;
            content.price.credits *= 2;
            content.price.metal *= 2;
            content.price.crystal *= 2;
            for (let modifier of content.unit_modifiers) {
                if (modifier.modifier_type === "max_hull_points") {
                    modifier.values[0] *= 2;
                }
                if (modifier.modifier_type === "max_armor_points") {
                    modifier.values[0] *= 2;
                }
                if (modifier.modifier_type === "max_shield_points") {
                    modifier.values[0] *= 2;
                }
                if (modifier.modifier_type === "max_squadron_capacity") {
                    modifier.values[0] *= 2;
                }
            }

        }
    });
}