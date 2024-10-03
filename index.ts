import {ApplyStarBaseChanges} from "./Src/Modifiers/Starbase.ts";
import {ApplyEconomyChanges} from "./Src/Modifiers/Economy.ts";
import {ApplyTitansChanges} from "./Src/Modifiers/Titans.ts";
import {ApplyRepeeatableTechs} from "./Src/Modifiers/RepeatableTechs.ts";
import {Init} from "./Src/FileUtils.ts";
import {CreateResearchManifestFile} from "./Src/ResearchHelper.ts";
import {GenerateUniforms} from "./Src/UniformHelpers.ts";
import {ApplyTags} from "./Src/Modifiers/ApplyTags.ts";
import {CreateAbilitiesManifestFile} from "./Src/AbilityHelpers.ts";
import {GenerateSuperCapitalTraderItems} from "./Src/Modifiers/SuperCapitalsTrader.ts";
import {CreateItemManifestFile} from "./Src/ItemHelpers.ts";
import {GenerateFactionTechs} from "./Src/Modifiers/FactionTechs.ts";
import {CreateUnitTagsManifestFile, CreateWeaponTagsManifestFile} from "./Src/TagsHelpers.ts";
import {GenerateSuperCapitalsAdventItems} from "./Src/Modifiers/SuperCapitalsAdvent.ts";
import {GenerateSuperCapitalVasariItems} from "./Src/Modifiers/SuperCapitaVasari.ts";
let startTime = Date.now();
Init();
ApplyTags();
{
    ApplyEconomyChanges();
    ApplyStarBaseChanges();
    ApplyTitansChanges();
    ApplyRepeeatableTechs();
    GenerateSuperCapitalTraderItems();
    GenerateSuperCapitalsAdventItems();
    GenerateSuperCapitalVasariItems();
    GenerateFactionTechs();
}

CreateResearchManifestFile();
CreateAbilitiesManifestFile();
CreateItemManifestFile();
GenerateUniforms();
CreateWeaponTagsManifestFile();
CreateUnitTagsManifestFile();
console.log(`Finished in ${Date.now() - startTime}ms`);