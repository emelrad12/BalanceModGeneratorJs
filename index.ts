import {ApplyStarBaseChanges} from "./Src/Modifiers/Starbase.ts";
import {ApplyEconomyChanges} from "./Src/Modifiers/Economy.ts";
import {ApplyTitansChanges} from "./Src/Modifiers/Titans.ts";
import {ApplyRepeeatableTechs} from "./Src/Modifiers/RepeatableTechs.ts";
import {Init} from "./Src/FileUtils.ts";
import {CreateResearchManifestFile} from "./Src/ResearchHelper.ts";
import {GenerateUniforms} from "./Src/UniformHelpers.ts";
import {ApplyTags} from "./Src/Modifiers/ApplyTags.ts";
import {CreateAbilitiesManifestFile} from "./Src/AbilityHelpers.ts";
import {GenerateSuperCapitalItems} from "./Src/Modifiers/ItemsAsAbilities.ts";
import {CreateItemManifestFile} from "./Src/ItemHelpers.ts";
import {GenerateFactionTechs} from "./Src/Modifiers/FactionTechs.ts";
import {CreateUnitTagsManifestFile, CreateWeaponTagsManifestFile} from "./Src/TagsHelpers.ts";

Init();
ApplyTags();
{
    ApplyEconomyChanges();
    ApplyStarBaseChanges();
    ApplyTitansChanges();
    ApplyRepeeatableTechs();
    GenerateSuperCapitalItems();
    GenerateFactionTechs();
}

CreateResearchManifestFile();
CreateAbilitiesManifestFile();
CreateItemManifestFile();
GenerateUniforms();
CreateWeaponTagsManifestFile();
CreateUnitTagsManifestFile();