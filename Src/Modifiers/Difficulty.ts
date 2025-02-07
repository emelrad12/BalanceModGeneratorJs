import {ReadModifyAndSaveMultipleJsonFiles} from "../FileUtils.ts";
import {UnitHelpers} from "../UnitHelpers.ts";

export function ApplyDifficultyModifiers() {
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.AI, (data: any) => {
        data.behaviors.aggressive.defense_to_offsense_spend_ratio = 0.5;
        data.behaviors.aggressive.desired_explore_ship_count.value = 10;
        data.behaviors.defensive.desired_explore_ship_count.value = 10;
    })
}