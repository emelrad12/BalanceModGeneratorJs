import {SaveJsonFile} from "./FileUtils.ts";

const weaponTagsToAdd = new Set<string>();
const unitTagsToAdd = new Set<string>();

export function CreateWeaponTagsManifestFile() {
    SaveJsonFile("uniforms/weapon.uniforms", {
        weapon_tags: Array.from(weaponTagsToAdd).map(tag => {
            return {
                "name": tag,
                "localized_name": `:${tag}`
            }
        })
    });
}

export function CreateUnitTagsManifestFile() {
    SaveJsonFile("uniforms/unit_tag.uniforms", {
        unit_tags: Array.from(unitTagsToAdd).map(tag => {
            return {
                "name": tag,
                "localized_name": `:${tag}`
            }
        })
    });
}

export function AddWeaponTagToManifest(tag: string) {
    weaponTagsToAdd.add(tag);
}

export function AddUnitTagToManifest(tag: string) {
    unitTagsToAdd.add(tag);
}