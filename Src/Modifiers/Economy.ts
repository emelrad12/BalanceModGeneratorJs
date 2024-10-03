import {FindFilesBySimplePattern, ReadModifyAndSaveMultipleJsonFiles} from "../FileUtils.ts";
import {UnitHelpers} from "../UnitHelpers.ts";

function FindAndReplace(array: string[], stringToFind: string, replacementString: string) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === stringToFind) {
            array[i] = replacementString;
        }
    }
}

function FindAndRemove(array: string[], stringToFind: string[]) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < stringToFind.length; j++) {
            if (stringToFind[j] === array[i]) {
                array.splice(i, 1);
                i--;
            }
        }
    }
}

function AddIfNotContains(array: string[], stringsToAdd: string[]) {
    for (let i = 0; i < stringsToAdd.length; i++) {
        if (!array.includes(stringsToAdd[i])) {
            array.push(stringsToAdd[i]);
        }
    }
}


function Allow2Titans() {
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.AllFactions, (content: any) => {
        content.unit_limits.global[0].unit_limit = 2;
    });
}

function AllowOtherFactionTitan() {
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.TraderLoyalist, (content: any) => content.buildable_units.push("trader_rebel_titan"));
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.TraderRebel, (content: any) => content.buildable_units.push("trader_loyalist_titan"));
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.AdventLoyalist, (content: any) => content.buildable_units.push("advent_rebel_titan"));
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.AdventRebel, (content: any) => content.buildable_units.push("advent_loyalist_titan"));
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.VasariLoyalist, (content: any) => content.buildable_units.push("vasari_rebel_titan"));
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.VasariRebel, (content: any) => content.buildable_units.push("vasari_loyalist_titan"));
}

function MakeAllRebelTitanUnlockFromLoyalistTech() {
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.TraderRebel, (content: any) => FindAndReplace(content.research.research_subjects, "trader_unlock_rebel_titan", "trader_unlock_loyalist_titan"));
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.AdventRebel, (content: any) => FindAndReplace(content.research.research_subjects, "advent_unlock_rebel_titan", "advent_unlock_loyalist_titan"));
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.VasariRebel, (content: any) => FindAndReplace(content.research.research_subjects, "vasari_unlock_rebel_titan", "vasari_unlock_loyalist_titan"));
    ReadModifyAndSaveMultipleJsonFiles(["entities/trader_rebel_titan.unit"], (content: any) => content.build.prerequisites = [["trader_unlock_loyalist_titan"]]);
    ReadModifyAndSaveMultipleJsonFiles(["entities/advent_rebel_titan.unit"], (content: any) => content.build.prerequisites = [["advent_unlock_loyalist_titan"]]);
    ReadModifyAndSaveMultipleJsonFiles(["entities/vasari_rebel_titan.unit"], (content: any) => content.build.prerequisites = [["vasari_unlock_loyalist_titan"]]);
    ReadModifyAndSaveMultipleJsonFiles(["entities/vasari_loyalist_titan_unlock_phase_cannon_weapon.unit_item"], (content: any) => content.build_prerequisites = undefined);
    ReadModifyAndSaveMultipleJsonFiles(["entities/vasari_loyalist_titan_improve_the_maw.unit_item"], (content: any) => content.build_prerequisites = undefined);
    ReadModifyAndSaveMultipleJsonFiles(["entities/vasari_loyalist_titan_improve_micro_phase_jump.unit_item"], (content: any) => content.build_prerequisites = undefined);

    ReadModifyAndSaveMultipleJsonFiles(["entities/vasari_rebel_titan_improve_nano_emitters.unit_item"], (content: any) => content.build_prerequisites = undefined);
    ReadModifyAndSaveMultipleJsonFiles(["entities/vasari_rebel_titan_improve_gravity_pulse.unit_item"], (content: any) => content.build_prerequisites = undefined);
    ReadModifyAndSaveMultipleJsonFiles(["entities/vasari_rebel_titan_unlock_phase_cannon_weapon.unit_item"], (content: any) => content.build_prerequisites = undefined);

    ReadModifyAndSaveMultipleJsonFiles(["entities/trader_rebel_titan_unlock_rail_gun_weapon.unit_item"], (content: any) => content.build_prerequisites = undefined);
    ReadModifyAndSaveMultipleJsonFiles(["entities/trader_rebel_titan_factory_structure.unit"], (content: any) => content.build.prerequisites[0][0] = "trader_unlock_loyalist_titan");
    ReadModifyAndSaveMultipleJsonFiles(["entities/trader_rebel_titan_unlock_rail_gun_weapon.unit_item"], (content: any) => content.build_prerequisites = undefined);

    let toRemove = ["vasari_unlock_loyalist_titan_improve_micro_phase_jump_unit_item", "vasari_unlock_loyalist_titan_improve_the_maw_unit_item", "vasari_unlock_loyalist_titan_phase_cannon_unit_item",
        "vasari_unlock_rebel_titan_improve_gravity_pulse_unit_item", "vasari_unlock_rebel_titan_improve_nano_emitters_unit_item", "vasari_unlock_rebel_titan_phase_cannon_unit_item"]
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.Vasari, (content: any) => FindAndRemove(content.research.research_subjects, toRemove));
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.Vasari, (content: any) => FindAndRemove(content.research.faction_research_subjects, toRemove));
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.Trader, (content: any) => FindAndRemove(content.research.research_subjects, ["trader_unlock_rebel_titan_rail_gun_weapon_unit_item"]));
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.Trader, (content: any) => FindAndRemove(content.research.faction_research_subjects, ["trader_unlock_rebel_titan_rail_gun_weapon_unit_item"]));

    let vasariBuildGroups: any = [];
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.VasariLoyalist, (content: any) => vasariBuildGroups = content.ship_component_build_groups);
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.VasariRebel, (content: any) => {
        content.ship_component_build_groups = vasariBuildGroups;
        content.ship_components.push("vasari_loyalist_titan_mobile_research_complex")
    });
}

