import {CreateItem} from "../SuperCapitalHelpers.ts";
import {Race} from "../UnitHelpers.ts";

export function GenerateSuperCapitalVasariItems() {
    CreateItem("kortul_super_capital", "battle_capital", Race.Vasari);
    CreateItem("jarsul_super_capital", "colony_capital", Race.Vasari);
    CreateItem("skiranta_super_capital", "carrier_capital", Race.Vasari);
    CreateItem("antorak_super_capital", "support_capital", Race.Vasari);
    CreateItem("vulkoras_super_capital", "siege_capital", Race.Vasari);
}