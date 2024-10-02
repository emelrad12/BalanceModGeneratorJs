import {LoadJsonFile, SaveJsonFile} from "./FileUtils.ts";
import {AddItemToManifest} from "./ItemHelpers.ts";

const abilitiesToAddToManifest = new Set<string>();
const actionDataSourcesToAddToManifest = new Set<string>();
const buffToAddToManifest = new Set<string>();

export function CreateAbilitiesManifestFile() {
    SaveJsonFile("entities/ability.entity_manifest", {
        ids: Array.from(abilitiesToAddToManifest)
    });
    SaveJsonFile("entities/action_data_source.entity_manifest", {
        ids: Array.from(abilitiesToAddToManifest)
    });
    SaveJsonFile("entities/buff.entity_manifest", {
        ids: Array.from(buffToAddToManifest)
    });
}

export function AddAbilityToManifest(ability: string) {
    abilitiesToAddToManifest.add(ability);
}

export function AddActionDataSourceToManifest(actionDataSource: string) {
    actionDataSourcesToAddToManifest.add(actionDataSource);
}

export function AddBuffToManifest(buff: string) {
    buffToAddToManifest.add(buff);
}

export function CopyExistingAbilityAsNewOne(existing: string, newId: string, modifyFunction: (ability: any, actionDataSource: any, buff: any) => void) {
    let abilityFile = `entities/${existing}.ability`;
    let actionDataSourceFile = `entities/${existing}.action_data_source`;
    let buffFile = `entities/${existing}.buff`;
    let ability: any = LoadJsonFile(abilityFile);
    let actionDataSource: any = LoadJsonFile(actionDataSourceFile);
    let buff: any = LoadJsonFile(buffFile);
    ability.action_data_source = newId;
    modifyFunction(ability, actionDataSource, buff);
    SaveJsonFile(`entities/${newId}.ability`, ability);
    SaveJsonFile(`entities/${newId}.action_data_source`, actionDataSource);
    if (buff !== undefined) {
        SaveJsonFile(`entities/${newId}.buff`, buff);
        buffToAddToManifest.add(newId);
    }
    AddItemToManifest(`${newId}`);
    abilitiesToAddToManifest.add(newId);
    actionDataSourcesToAddToManifest.add(newId);
}