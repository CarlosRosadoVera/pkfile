const TRAINER_NAME_START_POS = 0x2598;
const TRAINER_ID_POS = 0x2605;
const TRAINER_MONEY_START_POS = 0x25F3;
const TRAINER_COINS_START_POS = 0x2850;
const RIVAL_NAME_START_POS = 0x25F6;
const PLAY_TIME_HOURS_POS = 0x2CED;
const PLAY_TIME_MINS_POS = 0x2CEF;
const PLAY_TIME_SECS_POS = 0x2CF0;
const PIKACHU_FRIENDSHIP_POS = 0x271C;
const ITEM_BAG_LIST_POS = 0x25C9;
const ITEM_BOX_LIST_POS = 0x27E6;
const POKEDEX_OWNED_POS = 0x25A3;
const POKEDEX_SEEN_POS = 0x25B6;
const PKMN_PARTY_DATA_POS = 0x2F2C;
const HALL_OF_FAME_ROOM_POS = 0x0598;
const HALL_OF_FAME_COUNT_POS = 0x284E;

const TERM_LEN = -1;

const SAV_FILE_SIZE = 32768;

class SaveFile {
    constructor(binaryFile) {
        this.file = binaryFile;
        this.calcChecksums();
    }

    get bytes() {
        this.calcChecksums();
        return this.file.array;
    }

    get trainerName() {
        return this.file.getDelimitedString(TRAINER_NAME_START_POS);
    }

    set trainerName(newValue) {
        this.file.setString(TRAINER_NAME_START_POS, newValue, 11);
    }

    calcChecksums() {
        const currentChecksum = this.file.getChecksum(0x2598, 0x3522);
        if (this.checksum == currentChecksum) {
            console.log('checksum matches (' + this.checksum + ")")
        } else {
            console.log('checksum fail ' + this.checksum + "!=" + currentChecksum);
            console.log('checksum has been reset');
            this.checksum = currentChecksum;
        }
    }

    get trainerMoney() {
        return this.file.getBinaryEncodedDecimal(TRAINER_MONEY_START_POS, 0x03);
    }

    get trainerCoins() {
        return this.file.getBinaryEncodedDecimal(TRAINER_COINS_START_POS, 0x02);
    }

    get trainerId() {
        return this.file.getUint16(TRAINER_ID_POS);
    }

    get rivalName() {
        return this.file.getDelimitedString(RIVAL_NAME_START_POS);
    }

    set rivalName() {
        this.file.setString(RIVAL_NAME_START_POS, newValue, 11);
    }

    get trainerStarter () {
        return PKMN_NAME_MAP[
                PKMN_INDEX_TO_NUMBER_MAP[
                    this.file.getUint8(0x29C3)]];
    }

    get rivalStarter () {
        return PKMN_NAME_MAP[
                PKMN_INDEX_TO_NUMBER_MAP[
                    this.file.getUint8(0x29C1)]];
    }

    get daycare () {
        const inUse = this.file.getUint8[0x2CF4] != 0x0;
        const nickname = inUse ? this.file.getDelimitedString(0x2CF5) : null;
        const otName = inUse ? this.file.getDelimitedString(0x2D00) : null;
        return {
            inUse: inUse,
            pkmn: inUse ? new Pkmn(this, 0x2D0B, 0, false, otName, nickname, -1) : null
        };
    }

    get checksum () {
        return this.file.array[0x3523];
    }

    set checksum (value) {
        this.file.setUint8(0x3523, value);
    }

    get currentBox () {
        return this.file.getUint16(0x284C) & 0x7F;
    }

    get boxes () {
        const current = this.currentBox;
        return [
             this.getPokemonList( current == 0 ? 0x30C0 : 0x4000, false, 1),
             this.getPokemonList( current == 1 ? 0x30C0 : 0x4462, false, 2),
             this.getPokemonList( current == 2 ? 0x30C0 : 0x48C4, false, 3),
             this.getPokemonList( current == 3 ? 0x30C0 : 0x4D26, false, 4),
             this.getPokemonList( current == 4 ? 0x30C0 : 0x5188, false, 5),
             this.getPokemonList( current == 5 ? 0x30C0 : 0x55EA, false, 6),
             this.getPokemonList( current == 6 ? 0x30C0 : 0x6000, false, 7),
             this.getPokemonList( current == 7 ? 0x30C0 : 0x6462, false, 8),
             this.getPokemonList( current == 8 ? 0x30C0 : 0x68C4, false, 9),
             this.getPokemonList( current == 9 ? 0x30C0 : 0x6D26, false, 10),
             this.getPokemonList( current == 10 ? 0x30C0 : 0x7188, false, 11),
             this.getPokemonList( current == 11 ? 0x30C0 : 0x7188, false, 12)
        ];
    }

