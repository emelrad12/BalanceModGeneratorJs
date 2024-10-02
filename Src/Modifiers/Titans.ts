import {ReadModifyAndSaveMultipleJsonFiles} from "../FileUtils.ts";
import {UnitHelpers} from "../UnitHelpers.ts";

export function ApplyTitansChanges(){
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.AllTitans, (content: any) => {
        content.health.durability += 100;
    });
}