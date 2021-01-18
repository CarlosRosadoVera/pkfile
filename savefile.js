
const GEN_I_SAV_FILE_SIZE = 32768;

class SavFile {
    constructor(binaryFile, positions) {
        this.file = binaryFile;
        this.pos = positions;
        this.calcChecksums();
    }

    get bytes() {
        this.calcChecksums();
        return this.file.array;
    }

    get trainerName() {
        return this.file.getDelimitedString(this.pos.trainerNameStart);
    }

    set trainerName(newValue) {
        this.file.setString(this.pos.trainerNameStart, newValue, 10);
    }

    get trainerMoney() {
        return this.file.getBinaryEncodedDecimal(this.pos.trainerMoneyStart, 3);
    }

    get trainerCoins() {
        return this.file.getBinaryEncodedDecimal(this.pos.trainerCoinsStart, 2);
    }

    get trainerId() {
        return this.file.getUint16(this.pos.trainerId);
    }

    get rivalName() {
        return this.file.getDelimitedString(this.pos.rivalNameStart);
    }

    set rivalName(newValue) {
        this.file.setString(this.pos.rivalNameStart, newValue, 11);
    }

    get trainerStarter () {
        return PKMN_BY_NAT_NUMBER[
                PKMN_INDEX_TO_NUMBER_MAP[
                    this.file.getUint8(this.pos.trainerStarter)]].name;
    }

    get rivalStarter () {
        return PKMN_BY_NAT_NUMBER[
            PKMN_INDEX_TO_NUMBER_MAP[
                this.file.getUint8(this.pos.rivalStarter)]].name;
    }

    get daycare () {
        const NICKNAME_POS = this.pos.daycare + 1
        const OT_NAME_POS = this.pos.daycare + 1 + 0x0B; // 0x0B = length of previous field.
        const PKMN_BASE = this.pos.daycare + 1 + 0x0B + 0x0B; // the two previous fields length.

        const inUse = this.file.getUint8(this.pos.daycare) !== 0x0;
        const nickname = inUse ? this.file.getDelimitedString(NICKNAME_POS) : null;
        const otName = inUse ? this.file.getDelimitedString(OT_NAME_POS) : null;
        return {
            inUse: inUse,
            pkmn: inUse ? new this.pos.pkmnClass(this.file, PKMN_BASE, 0, false, otName, nickname, -1) : null
        };
    }

    get checksum () {
        return this.file.getUint8(this.pos.mainChecksum);
    }

    set checksum (value) {
        this.file.setUint8(this.pos.mainChecksum, value);
    }

    get currentBox () {
        // only the last 6 bits are used for this variable.
        return this.file.getUint8(this.pos.currentBoxIndex) & 0x7F;
    }

    get boxes () {
        const current = this.currentBox;
        const CUR_POS = this.pos.currentBox;
        return [
             this.getPokemonList( current === 0 ? CUR_POS : this.pos.box1, false, 1),
             this.getPokemonList( current === 1 ? CUR_POS : this.pos.box2, false, 2),
             this.getPokemonList( current === 2 ? CUR_POS : this.pos.box3, false, 3),
             this.getPokemonList( current === 3 ? CUR_POS : this.pos.box4, false, 4),
             this.getPokemonList( current === 4 ? CUR_POS : this.pos.box5, false, 5),
             this.getPokemonList( current === 5 ? CUR_POS : this.pos.box6, false, 6),
             this.getPokemonList( current === 6 ? CUR_POS : this.pos.box7, false, 7),
             this.getPokemonList( current === 7 ? CUR_POS : this.pos.box8, false, 8),
             this.getPokemonList( current === 8 ? CUR_POS : this.pos.box9, false, 9),
             this.getPokemonList( current === 9 ? CUR_POS : this.pos.box10, false, 10),
             this.getPokemonList( current === 10 ? CUR_POS : this.pos.box11, false, 11),
             this.getPokemonList( current === 11 ? CUR_POS : this.pos.box12, false, 12)
        ];
    }

    get playTime() {
        return this.file.getUint8(this.pos.playTimeHours) + ":" +
               this.file.getUint8(this.pos.playTimeMins).toString().padStart(2, "0") + ":" +
               this.file.getUint8(this.pos.playTimeSecs).toString().padStart(2, "0");
    }

