

class PkmnBase {

    constructor(genFormat) {
        this.genFormat = genFormat;
    }

    get expToNextLevel() {
        return this.species.ex.forNextLevel(this.level + 1, this.experience);
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

    calcStat(iv, ev, base, level) {
        return Math.floor(
            ((((base +  iv) * 2 + Math.sqrt(ev)/4) * level) /100 ) + 5);
    }

    calcHpIv(adIv, ssIv) {
        return ((adIv & 0x10) >> 1) + // 0001 0000 >>   1000
            ((adIv & 0x1 ) << 2) + // 0000 0001 >> 0100
            ((ssIv & 0x10) >> 3) +// 0001 0000 >>   0010
            ((ssIv & 0x1 ));       // 0000 0001 >> 0001
    }

    calcMaxPp(naturalPp, appliedPpUps) {
        if (naturalPp >= 35) {
            return naturalPp + (appliedPpUps * 7);
        } else {
            return naturalPp + ((naturalPp / 5) * appliedPpUps);
        }
    }

    getMove(pkmnBase, index, ppVal) {
        if (index === 0) {
            return null;
        }
        const move = INDEX_TO_MOVE[index].forGeneration(this.genFormat);
        const appliedPpUps = (ppVal & 0xC0) >> 0x6;
        return {
            index: index,
            name: move.name,
            type: move.type,
            naturalPp: move.pp,
            appliedPpUps: appliedPpUps,// 1100 0000
            maxPp: this.calcMaxPp(move.pp, appliedPpUps),
            currentPp: ppVal & 0x3F //0011 1111
        };
    }

    calcHpStat(iv, ev, base, level) {
        return Math.floor(
            ((((base +  iv) * 2 + Math.sqrt(ev)/4) * level) /100 ) + level + 10);
    }
}

class PkmnGenI extends PkmnBase {
    constructor (binFile, pkmnBase, index, inParty, otName, nickname, boxIndex) {
        super('I');
        this.$binFile = binFile; // to use in getters
        this.$pkmnBase = pkmnBase; // to use in getters
        const speciesIndex = binFile.array[pkmnBase];

        this.inParty = inParty;
        this.boxIndex = inParty ? -1 : boxIndex;
        this.position = index + 1;
        this.nickname = nickname;
        this.number   = PKMN_INDEX_TO_NUMBER_MAP[speciesIndex];
        this.species  = PKMN_BY_NAT_NUMBER[PKMN_INDEX_TO_NUMBER_MAP[speciesIndex] -1];
        this.currentHp = binFile.getUint16(pkmnBase + 0x1);
        this.levelFromBox = binFile.array[pkmnBase+0x3];
        this.status   = this.getStatusName(binFile.array[pkmnBase+0x4]);
        this.type1    = this.getTypeName(binFile.array[pkmnBase + 0x5]);
        this.type2    = this.getTypeName(binFile.array[pkmnBase + 0x6]);
        this.heldItem = this.getHeldItem(binFile.array[pkmnBase + 0x7]);

        this.moves = [
            this.getMove(pkmnBase, this.$binFile.getUint8(pkmnBase + 0x08), this.$binFile.getUint8(pkmnBase + 0x1D)),
            this.getMove(pkmnBase, this.$binFile.getUint8(pkmnBase + 0x09), this.$binFile.getUint8(pkmnBase + 0x1E)),
            this.getMove(pkmnBase, this.$binFile.getUint8(pkmnBase + 0x0A), this.$binFile.getUint8(pkmnBase + 0x1F)),
            this.getMove(pkmnBase, this.$binFile.getUint8(pkmnBase + 0x0B), this.$binFile.getUint8(pkmnBase + 0x20)),
        ];
        this.otIdNumber = binFile.getUint16(pkmnBase + 0x0C);
        this.otName     = otName;
        this.experience = binFile.getUint24(pkmnBase + 0x0E);
        this.hpEv       = binFile.getUint16(pkmnBase + 0x11);
        this.attackEv   = binFile.getUint16(pkmnBase + 0x13);
        this.defenseEv  = binFile.getUint16(pkmnBase + 0x15);
        this.speedEv    = binFile.getUint16(pkmnBase + 0x17);
        this.specialEv  = binFile.getUint16(pkmnBase + 0x19);

        this.hpIv       = this.calcHpIv(this.$binFile.array[pkmnBase + 0x1B], this.$binFile.array[pkmnBase + 0x1C]);
        this.attackIv   = binFile.getHiNib(binFile.array[pkmnBase + 0x1B]);
        this.defenseIv  = binFile.getLoNib(binFile.array[pkmnBase + 0x1B]);
        this.speedIv    = binFile.getHiNib(binFile.array[pkmnBase + 0x1C]);
        this.specialIv  = binFile.getLoNib(binFile.array[pkmnBase + 0x1C]);
    }

    get level() {
        return this.inParty ?
            this.$binFile.array[this.$pkmnBase + 0x21] :
            this.species.ex.levelAt(this.experience);
    }

    get maxHp() {
        return this.inParty ? 
            this.$binFile.getUint16(this.$pkmnBase + 0x22) : 
            this.calcHpStat(this.hpIv, this.hpEv, this.species.hp, this.level);
    }

    get attack() {
        return this.inParty ? 
            this.$binFile.getUint16(this.$pkmnBase + 0x24) : 
            this.calcStat(
                this.attackIv, this.attackEv, this.species.atk, this.level);
    }

    get defense() {
        return this.inParty ? 
            this.$binFile.getUint16(this.$pkmnBase + 0x26) : 
            this.calcStat(
                this.defenseIv, this.defenseEv, this.species.def, this.level);
    }

