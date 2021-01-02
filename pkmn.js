


class Pkmn {
    constructor (savFile, pkmnBase, index, inParty, otName, nickname, boxIndex) {
        this.$savFile = savFile; // to use in getters
        this.$pkmnBase = pkmnBase; // to use in getters
        const speciesIndex = savFile.array[pkmnBase];

        this.inParty = inParty;
        this.boxIndex = inParty ? -1 : boxIndex;
        this.position = index + 1;
        this.nickname = nickname;
        this.number   = PKMN_INDEX_TO_NUMBER_MAP[speciesIndex];
        this.species  = PKMN_BY_NAT_NUMBER[PKMN_INDEX_TO_NUMBER_MAP[speciesIndex] -1];
        this.currentHp = savFile.getNumber(pkmnBase + 0x1, 2);
        this.levelFromBox = savFile.array[pkmnBase+0x3];
        this.status   = this.getStatusName(savFile.array[pkmnBase+0x4]);
        this.type1    = this.getTypeName(savFile.array[pkmnBase + 0x5]);
        this.type2    = this.getTypeName(savFile.array[pkmnBase + 0x6]);
        this.heldItem = this.getHeldItem(savFile.array[pkmnBase + 0x7]);
        this.moves = [
            this.getMove(pkmnBase, 0x08, 0x1D),
            this.getMove(pkmnBase, 0x09, 0x1E),
            this.getMove(pkmnBase, 0x0A, 0x1F),
            this.getMove(pkmnBase, 0x0B, 0x20)
        ];
        this.otIdNumber = savFile.getNumber(pkmnBase + 0x0C, 2);
        this.otName     = otName;
        this.experience = savFile.getNumber(pkmnBase + 0x0E, 3);
        this.hpEv       = savFile.getNumber(pkmnBase + 0x11,2);
        this.attackEv   = savFile.getNumber(pkmnBase + 0x13,2);
        this.defenseEv  = savFile.getNumber(pkmnBase + 0x15,2);
        this.speedEv    = savFile.getNumber(pkmnBase + 0x17,2);
        this.specialEv  = savFile.getNumber(pkmnBase + 0x19,2);
        this.hpIv       = this.calcHpIv(pkmnBase + 0x1B, pkmnBase + 0x1C);
        this.attackIv   = savFile.getHiNib(savFile.array[pkmnBase + 0x1B]);
        this.defenseIv  = savFile.getLoNib(savFile.array[pkmnBase + 0x1B]);
        this.speedIv    = savFile.getHiNib(savFile.array[pkmnBase + 0x1C]);
        this.specialIv  = savFile.getLoNib(savFile.array[pkmnBase + 0x1C]);
    }

    get level() {
        return this.inParty ? 
            this.$savFile.array[this.$pkmnBase + 0x21] : 
            this.species.ex.levelAt(this.experience);
    }

    get maxHp() {
        return this.inParty ? 
            this.$savFile.getNumber(this.$pkmnBase + 0x22, 2) : 
            this.calcHpStat(this.hpIv, this.hpEv, this.species.hp, this.level);
    }

    get attack() {
        return this.inParty ? 
            this.$savFile.getNumber(this.$pkmnBase + 0x24, 2) : 
            this.calcStat(
                this.attackIv, this.attackEv, this.species.atk, this.level);
    }

    get defense() {
        return this.inParty ? 
            this.$savFile.getNumber(this.$pkmnBase + 0x26, 2) : 
            this.calcStat(
                this.defenseIv, this.defenseEv, this.species.def, this.level);
    }

    get speed()  {  
        return this.inParty ? 
            this.$savFile.getNumber(this.$pkmnBase + 0x28, 2) : 
            this.calcStat(
                this.speedIv, this.speedEv, this.species.spd, this.level);
    }

    get special ()  {  
        return this.inParty ? 
            this.$savFile.getNumber(this.$pkmnBase + 0x2A, 2) : 
            this.calcStat(
                this.specialIv, this.specialEv, this.species.spc, this.level);
    }

