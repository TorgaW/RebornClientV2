export function rarityToNumber(rarity) {
    if (typeof rarity === "string") {
        if (rarity.toLowerCase() === "guarantee") return 0;
        if (rarity.toLowerCase() === "common") return 1;
        if (rarity.toLowerCase() === "rare") return 2;
        if (rarity.toLowerCase() === "epic") return 3;
        if (rarity.toLowerCase() === "mythical") return 4;
        if (rarity.toLowerCase() === "legendary") return 5;
        if (rarity.toLowerCase() === "heroic") return 6;
    } return -1;
}