    get pikaFriendship () {
        return this.file.getUint8(this.pos.pikachuFriendship);
    }

    get itemBag () {
        return this.getItemList(this.pos.itemBagList);
    }

    get itemBox () {
        return this.getItemList(this.pos.itemBoxList);
    }

    get pokedex() {
        let result = {array: this.file.array, pos: this.pos};
        result[Symbol.iterator] = function* () {
            for (let i = 0; i < this.pos.pokedexLength; ++i){
                const byteIndex = i >> 3; 
                const bitIndex = i & 0x07; // 0111 = 
                const seen = (this.array[this.pos.pokedexSeen + byteIndex] >> bitIndex & 1) === 1;
                const owned = (this.array[this.pos.pokedexOwned + byteIndex] >> bitIndex & 1) === 1;
                yield {
                    index: PKMN_BY_NAT_NUMBER[i].number,
                    name: seen || owned ? PKMN_BY_NAT_NUMBER[i].name: '-----------',
                    seen: seen,
                    owned: owned
                }
            }
        };
        return result;
    }

    get party () {
        if (this.partyPkmnList === undefined) {
            this.partyPkmnList = this.getPokemonList(this.pos.pkmnPartyData, true);
        } 
        return this.partyPkmnList;
    }

    getPokemonList(basePos, inParty, boxIndex) {
        const capacity = inParty ? 6 : 20; // 6 monsters if
        const pkmnSize = inParty ? this.pos.pkmnPartySize  : this.pos.pkmnBoxSize;
        let count = this.file.getUint8(basePos);
        let result =[]; 
        const otNameListOffset =  0x2 + capacity + (pkmnSize * capacity);
        const nicknameListOffset = 0x2 + capacity + (pkmnSize * capacity) + (0xB * capacity);

        for (let i = 0; i < count; ++i) {
            // before all pokemons there's 2 bytes and a list of their species.
            const pkmnBase = basePos + 0x02 + capacity + (i * pkmnSize);
            const otNamePos = basePos + otNameListOffset + (0xB * i);
            const nickNamePos = basePos + nicknameListOffset + ( 0xB * i);
            const otName = this.file.getDelimitedString(otNamePos);
            const nickname = this.file.getDelimitedString(nickNamePos);

            result.push(new this.pos.pkmnClass(this.file, pkmnBase, i, inParty, otName, nickname, boxIndex));
        }
        return result;
    }

    get hallOfFame () {
        const PKMN_SIZE = 0x10; // each pkmn is 16 bytes long.
        const HALL_SIZE = 6 * PKMN_SIZE; // 6 pkmns per hall of fame entry
        const result = [];
        const totalCount = this.file.array[this.pos.hallOfFameCount]; //
        const count = totalCount > this.pos.hallOfFameMaxCount ? this.pos.hallOfFameMaxCount : totalCount;
        for (let i = count - 1; i >= 0; --i) { // inverted loop, most recent entry first.
            const recordBase = this.pos.hallOfFameRoom + (HALL_SIZE * i); //
            const record = [];
            for (let i = 0; i < 6; ++i) {
                const pkmnBase = recordBase + (PKMN_SIZE * i); // 16 bytes per pkmn
                const speciesNumber = PKMN_INDEX_TO_NUMBER_MAP[this.file.getUint8(pkmnBase)];
                if (!speciesNumber || speciesNumber === -1) {
                    break; // early break if can't resolve pokemon.
                }
                record.push(
                    {
                        speciesNumber: PKMN_BY_NAT_NUMBER[speciesNumber - 1].number,
                        speciesName: PKMN_BY_NAT_NUMBER[speciesNumber - 1].name,
                        level: this.file.getUint8(pkmnBase + 0x01),
                        nickname: this.file.getDelimitedString(pkmnBase + 0x02)
                    }
                );
            }
            result.push({
                index: (totalCount - count) + i + 1,
                team: record
            });
        }
        return result;
    }

