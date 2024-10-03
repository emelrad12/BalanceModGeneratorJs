export enum Race {
    TEC,
    Advent,
    Vasari
}

export class UnitHelpers {

    public static AllExtractors: string[] = [
        "entities/advent_crystal_extractor_structure.unit",
        "entities/advent_metal_extractor_structure.unit",
        "entities/trader_crystal_extractor_structure.unit",
        "entities/trader_metal_extractor_structure.unit",
        "entities/vasari_crystal_extractor_structure.unit",
        "entities/vasari_metal_extractor_structure.unit"
    ];

    public static AllStarbases: string[] = [
        "entities/advent_starbase.unit",
        "entities/trader_starbase.unit",
        "entities/vasari_starbase.unit"
    ];

    public static AllTitans: string[] = [
        "entities/advent_loyalist_titan.unit",
        "entities/advent_rebel_titan.unit",
        "entities/trader_rebel_titan.unit",
        "entities/trader_loyalist_titan.unit",
        "entities/vasari_rebel_titan.unit",
        "entities/vasari_loyalist_titan.unit"
    ];

    public static Advent: string[] = [
        "entities/advent_loyalist.player",
        "entities/advent_rebel.player"
    ];

    public static Trader: string[] = [
        "entities/trader_loyalist.player",
        "entities/trader_rebel.player"
    ];

    public static Vasari: string[] = [
        "entities/vasari_loyalist.player",
        "entities/vasari_rebel.player"
    ];

    public static TraderLoyalist: string[] = ["entities/trader_loyalist.player"];
    public static TraderRebel: string[] = ["entities/trader_rebel.player"];
    public static AdventLoyalist: string[] = ["entities/advent_loyalist.player"];
    public static AdventRebel: string[] = ["entities/advent_rebel.player"];
    public static VasariLoyalist: string[] = ["entities/vasari_loyalist.player"];
    public static VasariRebel: string[] = ["entities/vasari_rebel.player"];

    public static GetFactionBasedOnId(id: Race) {
        if (id === Race.TEC) {
            return UnitHelpers.Trader;
        }
        if (id === Race.Advent) {
            return UnitHelpers.Advent;
        }
        if (id === Race.Vasari) {
            return UnitHelpers.Vasari;
        }
        throw new Error("Invalid faction id");
    }

    public static AllFactions: string[] = [
        "entities/trader_loyalist.player",
        "entities/trader_rebel.player",
        "entities/vasari_loyalist.player",
        "entities/vasari_rebel.player",
        "entities/advent_loyalist.player",
        "entities/advent_rebel.player"
    ];

    public static Player: string[] = [
        "uniforms/player.uniforms"
    ];

    public static AI: string[] = [
        "uniforms/player_ai.uniforms"
    ];

    public static AllStrikeCraft: string[] = [
        "entities/trader_bomber_strikecraft.unit",
        "entities/trader_interceptor_strikecraft.unit",
        "entities/advent_bomber_strikecraft.unit",
        "entities/advent_interceptor_strikecraft.unit",
        "entities/vasari_bomber_strikecraft.unit"
    ];
}
