import {CreateItem} from "../SuperCapitalHelpers.ts";
import {Race} from "../UnitHelpers.ts";

export function GenerateSuperCapitalsAdventItems() {
    CreateItem("radiance_super_capital", "battle_capital", Race.Advent);
    CreateItem("progenitor_super_capital", "colony_capital", Race.Advent);
    CreateItem("halcylon_super_capital", "carrier_capital", Race.Advent);
    CreateItem("rapture_super_capital", "support_capital", Race.Advent);
    CreateItem("revelation_super_capital", "siege_capital", Race.Advent);
}