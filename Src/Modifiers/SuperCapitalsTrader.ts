import {AddBuffToManifest, CopyExistingAbilityAsNewOne} from "../AbilityHelpers.ts";
import {LoadJsonFile, SaveJsonFile} from "../FileUtils.ts";
import {CreateItemWithAbility, Preprocess} from "../SuperCapitalHelpers.ts";
import {Race} from "../UnitHelpers.ts";


function KolAbility() {
    let newItemName = "kol_super_capital";
    CopyExistingAbilityAsNewOne("trader_rebel_titan_piercing_shot", newItemName, (ability, actionDataSource) => {
        Preprocess(ability, actionDataSource);
        ability.active_actions.actions.actions[0].operators.pop();
        CreateItemWithAbility(newItemName, "battle_capital", Race.TEC);
    })
}

function AkkanAbility() {
    let newItemName = "akkan_super_capital";
    CopyExistingAbilityAsNewOne("vasari_carrier_capital_ship_nanite_armor", newItemName, (ability, actionDataSource, buff) => {
        Preprocess(ability, actionDataSource);
        buff.trigger_event_actions.shift();
        ability.active_actions.actions.actions[0].operators.pop();
        ability.active_actions.actions.actions[0].operators.at(-1).buff = newItemName;
        actionDataSource.target_filters[0].target_filter.constraints.at(-1).constraint.buff = newItemName;
        actionDataSource.target_filters[1].target_filter.constraints.at(-1).constraint.buff = newItemName;
        CreateItemWithAbility(newItemName, "colony_capital", Race.TEC);
    })
}

function DuronAbility() {
    let newItemName = "duron_super_capital";
    CopyExistingAbilityAsNewOne("advent_rebel_titan_chastic_burst", newItemName, (ability, actionDataSource) => {
        Preprocess(ability, actionDataSource);
        ability.active_actions.actions.actions.pop();
        ability.active_actions.actions.actions.pop();
        CreateItemWithAbility(newItemName, "support_capital", Race.TEC);
    })
}

function SolAbility() {
    let newItemName = "sol_super_capital";
    CopyExistingAbilityAsNewOne("advent_carrier_capital_ship_anima_tempest", newItemName, (ability, actionDataSource) => {
        Preprocess(ability, actionDataSource);
        let onFightersBuff = LoadJsonFile("entities/advent_carrier_capital_ship_anima_tempest_on_fighters.buff")!;
        let onTargetBuff = LoadJsonFile("entities/advent_carrier_capital_ship_anima_tempest_on_target.buff")!;
        ability.active_actions.actions.actions.pop();
        ability.active_actions.actions.actions[0].operators[0].buff = `${newItemName}_on_target`;
        onFightersBuff.trigger_event_actions[0].action_group.actions.pop();
        onTargetBuff.time_actions[0].action_group.actions[0].operators[0].buff = `${newItemName}_on_fighters`
        SaveJsonFile(`entities/${newItemName}_on_fighters.buff`, onFightersBuff);
        SaveJsonFile(`entities/${newItemName}_on_target.buff`, onTargetBuff);
        AddBuffToManifest(`${newItemName}_on_fighters`);
        AddBuffToManifest(`${newItemName}_on_target`);
        CreateItemWithAbility(newItemName, "carrier_capital", Race.TEC);
    })
}

function MarzaAbility() {
    let newItemName = "marza_super_capital";
    CopyExistingAbilityAsNewOne("trader_rebel_titan_explosive_shot", newItemName, (ability, actionDataSource) => {
        Preprocess(ability, actionDataSource);
        let onSpawnerBuff = LoadJsonFile("entities/trader_rebel_titan_explosive_shot_on_spawner.buff")!;
        ability.active_actions.actions.actions[0].operators[0].buff = `${newItemName}_on_spawner`;
        ability.active_actions.actions.actions[0].operators.pop();
        SaveJsonFile(`entities/${newItemName}_on_spawner.buff`, onSpawnerBuff);
        AddBuffToManifest(`${newItemName}_on_spawner`);
        CreateItemWithAbility(newItemName, "siege_capital", Race.TEC);
    })
}

export function GenerateSuperCapitalTraderItems() {
    KolAbility();
    AkkanAbility();
    DuronAbility();
    SolAbility();
    MarzaAbility();
}