    getItemList(basePos) {
        const result = [];
        const count = this.file.getUint8(basePos);
        for (let i = 0; i < count; ++i ) {
            const index = basePos + (i *2) + 1;
            if (this.file.getUint8(index) === 0xFF) {
                break;
            } else {
                result.push({
                    index: this.file.getUint8(index),
                    name: this.pos.itemMap[this.file.getUint8(index)],
                    count: this.file.getUint8(index + 1)
                });
            }
        }
        return result;
    }

    calcChecksums() {
        const currentChecksum = this.file.getChecksum(this.pos.checksumDataStart, this.pos.checksumDataEnd);
        if (this.checksum === currentChecksum) {
            console.log('checksum matches (' + this.checksum + ")")
        } else {
            console.log('checksum fail ' + this.checksum + "!=" + currentChecksum);
            console.log('checksum has been reset');
            this.checksum = currentChecksum;
        }
    }
}

const USA_SAV_GEN_I = {
    hallOfFameRoom: 0x0598,
    trainerNameStart: 0x2598,
    trainerMoneyStart: 0x25F3,
    trainerId: 0x2605,
    checksumDataStart: 0x2598,
    pokedexOwned: 0x25A3,
    pokedexSeen: 0x25B6,
    rivalNameStart: 0x25F6,
    itemBagList: 0x25C9,
    badges: 0x2602,
    pikachuFriendship: 0x271C,
    itemBoxList: 0x27E6,
    hallOfFameCount: 0x284E,
    trainerCoinsStart: 0x2850,
    trainerStarter: 0x29C3,
    rivalStarter: 0x29C1,
    playTimeHours: 0x2CED,
    playTimeMins: 0x2CEF,
    playTimeSecs: 0x2CF0,
    daycare: 0x2CF4,
    pkmnPartyData: 0x2F2C,
    currentBox: 0x30C0,
    currentBoxIndex: 0x284C,
    checksumDataEnd: 0x3522,
    mainChecksum: 0x3523,
    box1: 0x4000,
    box2: 0x4462,
    box3: 0x48C4,
    box4: 0x4D26,
    box5: 0x5188,
    box6: 0x55EA,
    box7: 0x6000,
    box8: 0x6462,
    box9: 0x68C4,
    box10: 0x6D26,
    box11: 0x7188,
    box12: 0x75EA,

    hallOfFameMaxCount: 50,
    pokedexLength: 151,
    itemMap: GEN_I_ITEM_NAME_MAP,
    pkmnPartySize: 0x2C, // 44 bytes in party,
    pkmnBoxSize: 0x21, //  33 bytes in box.
    pkmnClass: PkmnGenI,
};

class GenISaveFile extends  SavFile{
    constructor(binaryFile) {
        super(binaryFile, USA_SAV_GEN_I);
    }

    get badges() {
        const badgeByte = this.file.array[this.pos.badges];
        return [
            {name:'boulder', obtained:(badgeByte && 0x80 === 0x80)},
            {name:'cascade', obtained:(badgeByte && 0x40 === 0x40)},
            {name:'thunder', obtained:(badgeByte && 0x20 === 0x20)},
            {name:'rainbow', obtained:(badgeByte && 0x10 === 0x10)},
            {name:'soul',    obtained:(badgeByte && 0x08 === 0x08)},
            {name:'marsh',   obtained:(badgeByte && 0x04 === 0x04)},
            {name:'volcano', obtained:(badgeByte && 0x02 === 0x02)},
            {name:'earth',   obtained:(badgeByte && 0x01 === 0x01)}
        ]
    }
}

