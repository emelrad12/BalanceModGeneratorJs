import {FindFilesBySimplePattern, ReadModifyAndSaveMultipleJsonFiles} from "../FileUtils.ts";
import {UnitHelpers} from "../UnitHelpers.ts";

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

}