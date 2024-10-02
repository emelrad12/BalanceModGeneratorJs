import {FindFilesBySimplePattern, ReadModifyAndSaveMultipleJsonFiles} from "../FileUtils.ts";
import {UnitHelpers} from "../UnitHelpers.ts";

export function ApplyStarBaseChanges(){
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.AllStarbases, (content: any) => {
        content.health.durability += 150;
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
}