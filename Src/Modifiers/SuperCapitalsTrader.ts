import {CreateItem} from "../SuperCapitalHelpers.ts";
import {Race} from "../UnitHelpers.ts";

export function GenerateSuperCapitalTraderItems() {
    CreateItem("kol_super_capital", "battle_capital", Race.TEC);
    CreateItem("akkan_super_capital", "colony_capital", Race.TEC);
    CreateItem("duron_super_capital", "carrier_capital", Race.TEC);
    CreateItem("sol_super_capital", "support_capital", Race.TEC);
    CreateItem("marza_super_capital", "siege_capital", Race.TEC);
}