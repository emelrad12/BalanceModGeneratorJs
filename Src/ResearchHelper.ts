import {SaveJsonFile} from "./FileUtils.ts";

const addedTech: string[] = []
export function CreateResearchManifestFile() {
    SaveJsonFile("entities/research_subject.entity_manifest", {ids: addedTech});
}
export class Price {
    constructor(credits: number, metal: number, crystal: number) {
        this.credits = credits;
        this.metal = metal;
        this.crystal = crystal;
    }

    credits: number | undefined;
    metal: number | undefined;
    crystal: number | undefined;
}

export class ExoticPrice {
    constructor(exotic_type: string, count: number) {
        this.exotic_type = exotic_type;
        this.count = count;
    }

    exotic_type: string;
    count: number;
}

export function CreateResearchSubjectData(IdName: string, description: string, hudIcon: string, tooltipPicture: string, domain: string, field: string, field_coord: [number, number], research_time: number, price: Price, exoticPrice: ExoticPrice[] | undefined, effects: any, prereqs: string[][] | undefined): any {
    let tier = Math.floor((field_coord[0]) / 2);
    let result = {
        IdName: IdName,
        description: description,
        hud_icon: hudIcon,
        tooltip_picture: tooltipPicture,
        version: 0,
        domain: domain,
        tier: tier,
        field: field,
        field_coord: field_coord,
        research_time: research_time,
        price: price,
        exotic_price: exoticPrice,
        prerequisites: prereqs,
    }
    Object.assign(result, effects);
    SaveTech(result);
    return result;
}

export function AddToPlayerResearchSubject(player: any, researchSubject: any) {
    let name = researchSubject.IdName;
    player.research.research_subjects.push(name);
}

export function IdNameToName(name: string): string {
    return `:${name.replace(/_/g, " ").toUpperCase()}`;
}

export function AddToPlayerNewCategory(player: any, isMil: boolean, category: string, customName: string, picture: string) {
    if (isMil) {
        player.research.research_domains.military.research_fields.push({
            id: category,
            name: customName,
            picture: picture
        });
        return;
    } else {
        player.research.research_domains.civilian.research_fields.push({
            id: category,
            name: customName,
            picture: picture
        });
        return;
    }
}

export function SaveTech(tech: any) {
    tech.name = IdNameToName(tech.IdName)
    addedTech.push(tech.IdName);
    tech.name_uppercase = tech.name.toUpperCase();
    SaveJsonFile("entities/" + tech.IdName + ".research_subject", tech);
}