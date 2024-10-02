import {ApplyStarBaseChanges} from "./Src/Modifiers/Starbase.ts";
import {ApplyEconomyChanges} from "./Src/Modifiers/Economy.ts";
import {ApplyTitansChanges} from "./Src/Modifiers/Titans.ts";
import {ApplyRepeeatableTechs} from "./Src/Modifiers/RepeatableTechs.ts";
import {Init} from "./Src/FileUtils.ts";
import {CreateManifestFile} from "./Src/ResearchHelper.ts";
import {GenerateUniforms} from "./Src/UniformHelpers.ts";
import {ApplyTags} from "./Src/Modifiers/ApplyTags.ts";

Init();
ApplyTags();
ApplyEconomyChanges();
ApplyStarBaseChanges();
ApplyTitansChanges();
ApplyRepeeatableTechs();
CreateManifestFile();
GenerateUniforms();