    get badges() {
        const badgeByte = this.file.array[0x2602];
        return {
            boulder: (badgeByte && 0x80 == 0x80),
            cascade: (badgeByte && 0x40 == 0x40),
            thunder: (badgeByte && 0x20 == 0x20),
            rainbow: (badgeByte && 0x10 == 0x10),
            soul:    (badgeByte && 0x08 == 0x08),
            marsh:   (badgeByte && 0x04 == 0x04),
            volcano: (badgeByte && 0x02 == 0x02),
            earth:   (badgeByte && 0x01 == 0x01)
        }
    }

    get playTime() {
        return this.file.array[PLAY_TIME_HOURS_POS] + ":" + 
               this.file.array[PLAY_TIME_MINS_POS] + ":" + 
               this.file.array[PLAY_TIME_SECS_POS];
    }

    get pikaFriendship () {
        return this.file.array[PIKACHU_FRIENDSHIP_POS];
    }


    get itemBag () {
        return this.getItemList(ITEM_BAG_LIST_POS);
    }

    get itemBox () {
        return this.getItemList(ITEM_BOX_LIST_POS);
    }

    get pokedex() {
        let result = {array: this.file.array}
        result[Symbol.iterator] = function* () {
            for (let i = 0; i < 151; ++i){
                const byteIndex = i >> 3; 
                const bitIndex = i & 0x07; // 0111 = 
                const seen = (this.array[POKEDEX_SEEN_POS + byteIndex] >> bitIndex & 1) == 1;
                const owned = (this.array[POKEDEX_OWNED_POS + byteIndex] >> bitIndex & 1) == 1;
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
        if (this.partyPkmnList == undefined) {
            this.partyPkmnList = this.getPokemonList(PKMN_PARTY_DATA_POS, true);
        } 
        return this.partyPkmnList;
    }

    getPokemonList(basePos, inParty, boxIndex) {
        const capacity = inParty ? 6 : 20;
        const pkmnSize = inParty ? 0x2C : 0x21
        let count = this.file.array[basePos];
        let result =[]; 
        const otNameListOffset =  0x2 + capacity + (pkmnSize * capacity);
        const nicknameListOffset = 0x2 + capacity + (pkmnSize * capacity) + (0xB * capacity);

        for (let i = 0; i < count; ++i) {
            // before all pokemons there's a 2 bytes and a list of their species.
            const pkmnBase = basePos + 0x02 + capacity + (i * pkmnSize);
            const otNamePos = basePos + otNameListOffset + (0xB * i);
            const nickNamePos = basePos + nicknameListOffset + ( 0xB * i);
            const otName = this.file.getDelimitedString(otNamePos);
            const nickname = this.file.getDelimitedString(nickNamePos);

            result.push(new Pkmn(this.file, pkmnBase, i, inParty, otName, nickname, boxIndex));
        }
        return result;
    }

    get hallOfFame () {
        const result = [];
        const totalCount = this.file.array[HALL_OF_FAME_COUNT_POS];
        const count = totalCount > 50 ? 50 : totalCount;
        for (let i = count - 1; i >= 0; --i) {
            const recordBase = HALL_OF_FAME_ROOM_POS + (0x60 * i);
            const record = [];
            for (let i = 0; i < 6; ++i) {
                const pkmnBase = recordBase + (0x10 * i);
                const speciesNumber = PKMN_INDEX_TO_NUMBER_MAP[this.file.array[pkmnBase]];
                if (!speciesNumber || speciesNumber === -1) {
                    break; // early break if can't resolve pokemon.
                }
                record.push(
                    {
                        speciesNumber: PKMN_BY_NAT_NUMBER[speciesNumber].number,
                        speciesName: PKMN_BY_NAT_NUMBER[speciesNumber].name,
                        level: this.file.array[pkmnBase + 0x01],
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
        const count = this.file.array[basePos];
        for (let i = 0; i < count; ++i ) {
            const index = basePos + (i *2) + 1;
            if (this.file.array[index] == 0xFF) {
                break;
            } else {
                result.push({
                    index: this.file.array[index],
                    name: GEN_I_ITEM_NAME_MAP[this.file.array[index]],
                    count: this.file.array[index + 1]
                });
            }
        }
        return result;
    }
}