function FixShipComponentsForTitansPerFaction() {
    let traderComponents: string[] = []
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.Trader, (content: any) => traderComponents.push(...content.ship_components));
    traderComponents = traderComponents.filter((value) => value.includes("titan"));
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.Trader, (content: any) => AddIfNotContains(content.ship_components, traderComponents));
    let adventComponents: string[] = []
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.Advent, (content: any) => adventComponents.push(...content.ship_components));
    adventComponents = adventComponents.filter((value) => value.includes("titan"));
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.Advent, (content: any) => AddIfNotContains(content.ship_components, adventComponents));
    let vasariComponents: string[] = []
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.Vasari, (content: any) => vasariComponents.push(...content.ship_components));
    vasariComponents = vasariComponents.filter((value) => value.includes("titan"));
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.Vasari, (content: any) => AddIfNotContains(content.ship_components, vasariComponents));
}

export function ApplyEconomyChanges() {
    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.AllExtractors, (content: any) => {
        content.structure.slots_required = 0;
    });

    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.Player, (content: any) => {
        content.marginal_tax_rate_levels.credits = [{
            rate_taxable: 1,
            tax_rate: 0
        }]
        content.marginal_tax_rate_levels.metal = [{
            rate_taxable: 1,
            tax_rate: 0
        }]
        content.marginal_tax_rate_levels.crystal = [{
            rate_taxable: 1,
            tax_rate: 0
        }]
    });

    ReadModifyAndSaveMultipleJsonFiles(UnitHelpers.AllFactions, (content: any) => {
        for (let i = 0; i < content.max_supply.levels.length; i++) {
            content.max_supply.levels[i].max_supply *= 5;
        }
    });

    ReadModifyAndSaveMultipleJsonFiles(FindFilesBySimplePattern("max_supply", "research_subject"), (content: any) => {
        content.price.credits *= 5;
        content.price.metal *= 5;
        content.price.crystal *= 5;
    });
    Allow2Titans();
    AllowOtherFactionTitan();
    MakeAllRebelTitanUnlockFromLoyalistTech();
    FixShipComponentsForTitansPerFaction();
}