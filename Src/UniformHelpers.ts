import {SaveJsonFile} from "./FileUtils.ts";

export function GenerateUniforms() {
    let weapon = {
        "weapon_tags": [
            {
                "name": "structure",
                "localized_name": "unit_tag_name.structure"
            },
            {
                "name": "strikecraft",
                "localized_name": "unit_tag_name.strikecraft"
            }]
    }
    SaveJsonFile("uniforms/weapon.uniforms", weapon);
}