const USA_SAV_GEN_II = {
    trainerId: 0x2009,
    trainerNameStart: 0x200B,
    rivalNameStart: 0x2021,
    playTimeHours: 0x2054,
    playTimeMins: 0x2055,
    playTimeSecs: 0x2056,
    trainerMoneyStart:0x23DB,
    trainerCoinsStart: 0x23E2,
    pokedexOwned:0x2A4C,
    pokedexSeen:0x2A6C,
    currentBoxIndex: 0x2724,
    currentBox:0x2D6C,//
    pkmnPartyData: 0x288A,
    hallOfFameCount: 0x321A,
    hallOfFameRoom: 0x321B,
    box1: 0x4000,
    box2: 0x4450,
    box3: 0x48A0,
    box4: 0x4CF0,
    box5: 0x5140,
    box6: 0x5590,
    box7: 0x59E0,
    box8: 0x6000,
    box9: 0x6450,
    box10: 0x68A0,
    box11: 0x6CF0,
    box12: 0x7140,
    box13: 0x7590,
    box14: 0x79E0,
    itemBagList: 0x241F,
    itemBoxList: 0x247E,
    badges: 0x23E4,

    hallOfFameMaxCount: 30,
    pokedexLength: 251,
    itemMap: GEN_II_ITEM_NAME_MAP,
    pkmnPartySize: 0x30, // 48 bytes in party,
    pkmnBoxSize: 0x20, //  32 bytes in box.
    pkmnClass: PkmnGenII,
};

class GenIISaveFile extends SavFile {
    constructor(binaryFile) {
        super(binaryFile, USA_SAV_GEN_II);
    }

    get currentBox () {
        // only the last 4 bits are used for this variable.
        return this.file.getUint8(this.pos.currentBoxIndex) & 0x0F; // 0011 1111
    }

    get badges() {
        const badgeByte = this.file.array[this.pos.badges];
        return [
            {name:'zephyr',  obtained:(badgeByte && 0x80 === 0x80)},
            {name:'insect',  obtained:(badgeByte && 0x40 === 0x40)},
            {name:'plain',   obtained:(badgeByte && 0x20 === 0x20)},
            {name:'fog',     obtained:(badgeByte && 0x10 === 0x10)},
            {name:'storm',   obtained:(badgeByte && 0x08 === 0x08)},
            {name:'mineral', obtained:(badgeByte && 0x04 === 0x04)},
            {name:'glacier', obtained:(badgeByte && 0x02 === 0x02)},
            {name:'rising',  obtained:(badgeByte && 0x01 === 0x01)}
        ]
    }

    get hallOfFame () {
        const PKMN_SIZE = 0x10; // each pkmn is 16 bytes long.
        const HALL_SIZE = 2 + 6 * PKMN_SIZE; // 6 pkmns per hall of fame entry
        const result = [];
        const totalCount = this.file.array[this.pos.hallOfFameCount]; //
        const count = totalCount > this.pos.hallOfFameMaxCount ? this.pos.hallOfFameMaxCount : totalCount;
        for (let i = 0; i < count; ++i) {
            const recordBase = this.pos.hallOfFameRoom + (HALL_SIZE * i); //
            const record = [];
            for (let i = 0; i < 6; ++i) {
                const pkmnBase = recordBase + (PKMN_SIZE * i); // 16 bytes per pkmn
                const speciesNumber = this.file.getUint8(pkmnBase) - 1;
                if (!speciesNumber || speciesNumber === -1) {
                    break; // early break if can't resolve pokemon.
                }
                record.push(
                    {
                        speciesNumber: PKMN_BY_NAT_NUMBER[speciesNumber].number,
                        speciesName: PKMN_BY_NAT_NUMBER[speciesNumber].name,
                        level: this.file.getUint8(pkmnBase + 0x05),
                        nickname: this.file.getDelimitedString(pkmnBase + 0x06, 10)
                    }
                );
            }
            result.push({
                index: (totalCount) - i,
                team: record
            });
        }
        return result;
    }
}


const SUPPORTED_VERSIONS = [
    { name: 'YELLOW',  gen: 'I',  savClass: GenISaveFile,  codec: AMERICA_TEXT_CODEC },
    { name: 'BLUE',    gen: 'I',  savClass: GenISaveFile,  codec: AMERICA_TEXT_CODEC },
    { name: 'RED',     gen: 'I',  savClass: GenISaveFile,  codec: AMERICA_TEXT_CODEC },
    { name: 'SILVER',  gen: 'II', savClass: GenIISaveFile, codec: AMERICA_TEXT_CODEC_GEN_II },
    { name: 'GOLD',    gen: 'II', savClass: GenIISaveFile, codec: AMERICA_TEXT_CODEC_GEN_II },
    { name: 'CRYSTAL', gen: 'II', savClass: GenIISaveFile, codec: AMERICA_TEXT_CODEC_GEN_II }
];




