import {AddUnitTagToManifest, AddWeaponTagToManifest} from "./TagsHelpers.ts";


export function GenerateUniforms() {
    AddWeaponTagToManifest("structure");
    AddUnitTagToManifest("battle_capital");
    AddUnitTagToManifest("colony_capital");
    AddUnitTagToManifest("support_capital");
    AddUnitTagToManifest("carrier_capital");
    AddUnitTagToManifest("siege_capital");
}