    get specialAtk() {
        return this.calcStat(
            this.specialIv, this.specialEv, this.species.satk, this.level);
    }

    get specialDef() {
        return this.calcStat(
            this.specialIv, this.specialEv, this.species.sdef, this.level);
    }

    get expToNextLevel() {
        return this.species.ex.forNextLevel(
            this.level + 1,
            this.experience);
    }

    getStatusName(value) {
        switch (value) {
            case 0x04: return 'SLP';
            case 0x08: return 'PSN';
            case 0x10: return 'BRN';
            case 0x20: return 'FRZ';
            case 0x40: return 'PAR';
            default: return '--'
        }
    }

    getHeldItem(value) {
        switch(value) {
            case 0x19: return GEN_II_ITEM_NAME_MAP[0x92]; // leftovers
            case 0x2D: return GEN_II_ITEM_NAME_MAP[0x53]; // bitter berry
            case 0x32: return GEN_II_ITEM_NAME_MAP[0xAE]; // gold berry
            case 0x5A: // same as 0xFF
            case 0x64: // same as 0xFF
            case 0x78: // same as 0xFF
            case 0x7F: // same as 0xFF
            case 0xBE: // same as 0xFF
            case 0xFF: return GEN_II_ITEM_NAME_MAP[0xAD]; // berry
            default: return GEN_II_ITEM_NAME_MAP[value];
        }
    }

    calcHpIv(adIvPos, ssIvPos) {
        const adIv = this.$savFile.array[adIvPos];
        const ssIv = this.$savFile.array[ssIvPos];
        return ((adIv & 0x10) >> 1) + // 0001 0000 >>   1000
               ((adIv & 0x1 ) << 2) + // 0000 0001 >> 0100
               ((ssIv & 0x10) >> 3) +// 0001 0000 >>   0010
               ((ssIv & 0x1 ));       // 0000 0001 >> 0001
    }

    calcHpStat(iv, ev, base, level) {
        return Math.floor(
            ((((base +  iv) * 2 + Math.sqrt(ev)/4) * level) /100 ) + level + 10);
    }

    calcStat(iv, ev, base, level) {
        return Math.floor(
            ((((base +  iv) * 2 + Math.sqrt(ev)/4) * level) /100 ) + 5);
    }

    calcMaxPp(naturalPp, appliedPpUps) {
        if (naturalPp >= 35) {
            return naturalPp + (appliedPpUps * 7);
        } else {
            return naturalPp + ((naturalPp / 5) * appliedPpUps);
        }
    }

    getTypeName(value) {
        switch(value) {
            case 0x00: return 'Normal';
            case 0x01: return 'Fighting';
            case 0x02: return 'Flying';
            case 0x03: return 'Poison';
            case 0x04: return 'Ground';
            case 0x05: return 'Rock';
            case 0x07: return 'Bug';
            case 0x08: return 'Ghost';
            case 0x14: return 'Fire';
            case 0x15: return 'Water';
            case 0x16: return 'Grass';
            case 0x17: return 'Electric';
            case 0x18: return 'Psychic';
            case 0x19: return 'Ice';
            case 0x1A: return 'Dragon';
            default: return 'ERROR (' + value +')';
        }
    }

    getMove(pkmnBase, indexPos, ppPos) {
        const index = this.$savFile.array[pkmnBase + indexPos];
        const move = INDEX_TO_MOVE[index];
        if (index == 0) {
            return null;
        }
        const ppVal = this.$savFile.array[pkmnBase + ppPos];
        const appliedPpUps = (ppVal & 0xC0) >> 0x6;
        return {
            index: index,
            name: move.name,
            naturalPp: move.pp,
            appliedPpUps: appliedPpUps,// 1100 0000
            maxPp: this.calcMaxPp(move.pp, appliedPpUps),
            currentPp: ppVal & 0x3F //0011 1111
        };
    }
}