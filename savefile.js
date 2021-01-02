
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

class SaveFile {
    constructor(array, codec) {
        this.array = array;
        this.codec = codec;
    }

    get trainerName() {
        return this.getDelimitedString(TRAINER_NAME_START_POS);
    }

    get trainerMoney() {
        return this.getBinaryEncodedDecimal(TRAINER_MONEY_START_POS, 0x03);
    }

    get trainerCoins() {
        return this.getBinaryEncodedDecimal(TRAINER_COINS_START_POS, 0x02);
    }

    get trainerId() {
        return this.getNumber(TRAINER_ID_POS, 0x02);
    }

    get rivalName() {
        return this.getDelimitedString(RIVAL_NAME_START_POS);
    }

    get trainerStarter () {
        return PKMN_NAME_MAP[
                PKMN_INDEX_TO_NUMBER_MAP[
                    this.array[0x29C3]]];
    }

    get rivalStarter () {
        return PKMN_NAME_MAP[
                PKMN_INDEX_TO_NUMBER_MAP[
                    this.array[0x29C1]]];
    }

    get daycare () {
        const inUse = this.array[0x2CF4] != 0x0;
        return {
            inUse: inUse,
            name: inUse ? this.getDelimitedString(0x2CF5) : null,
            otName: inUse ? this.getDelimitedString(0x2D00) : null,
            pkmn: null
            //0x2D0B, pkmn box data format
        };
    }

    get checksum () {
        return this.array[0x3523];
    }

    get currentBox () {
        return this.getNumber(0x284C, 2) & 0x7F;
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
        const badgeByte = this.array[0x2602];
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
        return this.array[PLAY_TIME_HOURS_POS] + ":" + 
               this.array[PLAY_TIME_MINS_POS] + ":" + 
               this.array[PLAY_TIME_SECS_POS];
    }

    get pikaFriendship () {
        return this.array[PIKACHU_FRIENDSHIP_POS];
    }


    get itemBag () {
        return this.getItemList(ITEM_BAG_LIST_POS);
    }

    get itemBox () {
        return this.getItemList(ITEM_BOX_LIST_POS);
    }

    get pokedex() {
        let result = {array: this.array}
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
        const savFile = this; // used in getters
        const capacity = inParty ? 6 : 20;
        const pkmnSize = inParty ? 0x2C : 0x21
        let count = this.array[basePos];
        let result =[]; 
        const otNameListOffset =  0x2 + capacity + (pkmnSize * capacity);
        const nicknameListOffset = 0x2 + capacity + (pkmnSize * capacity) + (0xB * capacity);

        for (let i = 0; i < count; ++i) {
            // before all pokemons there's a 2 bytes and a list of their species.
            const pkmnBase = basePos + 0x02 + capacity + (i * pkmnSize);
            const otNamePos = basePos + otNameListOffset + (0xB * i);
            const nickNamePos = basePos + nicknameListOffset + ( 0xB * i);
            const otName = savFile.getDelimitedString(otNamePos);
            const nickname = savFile.getDelimitedString(nickNamePos);

            result.push(new Pkmn(this, pkmnBase, i, inParty, otName, nickname, boxIndex));
        }
        return result;
    }

    get hallOfFame () {
        const result = [];
        const totalCount = this.array[HALL_OF_FAME_COUNT_POS];
        const count = totalCount > 50 ? 50 : totalCount;
        for (let i = count - 1; i >= 0; --i) {
            const recordBase = HALL_OF_FAME_ROOM_POS + (0x60 * i);
            const record = [];
            for (let i = 0; i < 6; ++i) {
                const pkmnBase = recordBase + (0x10 * i);
                const speciesNumber = PKMN_INDEX_TO_NUMBER_MAP[this.array[pkmnBase]];
                if (!speciesNumber || speciesNumber === -1) {
                    break; // early break if can't resolve pokemon.
                }
                record.push(
                    {
                        speciesNumber: PKMN_BY_NAT_NUMBER[speciesNumber].number,
                        speciesName: PKMN_BY_NAT_NUMBER[speciesNumber].name,
                        level: this.array[pkmnBase + 0x01],
                        nickname: this.getDelimitedString(pkmnBase + 0x02)
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
        const count = this.array[basePos];
        for (let i = 0; i < count; ++i ) {
            const index = basePos + (i *2) + 1;
            if (this.array[index] == 0xFF) {
                break;
            } else {
                result.push({
                    index: this.array[index],
                    name: GEN_I_ITEM_NAME_MAP[this.array[index]],
                    count: this.array[index + 1 ]
                });
            }
        }
        return result;
    }

/*---------------------------------------------------------------------------------
-----------------------------------------------------------------------------------
UTILS
-----------------------------------------------------------------------------------
---------------------------------------------------------------------------------*/

    getDelimitedString (startPos) {
        const endPos = this.findStringLength(startPos);
        return this.getString(startPos, endPos);
    }

    findStringLength (startPos)  {
        let offset = 0;
        while (offset + startPos < this.array.length) {
            if (this.codec.isTerminating(this.array[offset + startPos ])) {
                return offset + startPos;
            }
            ++offset;
        }
        return -1;
    }

    getString (startPos, endPos) {
        let result = '';
        for (let i = startPos; i < endPos; ++i) {
            const byte = this.array[i];
            result += (this.codec.decode(byte));
        }
        return result;
    }

    getNumber (startPos, length) {
        let result = 0;
        for (let i = 0; i < length; ++i) {
            const byte = this.array[ startPos + i];
            result += (byte  << ((length - i - 1) * 8));
        }
        return result;
    }

    getHiNib(byte) {
        return byte >> 4;
    }

    getLoNib(byte) {
        return byte & 0x0F;
    }

    getBinaryEncodedDecimal(startPos, length) {
        let result = 0;
        for (let i = 0; i < length; ++i) {
            const byte = this.array[ startPos + i];
            const hhhh = this.getHiNib(byte);
            const llll = this.getLoNib(byte);
            result += ((hhhh * 10) +llll) * (100**(length - i -1));
        }
        return result;
    }
}