    get speed()  {  
        return this.inParty ? 
            this.$binFile.getUint16(this.$pkmnBase + 0x28) : 
            this.calcStat(
                this.speedIv, this.speedEv, this.species.spd, this.level);
    }

    get special ()  {  
        return this.inParty ? 
            this.$binFile.getUint16(this.$pkmnBase + 0x2A) : 
            this.calcStat(
                this.specialIv, this.specialEv, this.species.spc, this.level);
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

    getTypeName(value) {
        switch(value) {
            case 0x00: return PKTP_NORM;
            case 0x01: return PKTP_FIGT;
            case 0x02: return PKTP_FLY;
            case 0x03: return PKTP_POSN;
            case 0x04: return PKTP_GRND;
            case 0x05: return PKTP_ROCK;
            case 0x07: return PKTP_BUG;
            case 0x08: return PKTP_GHST;
            case 0x14: return PKTP_FIRE;
            case 0x15: return PKTP_WATR;
            case 0x16: return PKTP_GRAS;
            case 0x17: return PKTP_ELEC;
            case 0x18: return PKTP_PSYC;
            case 0x19: return PKTP_ICE;
            case 0x1A: return PKTP_DRAG;
            default: return PKTP_QQQQ;
        }
    }
}

class PkmnGenII extends PkmnBase {
    constructor (binFile, pkmnBase, index, inParty, otName, nickname, boxIndex) {
        super('II');
        this.$binFile = binFile; // to use in getters
        this.$pkmnBase = pkmnBase; // to use in getters

        this.inParty   = inParty;
        this.boxIndex  = inParty ? -1 : boxIndex;
        this.position  = index + 1;
        this.nickname  = nickname;
        this.number    = binFile.array[pkmnBase];
        this.species   = PKMN_BY_NAT_NUMBER[this.number - 1];

        this.status   = this.getStatusName(binFile.array[pkmnBase+0x20]);
        this.type1    = this.species.typeI;
        this.type2    = this.species.typeII !== undefined ? this.species.typeII : this.species.typeI;
        this.heldItem = GEN_II_ITEM_NAME_MAP[pkmnBase + 0x07];
        this.moves = [
            this.getMove(pkmnBase, this.$binFile.getUint8(pkmnBase + 0x02), this.$binFile.getUint8(pkmnBase + 0x17)),
            this.getMove(pkmnBase, this.$binFile.getUint8(pkmnBase + 0x03), this.$binFile.getUint8(pkmnBase + 0x18)),
            this.getMove(pkmnBase, this.$binFile.getUint8(pkmnBase + 0x04), this.$binFile.getUint8(pkmnBase + 0x19)),
            this.getMove(pkmnBase, this.$binFile.getUint8(pkmnBase + 0x05), this.$binFile.getUint8(pkmnBase + 0x1A)),
        ];
        this.otIdNumber = binFile.getUint16(pkmnBase + 0x06);
        this.otName     = otName;
        this.experience = binFile.getUint24(pkmnBase + 0x08);
        this.hpEv       = binFile.getUint16(pkmnBase + 0x0B);
        this.attackEv   = binFile.getUint16(pkmnBase + 0x0D);
        this.defenseEv  = binFile.getUint16(pkmnBase + 0x0F);
        this.speedEv    = binFile.getUint16(pkmnBase + 0x11);
        this.specialEv  = binFile.getUint16(pkmnBase + 0x13);
        this.hpIv       = this.calcHpIv(this.$binFile.array[pkmnBase + 0x15], this.$binFile.array[pkmnBase + 0x16]);
        this.attackIv   = binFile.getHiNibOf(pkmnBase + 0x15);
        this.defenseIv  = binFile.getLoNibOf(pkmnBase + 0x15);
        this.speedIv    = binFile.getHiNibOf(pkmnBase + 0x16);
        this.specialIv  = binFile.getLoNibOf(pkmnBase + 0x16);
        this.friendship = binFile.getUint8(pkmnBase + 0x1B);
        this.pokerus =  {
            strain: binFile.getHiNibOf(pkmnBase + 0x1C),
            days: binFile.getLoNibOf(pkmnBase + 0x1C)
        };
    }

    get currentHp () {
        return this.inParty ? this.$binFile.getUint16(this.$pkmnBase + 0x22) : this.maxHp;
    }

    get level() {
        return this.inParty ?
            this.$binFile.array[this.$pkmnBase + 0x1F] :
            this.species.ex.levelAt(this.experience);
    }

    get maxHp() {
        return this.inParty ?
            this.$binFile.getUint16(this.$pkmnBase + 0x24) :
            this.calcHpStat(this.hpIv, this.hpEv, this.species.hp, this.level);
    }

    get attack() {
        return this.inParty ?
            this.$binFile.getUint16(this.$pkmnBase + 0x26) :
            this.calcStat(
                this.attackIv, this.attackEv, this.species.atk, this.level);
    }

    get defense() {
        return this.inParty ?
            this.$binFile.getUint16(this.$pkmnBase + 0x28) :
            this.calcStat(
                this.defenseIv, this.defenseEv, this.species.def, this.level);
    }

    get speed()  {
        return this.inParty ?
            this.$binFile.getUint16(this.$pkmnBase + 0x2A) :
            this.calcStat(
                this.speedIv, this.speedEv, this.species.spd, this.level);
    }

    get specialAtk() {
        return this.inParty ?
            this.$binFile.getUint16(this.$pkmnBase + 0x2C) :
            this.calcStat(this.specialIv, this.specialEv, this.species.satk, this.level);
    }

    get specialDef() {
        return this.inParty ?
            this.$binFile.getUint16(this.$pkmnBase + 0x2E) :
            this.calcStat(this.specialIv, this.specialEv, this.species.sdef, this.level);
    }

}