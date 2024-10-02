import {SaveJsonFile} from "./FileUtils.ts";

const itemsToAddToManifest = new Set<string>();

export function CreateItemManifestFile() {
    SaveJsonFile("entities/unit_item.entity_manifest", {
        ids: Array.from(itemsToAddToManifest)
    });
}

export function AddItemToManifest(itemId: string) {
    itemsToAddToManifest.add(itemId);
}