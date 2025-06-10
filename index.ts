import {ApplyStarBaseChanges} from "./Src/Modifiers/Starbase.ts";
import {ApplyEconomyChanges} from "./Src/Modifiers/Economy.ts";
import {ApplyTitansChanges} from "./Src/Modifiers/Titans.ts";
import {DeleteCrashGuardIfExists, Init, SaveAllPendingJsonFiles} from "./Src/FileUtils.ts";
import {CreateResearchManifestFile} from "./Src/ResearchHelper.ts";
import {GenerateUniforms} from "./Src/UniformHelpers.ts";
import {ApplyTags} from "./Src/Modifiers/ApplyTags.ts";
import {CreateAbilitiesManifestFile} from "./Src/AbilityHelpers.ts";
import {CreateItemManifestFile} from "./Src/ItemHelpers.ts";
import {CreateUnitTagsManifestFile, CreateWeaponTagsManifestFile} from "./Src/TagsHelpers.ts";
import {ApplyDifficultyModifiers} from "./Src/Modifiers/Difficulty.ts";
import {ApplyUpkeepChanges} from "./Src/Modifiers/Upkeep.ts";
import {ApplyRepeatableTechs} from "./Src/Modifiers/RepeatableTechs.ts";

let startTime = Date.now();
DeleteCrashGuardIfExists();
Init();
ApplyTags();
{
    ApplyRepeatableTechs();
    ApplyUpkeepChanges();
    ApplyEconomyChanges();
    ApplyStarBaseChanges();
    ApplyTitansChanges();
    ApplyDifficultyModifiers();
}

CreateResearchManifestFile();
CreateAbilitiesManifestFile();
CreateItemManifestFile();
GenerateUniforms();
CreateWeaponTagsManifestFile();
CreateUnitTagsManifestFile();
SaveAllPendingJsonFiles();
console.log(`Finished in ${Date.now() - startTime}ms`);