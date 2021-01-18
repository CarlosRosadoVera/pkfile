

const PKMN_TYPE = [
    {index: 0, name: 'Normal'},
    {index: 1, name: 'Fighting'},
    {index: 2, name: 'Flying'},
    {index: 3, name: 'Poison'},
    {index: 4, name: 'Ground'},
    {index: 5, name: 'Rock'},
    {index: 6, name: 'Bug'},
    {index: 7, name: 'Ghost'},
    {index: 8, name: 'Fire'},
    {index: 9, name: 'Water'},
    {index: 10, name: 'Grass'},
    {index: 11, name: 'Electric'},
    {index: 12, name: 'Psychic'},
    {index: 13, name: 'Ice'},
    {index: 14, name: 'Dragon'},
    {index: 15, name: 'Steel'},
    {index: 16, name: 'Dark'},
    {index: 17, name: 'Fairy'},
    {index: 18, name: '???'}
]

const PKTP_NORM = PKMN_TYPE[0];
const PKTP_FIGT = PKMN_TYPE[1];
const PKTP_FLY = PKMN_TYPE[2];
const PKTP_POSN = PKMN_TYPE[3];
const PKTP_GRND = PKMN_TYPE[4];
const PKTP_ROCK = PKMN_TYPE[5];
const PKTP_BUG = PKMN_TYPE[6];
const PKTP_GHST = PKMN_TYPE[7];
const PKTP_FIRE = PKMN_TYPE[8];
const PKTP_WATR = PKMN_TYPE[9];
const PKTP_GRAS = PKMN_TYPE[10];
const PKTP_ELEC = PKMN_TYPE[11];
const PKTP_PSYC = PKMN_TYPE[12];
const PKTP_ICE = PKMN_TYPE[13];
const PKTP_DRAG = PKMN_TYPE[14];
const PKTP_STEL = PKMN_TYPE[15];
const PKTP_DARK = PKMN_TYPE[16];
const PKTP_FAIR = PKMN_TYPE[17];
const PKTP_QQQQ = PKMN_TYPE[18];


const MAX_LEVEL = 100;

class ExpGroup{
    constructor (formula) {
        this.table = new Array(MAX_LEVEL);
        for (let i = 0; i < MAX_LEVEL; ++i) {
            this.table[i] = Math.floor(formula(i + 1));
        }
    }

    atLevel(level) {
        return this.table[level -1];
    }

    forLevel(level) {
        if (level == 1) return 0;
        return this.table[level -1] -this.table[level -2];
    }

    levelAt(exp) {
        if (exp >= this.table[100]) return 100;
        for (let i = 0; i <MAX_LEVEL; ++i) {
            if (exp < this.table[i]) {
                return i ;
            }
        }
    }

    forNextLevel(level, totalExp) {
        if (level >= 100) return 0;
        const levelExp = this.atLevel(level);
        return this.forLevel(level + 1) - (totalExp - levelExp);
    }
}


const EXPERIENCE_GROUPS = {
    fast:    new ExpGroup(n => (4 * (n ** 3)) / 5), // (4e^3)/5
    medFast: new ExpGroup(n => (n === 1)? 0 : n ** 3),
    medSlow: new ExpGroup(n => (n === 1 ?  0 : (6/5) *(n**3) - 15*(n**2) + 100*n - 140)),
    slow:    new ExpGroup(n => (n === 1 ? 0 : (5 * (n ** 3)) / 4)),
    tmp: new ExpGroup(n => n) // used as placeholder...
}

const EX = EXPERIENCE_GROUPS; // shorthand...

const PKMN_BY_NAT_NUMBER = [
    {number: 1, name:'Bulbasaur',   hp: 45, atk: 49, def: 49, satk: 65, sdef: 65, spd: 45, spc: 65,
        ex: EX.medSlow, typeI: PKTP_GRAS, typeII: PKTP_POSN},
    {number: 2, name:'Ivysaur',     hp: 60, atk: 62, def: 63, satk: 80, sdef: 80, spd: 60, spc: 80,
        ex: EX.medSlow, typeI: PKTP_GRAS, typeII: PKTP_POSN},
    {number: 3, name:'Venusaur',    hp: 80, atk: 82, def: 83, satk:100, sdef:100, spd: 80, spc:100,
        ex: EX.medSlow, typeI: PKTP_GRAS, typeII: PKTP_POSN},
    {number: 4, name:'Charmander',  hp: 39, atk: 52, def: 43, satk: 60, sdef: 50, spd: 65, spc: 50,
        ex: EX.medSlow, typeI: PKTP_FIRE},
    {number: 5, name:'Charmeleon',  hp: 58, atk: 64, def: 58, satk: 80, sdef: 65, spd: 80, spc: 65,
        ex: EX.medSlow, typeI: PKTP_FIRE},
    {number: 6, name:'Charizard',   hp: 78, atk: 84, def: 78, satk:109, sdef: 85, spd:100, spc: 85,
        ex: EX.medSlow, typeI: PKTP_FIRE, typeII: PKTP_FLY},
    {number: 7, name:'Squirtle',    hp: 44, atk: 48, def: 65, satk: 50, sdef: 64, spd: 43, spc: 50,
        ex: EX.medSlow, typeI: PKTP_WATR},
    {number: 8, name:'Wartortle',   hp: 59, atk: 63, def: 80, satk: 65, sdef: 80, spd: 58, spc: 65,
        ex: EX.medSlow, typeI: PKTP_WATR},
    {number: 9, name:'Blastoise',   hp: 79, atk: 83, def:100, satk: 85, sdef:105, spd: 78, spc: 85,
        ex: EX.medSlow, typeI: PKTP_WATR},
    {number: 10, name:'Caterpie',   hp: 45, atk: 30, def: 35, satk: 20, sdef: 20, spd: 45, spc: 20,
        ex: EX.medFast, typeI: PKTP_BUG},
    {number: 11, name:'Metapod',    hp: 50, atk: 20, def: 55, satk: 25, sdef: 25, spd: 30, spc: 25,
        ex: EX.medFast, typeI: PKTP_BUG},
    {number: 12, name:'Butterfree', hp: 60, atk: 45, def: 50, satk: 90, sdef: 80, spd: 70, spc: 80,
        ex: EX.medFast, typeI: PKTP_BUG, typeII: PKTP_FLY},
    {number: 13, name:'Weedle',     hp: 40, atk: 35, def: 30, satk: 20, sdef: 20, spd: 50, spc: 20,
        ex: EX.medFast, typeI: PKTP_BUG, typeII: PKTP_POSN},
    {number: 14, name:'Kakuna',     hp: 45, atk: 25, def: 50, satk: 25, sdef: 25, spd: 35, spc: 25,
        ex: EX.medFast, typeI: PKTP_BUG, typeII: PKTP_POSN},
    {number: 15, name:'Beedrill',   hp: 65, atk: 80, def: 40, satk: 45, sdef: 80, spd: 75, spc: 45,
        ex: EX.medFast, typeI: PKTP_BUG, typeII: PKTP_POSN},
    {number: 16, name:'Pidgey',     hp: 40, atk: 45, def: 40, satk: 35, sdef: 35, spd: 56, spc: 35,
        ex: EX.medSlow, typeI: PKTP_NORM, typeII: PKTP_FLY},
    {number: 17, name:'Pidgeotto',  hp: 63, atk: 60, def: 55, satk: 50, sdef: 50, spd: 71, spc: 50,
        ex: EX.medSlow, typeI: PKTP_NORM, typeII: PKTP_FLY},
    {number: 18, name:'Pidgeot',    hp: 83, atk: 80, def: 75, satk: 70, sdef: 70, spd: 91, spc: 70,
        ex: EX.medSlow, typeI: PKTP_NORM, typeII: PKTP_FLY},
    {number: 19, name:'Rattata',    hp: 30, atk: 56, def: 35, satk: 25, sdef: 35, spd: 72, spc: 25,
        ex: EX.medFast, typeI: PKTP_NORM},
    {number: 20, name:'Raticate',   hp: 55, atk: 81, def: 60, satk: 50, sdef: 70, spd: 97, spc: 50,
        ex: EX.medFast, typeI: PKTP_NORM},
    {number: 21, name:'Spearow',    hp: 40, atk: 60, def: 30, satk: 31, sdef: 31, spd: 70, spc: 31,
        ex: EX.medFast, typeI: PKTP_NORM, typeII: PKTP_FLY},
    {number: 22, name:'Fearow',     hp: 65, atk: 90, def: 65, satk: 61, sdef: 61, spd:100, spc: 61,
        ex: EX.medFast, typeI: PKTP_NORM, typeII: PKTP_FLY},
    {number: 23, name:'Ekans',      hp: 35, atk: 60, def: 44, satk: 40, sdef: 54, spd: 55, spc: 40,
        ex: EX.medFast, typeI: PKTP_POSN},
    {number: 24, name:'Arbok',      hp: 60, atk: 85, def: 69, satk: 65, sdef: 79, spd: 80, spc: 65,
        ex: EX.medFast, typeI: PKTP_POSN},
    {number: 25, name:'Pikachu',    hp: 35, atk: 55, def: 30, satk: 50, sdef: 50, spd: 90, spc: 50,
        ex: EX.medFast, typeI: PKTP_ELEC},
    {number: 26, name:'Raichu',     hp: 60, atk: 90, def: 55, satk: 90, sdef: 80, spd:100, spc: 90,
        ex: EX.medFast, typeI: PKTP_ELEC},
    {number: 27, name:'Sandshrew',  hp: 50, atk: 75, def: 85, satk: 20, sdef: 30, spd: 40, spc: 30,
        ex: EX.medFast, typeI: PKTP_GRND},
    {number: 28, name:'Sandslash',  hp: 75, atk:100, def:110, satk: 45, sdef: 35, spd: 65, spc: 55,
        ex: EX.medFast, typeI: PKTP_GRND},
    {number: 29, name:'Nidoran♀',   hp: 55, atk: 47, def: 52, satk: 40, sdef: 40, spd: 41, spc: 40,
        ex: EX.medSlow, typeI: PKTP_POSN},
    {number: 30, name:'Nidorina',   hp: 70, atk: 62, def: 67, satk: 55, sdef: 55, spd: 56, spc: 55,
        ex: EX.medSlow, typeI: PKTP_POSN},
    {number: 31, name:'Nidoqueen',  hp: 90, atk: 82, def: 87, satk: 75, sdef: 85, spd: 76, spc: 75,
        ex: EX.medSlow, typeI: PKTP_POSN, typeII: PKTP_GRND},
    {number: 32, name:'Nidoran♂',   hp: 46, atk: 57, def: 40, satk: 40, sdef: 40, spd: 50, spc: 40,
        ex: EX.medSlow, typeI: PKTP_POSN},
    {number: 33, name:'Nidorino',   hp: 61, atk: 72, def: 57, satk: 55, sdef: 55, spd: 65, spc: 55,
        ex: EX.medSlow, typeI: PKTP_POSN},
    {number: 34, name:'Nidoking',   hp: 81, atk: 92, def: 77, satk: 85, sdef: 75, spd: 85, spc: 75,
        ex: EX.medSlow, typeI: PKTP_POSN, typeII: PKTP_GRND},
    {number: 35, name:'Clefairy',   hp: 70, atk: 45, def: 48, satk: 60, sdef: 65, spd: 35, spc: 60,
        ex: EX.fast,    typeI: PKTP_FAIR},
    {number: 36, name:'Clefable',   hp: 95, atk: 70, def: 73, satk: 95, sdef: 90, spd: 60, spc: 85,
        ex: EX.fast,    typeI: PKTP_FAIR},
    {number: 37, name:'Vulpix',     hp: 38, atk: 41, def: 40, satk: 50, sdef: 65, spd: 65, spc: 65,
        ex: EX.medFast, typeI: PKTP_FIRE},
    {number: 38, name:'Ninetales',  hp: 73, atk: 76, def: 75, satk: 81, sdef:100, spd:100, spc:100,
        ex: EX.medFast, typeI: PKTP_FIRE},
    {number: 39, name:'Jigglypuff', hp:115, atk: 45, def: 20, satk: 45, sdef: 25, spd: 20, spc: 25,
        ex: EX.fast,    typeI: PKTP_NORM, typeII: PKTP_FAIR},
    {number: 40, name:'Wigglytuff', hp:140, atk: 70, def: 45, satk: 85, sdef: 50, spd: 45, spc: 50,
        ex: EX.fast,    typeI: PKTP_NORM, typeII: PKTP_FAIR},
    {number: 41, name:'Zubat',      hp: 40, atk: 45, def: 35, satk: 30, sdef: 40, spd: 55, spc: 40,
        ex: EX.medFast, typeI: PKTP_POSN, typeII: PKTP_FLY},
    {number: 42, name:'Golbat',     hp: 75, atk: 80, def: 70, satk: 65, sdef: 75, spd: 90, spc: 75,
        ex: EX.medFast, typeI: PKTP_POSN, typeII: PKTP_FLY},
    {number: 43, name:'Oddish',     hp: 45, atk: 50, def: 55, satk: 75, sdef: 65, spd: 30, spc: 75,
        ex: EX.medSlow, typeI: PKTP_GRAS, typeII: PKTP_POSN},
    {number: 44, name:'Gloom',      hp: 60, atk: 65, def: 70, satk: 85, sdef: 75, spd: 40, spc: 85,
        ex: EX.medSlow, typeI: PKTP_GRAS, typeII: PKTP_POSN},
    {number: 45, name:'Vileplume',  hp: 75, atk: 80, def: 85, satk:110, sdef: 90, spd: 50, spc:100,
        ex: EX.medSlow, typeI: PKTP_GRAS, typeII: PKTP_POSN},
    {number: 46, name:'Paras',      hp: 35, atk: 70, def: 55, satk: 45, sdef: 55, spd: 25, spc: 55,
        ex: EX.medFast, typeI: PKTP_BUG, typeII: PKTP_GRAS},
    {number: 47, name:'Parasect',   hp: 60, atk: 95, def: 80, satk: 60, sdef: 80, spd: 30, spc: 80,
        ex: EX.medFast, typeI: PKTP_BUG, typeII: PKTP_GRAS},
    {number: 48, name:'Venonat',    hp: 60, atk: 55, def: 50, satk: 40, sdef: 55, spd: 45, spc: 40,
        ex: EX.medFast, typeI: PKTP_BUG, typeII: PKTP_POSN},
    {number: 49, name:'Venomoth',   hp: 70, atk: 65, def: 60, satk: 90, sdef: 75, spd: 90, spc: 90,
        ex: EX.medFast, typeI: PKTP_BUG, typeII: PKTP_POSN},
    {number: 50, name:'Diglett',    hp: 10, atk: 55, def: 25, satk: 35, sdef: 45, spd: 95, spc: 45,
        ex: EX.medFast, typeI: PKTP_GRND},
    {number: 51, name:'Dugtrio',    hp: 35, atk: 80, def: 50, satk: 50, sdef: 70, spd:120, spc: 70,
        ex: EX.medFast, typeI: PKTP_GRND},
    {number: 52, name:'Meowth',     hp: 40, atk: 45, def: 35, satk: 40, sdef: 40, spd: 90, spc: 40,
        ex: EX.medFast, typeI: PKTP_NORM},
    {number: 53, name:'Persian',    hp: 65, atk: 70, def: 60, satk: 65, sdef: 65, spd:115, spc: 65,
        ex: EX.medFast, typeI: PKTP_NORM},
    {number: 54, name:'Psyduck',    hp: 50, atk: 52, def: 48, satk: 65, sdef: 50, spd: 55, spc: 50,
        ex: EX.medFast, typeI: PKTP_WATR},
    {number: 55, name:'Golduck',    hp: 80, atk: 82, def: 78, satk: 95, sdef: 80, spd: 85, spc: 80,
        ex: EX.medFast, typeI: PKTP_WATR},
    {number: 56, name:'Mankey',     hp: 40, atk: 80, def: 35, satk: 35, sdef: 45, spd: 70, spc: 35,
        ex: EX.medFast, typeI: PKTP_FIGT},
    {number: 57, name:'Primeape',   hp: 65, atk:105, def: 60, satk: 60, sdef: 70, spd: 95, spc: 60,
        ex: EX.medFast, typeI: PKTP_FIGT},
    {number: 58, name:'Growlithe',  hp: 55, atk: 70, def: 45, satk: 70, sdef: 50, spd: 60, spc: 50,
        ex: EX.slow,    typeI: PKTP_FIRE},
    {number: 59, name:'Arcanine',   hp: 90, atk:110, def: 80, satk:100, sdef: 80, spd: 95, spc: 80,
        ex: EX.slow,    typeI: PKTP_FIRE},
    {number: 60, name:'Poliwag',    hp: 40, atk: 50, def: 40, satk: 40, sdef: 40, spd: 90, spc: 40,
        ex: EX.medSlow, typeI: PKTP_WATR},
    {number: 61, name:'Poliwhirl',  hp: 65, atk: 65, def: 65, satk: 50, sdef: 50, spd: 90, spc: 50,
        ex: EX.medSlow, typeI: PKTP_WATR},
    {number: 62, name:'Poliwrath',  hp: 90, atk: 85, def: 95, satk: 70, sdef: 90, spd: 70, spc: 70,
        ex: EX.medSlow, typeI: PKTP_WATR, typeII: PKTP_FIGT},
    {number: 63, name:'Abra',       hp: 25, atk: 20, def: 15, satk:105, sdef: 55, spd: 90, spc:105,
        ex: EX.medSlow, typeI: PKTP_PSYC},
    {number: 64, name:'Kadabra',    hp: 40, atk: 35, def: 30, satk:120, sdef: 70, spd:105, spc:120,
        ex: EX.medSlow, typeI: PKTP_PSYC},
    {number: 65, name:'Alakazam',   hp: 55, atk: 50, def: 45, satk:135, sdef: 95, spd:120, spc:135,
        ex: EX.medSlow, typeI: PKTP_PSYC},
    {number: 66, name:'Machop',     hp: 70, atk: 80, def: 50, satk: 35, sdef: 35, spd: 35, spc: 35,
        ex: EX.medSlow, typeI: PKTP_FIGT},
    {number: 67, name:'Machoke',    hp: 80, atk:100, def: 70, satk: 50, sdef: 60, spd: 45, spc: 50,
        ex: EX.medSlow, typeI: PKTP_FIGT},
    {number: 68, name:'Machamp',    hp: 90, atk:130, def: 80, satk: 65, sdef: 85, spd: 55, spc: 65,
        ex: EX.medSlow, typeI: PKTP_FIGT},
    {number: 69, name:'Bellsprout', hp: 50, atk: 75, def: 35, satk: 70, sdef: 30, spd: 40, spc: 70,
        ex: EX.medSlow, typeI: PKTP_GRAS, typeII: PKTP_POSN},
    {number: 70, name:'Weepinbell', hp: 65, atk: 90, def: 50, satk: 85, sdef: 45, spd: 55, spc: 85,
        ex: EX.medSlow, typeI: PKTP_GRAS, typeII: PKTP_POSN},
    {number: 71, name:'Victreebel', hp: 80, atk:105, def: 65, satk:100, sdef: 70, spd: 70, spc:100,
        ex: EX.medSlow, typeI: PKTP_GRAS, typeII: PKTP_POSN},
    {number: 72, name:'Tentacool',  hp: 40, atk: 40, def: 35, satk: 50, sdef:100, spd: 70, spc:100,
        ex: EX.slow,    typeI: PKTP_WATR, typeII: PKTP_POSN},
    {number: 73, name:'Tentacruel', hp: 80, atk: 70, def: 65, satk: 80, sdef:120, spd:100, spc:120,
        ex: EX.slow,    typeI: PKTP_WATR, typeII: PKTP_POSN},
    {number: 74, name:'Geodude',    hp: 40, atk: 80, def:100, satk: 30, sdef: 30, spd: 20, spc: 30,
        ex: EX.medSlow, typeI: PKTP_ROCK, typeII: PKTP_GRND},
    {number: 75, name:'Graveler',   hp: 55, atk: 95, def:115, satk: 45, sdef: 45, spd: 35, spc: 45,
        ex: EX.medSlow, typeI: PKTP_ROCK, typeII: PKTP_GRND},
    {number: 76, name:'Golem',      hp: 80, atk:110, def:130, satk: 55, sdef: 65, spd: 45, spc: 55,
        ex: EX.medSlow, typeI: PKTP_ROCK, typeII: PKTP_GRND},
    {number: 77, name:'Ponyta',     hp: 50, atk: 85, def: 55, satk: 65, sdef: 65, spd: 90, spc: 65,
        ex: EX.medFast, typeI: PKTP_FIRE},
    {number: 78, name:'Rapidash',   hp: 65, atk:100, def: 70, satk: 80, sdef: 80, spd:105, spc: 80,
        ex: EX.medFast, typeI: PKTP_FIRE},
    {number: 79, name:'Slowpoke',   hp: 90, atk: 65, def: 65, satk: 40, sdef: 40, spd: 15, spc: 40,
        ex: EX.medFast, typeI: PKTP_WATR, typeII: PKTP_PSYC},
    {number: 80, name:'Slowbro',    hp: 95, atk: 75, def:110, satk:100, sdef: 80, spd: 30, spc: 80,
        ex: EX.medFast, typeI: PKTP_WATR, typeII: PKTP_PSYC},
    {number: 81, name:'Magnemite',  hp: 25, atk: 35, def: 70, satk: 95, sdef: 55, spd: 45, spc: 95,
        ex: EX.medFast, typeI: PKTP_ELEC, typeII: PKTP_STEL},
    {number: 82, name:'Magneton',   hp: 50, atk: 60, def: 95, satk:120, sdef: 70, spd: 70, spc:120,
        ex: EX.medFast, typeI: PKTP_ELEC, typeII: PKTP_STEL},
    {number: 83, name:'Farfetch\'d',hp: 52, atk: 65, def: 55, satk: 58, sdef: 62, spd: 60, spc: 58,
        ex: EX.medFast, typeI: PKTP_NORM, typeII: PKTP_FLY},
    {number: 84, name:'Doduo',      hp: 35, atk: 85, def: 45, satk: 35, sdef: 35, spd: 75, spc: 35,
        ex: EX.medFast, typeI: PKTP_NORM, typeII: PKTP_FLY},
    {number: 85, name:'Dodrio',     hp: 60, atk:110, def: 70, satk: 60, sdef: 60, spd:100, spc: 60,
        ex: EX.medFast, typeI: PKTP_NORM, typeII: PKTP_FLY},
    {number: 86, name:'Seel',       hp: 65, atk: 45, def: 55, satk: 45, sdef: 70, spd: 45, spc: 70,
        ex: EX.medFast, typeI: PKTP_WATR},
    {number: 87, name:'Dewgong',    hp: 90, atk: 70, def: 80, satk: 70, sdef: 95, spd: 70, spc: 95,
        ex: EX.medFast, typeI: PKTP_WATR, typeII: PKTP_ICE},
    {number: 88, name:'Grimer',     hp: 80, atk: 80, def: 50, satk: 40, sdef: 50, spd: 25, spc: 40,
        ex: EX.medFast, typeI: PKTP_POSN},
    {number: 89, name:'Muk',        hp:105, atk:105, def: 75, satk: 65, sdef:100, spd: 50, spc: 65,
        ex: EX.medFast, typeI: PKTP_POSN},
    {number: 90, name:'Shellder',   hp: 30, atk: 65, def:100, satk: 45, sdef: 25, spd: 40, spc: 45,
        ex: EX.slow,    typeI: PKTP_WATR},
    {number: 91, name:'Cloyster',   hp: 50, atk: 95, def:180, satk: 85, sdef: 45, spd: 70, spc: 85,
        ex: EX.slow,    typeI: PKTP_WATR, typeII: PKTP_ICE},
    {number: 92, name:'Gastly',     hp: 30, atk: 35, def: 30, satk:100, sdef: 35, spd: 80, spc:100,
        ex: EX.medSlow, typeI: PKTP_GHST, typeII: PKTP_POSN},
    {number: 93, name:'Haunter',    hp: 45, atk: 50, def: 45, satk:115, sdef: 55, spd: 95, spc:115,
        ex: EX.medSlow, typeI: PKTP_GHST, typeII: PKTP_POSN},
    {number: 94, name:'Gengar',     hp: 60, atk: 65, def: 60, satk:130, sdef: 75, spd:110, spc:130,
        ex: EX.medSlow, typeI: PKTP_GHST, typeII: PKTP_POSN},
    {number: 95, name:'Onix',       hp: 35, atk: 45, def:160, satk: 30, sdef: 45, spd: 70, spc: 30,
        ex: EX.medFast, typeI: PKTP_ROCK, typeII: PKTP_GRND},
    {number: 96, name:'Drowzee',    hp: 60, atk: 48, def: 45, satk: 43, sdef: 90, spd: 42, spc: 90,
        ex: EX.medFast, typeI: PKTP_PSYC},
    {number: 97, name:'Hypno',      hp: 85, atk: 73, def: 70, satk: 73, sdef:115, spd: 67, spc:115,
        ex: EX.medFast, typeI: PKTP_PSYC},
    {number: 98, name:'Krabby',     hp: 30, atk:105, def: 90, satk: 25, sdef: 25, spd: 50, spc: 25,
        ex: EX.medFast, typeI: PKTP_WATR},
    {number: 99, name:'Kingler',    hp: 55, atk:130, def:115, satk: 50, sdef: 50, spd: 75, spc: 50,
        ex: EX.medFast, typeI: PKTP_WATR},
    {number: 100, name:'Voltorb',   hp: 40, atk: 30, def: 50, satk: 55, sdef: 55, spd:100, spc: 55,
        ex: EX.medFast, typeI: PKTP_ELEC},
    {number: 101, name:'Electrode', hp: 60, atk: 50, def: 70, satk: 80, sdef: 80, spd:140, spc: 80,
        ex: EX.medFast, typeI: PKTP_ELEC},
    {number: 102, name:'Exeggcute', hp: 60, atk: 40, def: 80, satk: 60, sdef: 45, spd: 40, spc: 60,
        ex: EX.slow,    typeI: PKTP_GRAS, typeII: PKTP_PSYC},
    {number: 103, name:'Exeggutor', hp: 95, atk: 95, def: 85, satk:125, sdef: 65, spd: 55, spc:125,
        ex: EX.slow,    typeI: PKTP_GRAS, typeII: PKTP_PSYC},
    {number: 104, name:'Cubone',    hp: 50, atk: 50, def: 95, satk: 40, sdef:  50, spd: 35, spc: 40,
        ex: EX.medFast, typeI: PKTP_GRND},
    {number: 105, name:'Marowak',   hp: 60, atk: 80, def:110, satk: 50, sdef: 80, spd: 45, spc: 50,
        ex: EX.medFast, typeI: PKTP_GRND},
    {number: 106, name:'Hitmonlee', hp: 50, atk:120, def: 53, satk: 35, sdef:110, spd: 87, spc: 35,
        ex: EX.medFast, typeI: PKTP_FIGT},
    {number: 107, name:'Hitmonchan',hp: 50, atk:105, def: 79, satk: 35, sdef:110, spd: 76, spc: 35,
        ex: EX.medFast, typeI: PKTP_FIGT},
    {number: 108, name:'Lickitung', hp: 90, atk: 55, def: 75, satk: 60, sdef: 75, spd: 30, spc: 60,
        ex: EX.medFast, typeI: PKTP_NORM},
    {number: 109, name:'Koffing',   hp: 40, atk: 65, def: 95, satk: 60, sdef: 45, spd: 35, spc: 60,
        ex: EX.medFast, typeI: PKTP_POSN},
    {number: 110, name:'Weezing',   hp: 65, atk: 90, def:120, satk: 85, sdef: 70, spd: 60, spc: 85,
        ex: EX.medFast, typeI: PKTP_POSN},
    {number: 111, name:'Rhyhorn',   hp: 80, atk: 85, def: 95, satk: 30, sdef: 30, spd: 25, spc: 30,
        ex: EX.slow,    typeI: PKTP_GRND, typeII: PKTP_ROCK},
    {number: 112, name:'Rhydon',    hp:105, atk:130, def:120, satk: 45, sdef: 45, spd: 40, spc: 45,
        ex: EX.slow,    typeI: PKTP_GRND, typeII: PKTP_ROCK},
    {number: 113, name:'Chansey',   hp:250, atk:  5, def:  5, satk: 35, sdef:105, spd: 50, spc:105,
        ex: EX.fast,    typeI: PKTP_NORM},
    {number: 114, name:'Tangela',   hp: 65, atk: 55, def:115, satk:100, sdef: 40, spd: 60, spc:100,
        ex: EX.medFast, typeI: PKTP_GRAS},
    {number: 115, name:'Kangaskhan',hp:105, atk: 95, def: 80, satk: 40, sdef: 80, spd: 90, spc: 40,
        ex: EX.medFast, typeI: PKTP_NORM},
    {number: 116, name:'Horsea',    hp: 30, atk: 40, def: 70, satk: 70, sdef: 25, spd: 60, spc: 70,
        ex: EX.medFast, typeI: PKTP_WATR},
    {number: 117, name:'Seadra',    hp: 55, atk: 65, def: 95, satk: 95, sdef: 45, spd: 85, spc: 95,
        ex: EX.medFast, typeI: PKTP_WATR},
    {number: 118, name:'Goldeen',   hp: 45, atk: 67, def: 60, satk: 35, sdef: 50, spd: 63, spc: 50,
        ex: EX.medFast, typeI: PKTP_WATR},
    {number: 119, name:'Seaking',   hp: 80, atk: 92, def: 65, satk: 65, sdef: 80, spd: 68, spc: 80,
        ex: EX.medFast, typeI: PKTP_WATR},
    {number: 120, name:'Staryu',    hp: 30, atk: 45, def: 55, satk: 70, sdef: 55, spd: 85, spc: 70,
        ex: EX.slow,    typeI: PKTP_WATR},
    {number: 121, name:'Starmie',   hp: 60, atk: 75, def: 85, satk:100, sdef: 85, spd:115, spc:100,
        ex: EX.slow,    typeI: PKTP_WATR, typeII: PKTP_PSYC},
    {number: 122, name:'Mr. Mime',  hp: 40, atk: 45, def: 65, satk:100, sdef:120, spd: 90, spc:100,
        ex: EX.medFast, typeI: PKTP_PSYC, typeII: PKTP_FAIR},
    {number: 123, name:'Scyther',   hp: 70, atk:110, def: 80, satk: 55, sdef: 80, spd:105, spc: 55,
        ex: EX.medFast, typeI: PKTP_BUG, typeII: PKTP_FLY},
    {number: 124, name:'Jynx',      hp: 65, atk: 50, def: 35, satk:115, sdef: 95, spd: 95, spc: 95,
        ex: EX.medFast, typeI: PKTP_ICE, typeII: PKTP_PSYC},
    {number: 125, name:'Electabuzz',hp: 65, atk: 83, def: 57, satk: 95, sdef: 85, spd:105, spc: 85,
        ex: EX.medFast, typeI: PKTP_ELEC},
    {number: 126, name:'Magmar',    hp: 65, atk: 95, def: 57, satk:100, sdef: 85, spd: 93, spc: 85,
        ex: EX.medFast, typeI: PKTP_FIRE},
    {number: 127, name:'Pinsir',    hp: 65, atk:125, def:100, satk: 55, sdef: 70, spd: 85, spc: 55,
        ex: EX.slow,    typeI: PKTP_BUG},
    {number: 128, name:'Tauros',    hp: 75, atk:100, def: 95, satk: 40, sdef: 70, spd:110, spc: 70,
        ex: EX.slow,    typeI: PKTP_NORM},
    {number: 129, name:'Magikarp',  hp: 20, atk: 10, def: 55, satk: 15, sdef: 20, spd: 80, spc: 20,
        ex: EX.slow,    typeI: PKTP_WATR},
    {number: 130, name:'Gyarados',  hp: 95, atk:125, def: 79, satk: 60, sdef:100, spd: 81, spc:100,
        ex: EX.slow,    typeI: PKTP_WATR, typeII: PKTP_FLY},
    {number: 131, name:'Lapras',    hp:130, atk: 85, def: 80, satk: 85, sdef: 95, spd: 60, spc: 95,
        ex: EX.slow,    typeI: PKTP_WATR, typeII: PKTP_ICE},
    {number: 132, name:'Ditto',     hp: 48, atk: 48, def: 48, satk: 48, sdef: 48, spd: 48, spc: 48,
        ex: EX.medFast, typeI: PKTP_NORM},
    {number: 133, name:'Eevee',     hp: 55, atk: 55, def: 50, satk: 45, sdef: 65, spd: 55, spc: 65,
        ex: EX.medFast, typeI: PKTP_NORM},
    {number: 134, name:'Vaporeon',  hp:130, atk: 65, def: 60, satk:110, sdef: 95, spd: 65, spc:110,
        ex: EX.medFast, typeI: PKTP_WATR},
    {number: 135, name:'Jolteon',   hp: 65, atk: 65, def: 60, satk:110, sdef: 95, spd:130, spc:110,
        ex: EX.medFast, typeI: PKTP_ELEC},
    {number: 136, name:'Flareon',   hp: 65, atk:130, def: 60, satk: 95, sdef:110, spd: 65, spc:110,
        ex: EX.medFast, typeI: PKTP_FIRE},
    {number: 137, name:'Porygon',   hp: 65, atk: 60, def: 70, satk: 85, sdef: 75, spd: 40, spc: 75,
        ex: EX.medFast, typeI: PKTP_NORM},
    {number: 138, name:'Omanyte',   hp: 35, atk: 40, def:100, satk: 90, sdef: 55, spd: 35, spc: 90,
        ex: EX.medFast, typeI: PKTP_ROCK, typeII: PKTP_WATR},
    {number: 139, name:'Omastar',   hp: 70, atk: 60, def:125, satk:115, sdef: 70, spd: 55, spc:115,
        ex: EX.medFast, typeI: PKTP_ROCK, typeII: PKTP_WATR},
    {number: 140, name:'Kabuto',    hp: 30, atk: 80, def: 90, satk: 55, sdef: 45, spd: 55, spc: 45,
        ex: EX.medFast, typeI: PKTP_ROCK, typeII: PKTP_WATR},
    {number: 141, name:'Kabutops',  hp: 60, atk:115, def:105, satk: 65, sdef: 70, spd: 80, spc: 70,
        ex: EX.medFast, typeI: PKTP_ROCK, typeII: PKTP_WATR},
    {number: 142, name:'Aerodactyl',hp: 80, atk:105, def: 65, satk: 60, sdef: 75, spd:130, spc: 60,
        ex: EX.slow,   typeI: PKTP_ROCK, typeII: PKTP_FLY},
    {number: 143, name:'Snorlax',   hp:160, atk:110, def: 65, satk: 65, sdef:110, spd: 30, spc: 65,
        ex: EX.slow,   typeI: PKTP_NORM},
    {number: 144, name:'Articuno',  hp: 90, atk: 85, def:100, satk: 95, sdef:125, spd: 85, spc:125,
        ex: EX.slow,   typeI: PKTP_ICE, typeII: PKTP_FLY},
    {number: 145, name:'Zapdos',    hp: 90, atk: 90, def: 85, satk:125, sdef: 90, spd:100, spc:125,
        ex: EX.slow,   typeI: PKTP_ELEC, typeII: PKTP_FLY},
    {number: 146, name:'Moltres',   hp: 90, atk:100, def: 90, satk:125, sdef: 85, spd: 90, spc:125,
        ex: EX.slow,   typeI: PKTP_FIRE, typeII: PKTP_FLY},
    {number: 147, name:'Dratini',   hp: 41, atk: 64, def: 45, satk: 50, sdef: 50, spd: 50, spc: 50,
        ex: EX.slow,   typeI: PKTP_DRAG},
    {number: 148, name:'Dragonair', hp: 61, atk: 84, def: 65, satk: 70, sdef: 70, spd: 70, spc: 70,
        ex: EX.slow,   typeI: PKTP_DRAG},
    {number: 149, name:'Dragonite', hp: 91, atk:134, def: 95, satk:100, sdef:100, spd: 80, spc:100,
        ex: EX.slow,   typeI: PKTP_DRAG, typeII: PKTP_FLY},
    {number: 150, name:'Mewtwo',    hp:106, atk:110, def: 90, satk:154, sdef: 90, spd:130, spc:154,
        ex: EX.slow,   typeI: PKTP_PSYC},
    {number: 151, name:'Mew',       hp:100, atk:100, def:100, satk:100, sdef:100, spd:100, spc:100,
        ex: EX.tmp,    typeI: PKTP_PSYC}, // wrong exp
    {number: 152, name:'Chikorita', hp: 45, atk: 49, def: 65, satk: 49, sdef: 65, spd: 45,
        ex: EX.tmp, typeI: PKTP_GRAS},
    {number: 153, name:'Bayleef',   hp: 60, atk: 62, def: 80, satk: 63, sdef: 80, spd: 60,
        ex: EX.tmp, typeI: PKTP_GRAS},
    {number: 154, name:'Meganium',  hp: 80, atk: 82, def:100, satk: 83, sdef:100, spd: 80,
        ex: EX.tmp, typeI: PKTP_GRAS},
    {number: 155, name:'Cyndaquill',hp: 39, atk: 52, def: 43, satk: 60, sdef: 50, spd: 65,
        ex: EX.tmp, typeI: PKTP_FIRE},
    {number: 156, name:'Quilava',   hp: 58, atk: 64, def: 58, satk: 80, sdef: 65, spd: 80,
        ex: EX.tmp, typeI: PKTP_FIRE},
    {number: 157, name:'Typhlosion',hp: 78, atk: 84, def: 78, satk:100, sdef: 85, spd:100,
        ex: EX.tmp, typeI: PKTP_FIRE},
    {number: 158, name:'Totodile',  hp: 50, atk: 65, def: 64, satk: 44, sdef: 48, spd: 43,
        ex: EX.tmp, typeI: PKTP_WATR},
    {number: 159, name:'Croconaw',  hp: 65, atk: 80, def: 80, satk: 59, sdef: 63, spd: 58,
        ex: EX.tmp, typeI: PKTP_WATR},
    {number: 160, name:'Feraligatr',hp: 85, atk:105, def:100, satk: 79, sdef: 83, spd: 78,
        ex: EX.tmp, typeI: PKTP_WATR},
    {number: 161, name:'Sentret',   hp: 35, atk: 46, def: 34, satk: 35, sdef: 45, spd: 20,
        ex: EX.tmp, typeI: PKTP_NORM},
    {number: 162, name:'Furret',    hp: 85, atk: 76, def: 64, satk: 45, sdef: 55, spd: 90,
        ex: EX.tmp, typeI: PKTP_NORM},
    {number: 163, name:'Hoothoot',  hp: 60, atk: 30, def: 30, satk: 36, sdef: 56, spd: 50,
        ex: EX.tmp, typeI: PKTP_NORM, typeII: PKTP_FLY},
    {number: 164, name:'Noctowl',   hp:100, atk: 50, def: 50, satk: 76, sdef: 96, spd: 70,
        ex: EX.tmp, typeI: PKTP_NORM, typeII: PKTP_FLY},
    {number: 165, name:'Ledyba',    hp: 40, atk: 20, def: 30, satk: 40, sdef: 80, spd: 55,
        ex: EX.tmp, typeI: PKTP_BUG, typeII: PKTP_FLY},
    {number: 166, name:'Ledian',    hp: 55, atk: 35, def: 50, satk: 55, sdef:110, spd: 85,
        ex: EX.tmp, typeI: PKTP_BUG, typeII: PKTP_FLY},
    {number: 167, name:'Spinarak',  hp: 40, atk: 60, def: 40, satk: 40, sdef: 40, spd: 30,
        ex: EX.tmp, typeI: PKTP_BUG, typeII: PKTP_POSN},
    {number: 168, name:'Ariados',   hp: 70, atk: 90, def: 70, satk: 60, sdef: 60, spd: 40,
        ex: EX.tmp, typeI: PKTP_BUG, typeII: PKTP_POSN},
    {number: 169, name:'Crobat',    hp: 85, atk: 90, def: 80, satk: 70, sdef: 80, spd:130,
        ex: EX.tmp, typeI: PKTP_POSN, typeII: PKTP_FLY},
    {number: 170, name:'Chinchou',  hp: 75, atk: 38, def: 38, satk: 56, sdef: 56, spd: 67,
        ex: EX.tmp, typeI: PKTP_WATR, typeII: PKTP_ELEC},
    {number: 171, name:'Lanturn',   hp:125, atk: 58, def: 58, satk: 76, sdef: 76, spd: 67,
        ex: EX.tmp, typeI: PKTP_WATR, typeII: PKTP_ELEC},
    {number: 172, name:'Pichu',     hp: 20, atk: 40, def: 15, satk: 35, sdef: 35, spd: 60,
        ex: EX.tmp, typeI: PKTP_ELEC},
    {number: 173, name:'Cleffa',    hp: 50, atk: 25, def: 28, satk: 45, sdef: 55, spd: 15,
        ex: EX.tmp, typeI: PKTP_FAIR},
    {number: 174, name:'Igglybuff', hp: 90, atk: 30, def: 15, satk: 40, sdef: 20, spd: 15,
        ex: EX.tmp, typeI: PKTP_NORM, typeII: PKTP_FAIR},
    {number: 175, name:'Togepi',    hp: 35, atk: 20, def: 65, satk: 40, sdef: 65, spd: 20,
        ex: EX.tmp, typeI: PKTP_FAIR},
    {number: 176, name:'Togetic',   hp: 55, atk: 40, def: 85, satk: 80, sdef:105, spd: 40,
        ex: EX.tmp, typeI: PKTP_FAIR, typeII: PKTP_FLY},
    {number: 177, name:'Natu',      hp: 40, atk: 50, def: 45, satk: 70, sdef: 45, spd: 70,
        ex: EX.tmp, typeI: PKTP_PSYC, typeII: PKTP_FLY},
    {number: 178, name:'Xatu',      hp: 65, atk: 75, def: 70, satk: 95, sdef: 70, spd: 95,
        ex: EX.tmp, typeI: PKTP_PSYC, typeII: PKTP_FLY},
    {number: 179, name:'Mareep',    hp: 55, atk: 40, def: 40, satk: 65, sdef: 45, spd: 35,
        ex: EX.tmp, typeI: PKTP_ELEC},
    {number: 180, name:'Flaaffy',   hp: 70, atk: 55, def: 55, satk: 80, sdef: 60, spd: 45,
        ex: EX.tmp, typeI: PKTP_ELEC},
    {number: 181, name:'Ampharos',  hp: 90, atk: 75, def: 75, satk:115, sdef: 90, spd: 55,
        ex: EX.tmp, typeI: PKTP_ELEC},
    {number: 182, name:'Bellosom',  hp: 75, atk: 80, def: 85, satk: 90, sdef:100, spd: 50,
        ex: EX.tmp, typeI: PKTP_GRAS},
    {number: 183, name:'Marill',    hp: 70, atk: 20, def: 50, satk: 20, sdef: 50, spd: 40,
        ex: EX.tmp, typeI: PKTP_WATR, typeII: PKTP_FAIR},
    {number: 184, name:'Azumarill', hp:100, atk: 50, def: 80, satk: 50, sdef: 80, spd: 50,
        ex: EX.tmp, typeI: PKTP_WATR, typeII: PKTP_FAIR},
    {number: 185, name:'Sudowoodo', hp: 70, atk:100, def:115, satk: 30, sdef: 65, spd: 30,
        ex: EX.tmp, typeI: PKTP_ROCK},
    {number: 186, name:'Politoed',  hp: 90, atk: 75, def: 75, satk: 90, sdef:100, spd: 70,
        ex: EX.tmp, typeI: PKTP_WATR},
    {number: 187, name:'Hoppip',    hp: 35, atk: 35, def: 40, satk: 35, sdef: 55, spd: 50,
        ex: EX.tmp, typeI: PKTP_GRAS, typeII: PKTP_FLY},
    {number: 188, name:'Skiploom',  hp: 55, atk: 45, def: 50, satk: 45, sdef: 65, spd: 80,
        ex: EX.tmp, typeI: PKTP_GRAS, typeII: PKTP_FLY},
    {number: 189, name:'Jumpluff',  hp: 75, atk: 55, def: 70, satk: 55, sdef: 85, spd:110,
        ex: EX.tmp, typeI: PKTP_GRAS, typeII: PKTP_FLY},
    {number: 190, name:'Aipom',     hp: 55, atk: 70, def: 55, satk: 40, sdef: 55, spd: 85,
        ex: EX.tmp, typeI: PKTP_NORM},
    {number: 191, name:'Sunkern',   hp: 30, atk: 30, def: 30, satk: 30, sdef: 30, spd: 30,
        ex: EX.tmp, typeI: PKTP_GRAS},
    {number: 192, name:'Sunflora',  hp: 75, atk: 75, def: 55, satk:105, sdef: 85, spd: 30,
        ex: EX.tmp, typeI: PKTP_GRAS},
    {number: 193, name:'Yanma',     hp: 65, atk: 65, def: 45, satk: 75, sdef: 45, spd: 95,
        ex: EX.tmp, typeI: PKTP_BUG, typeII: PKTP_FLY},
    {number: 194, name:'Wooper',    hp: 55, atk: 45, def: 45, satk: 25, sdef: 25, spd: 15,
        ex: EX.tmp, typeI: PKTP_WATR, typeII: PKTP_GRND},
    {number: 195, name:'Quagsire',  hp: 95, atk: 85, def: 85, satk: 65, sdef: 65, spd: 35,
        ex: EX.tmp, typeI: PKTP_WATR, typeII: PKTP_GRND},
    {number: 196, name:'Espeon',    hp: 65, atk: 65, def: 60, satk:130, sdef: 95, spd:110,
        ex: EX.tmp, typeI: PKTP_PSYC},
    {number: 197, name:'Umbreon',   hp: 95, atk: 65, def:110, satk: 60, sdef:130, spd: 65,
        ex: EX.tmp, typeI: PKTP_DARK},
    {number: 198, name:'Murkrow',   hp: 60, atk: 85, def: 42, satk: 85, sdef: 42, spd: 91,
        ex: EX.tmp, typeI: PKTP_DARK, typeII: PKTP_FLY},
    {number: 199, name:'Slowking',  hp: 95, atk: 75, def: 80, satk:100, sdef:110, spd: 30,
        ex: EX.tmp, typeI: PKTP_WATR, typeII: PKTP_PSYC},
    {number: 200, name:'Misdreavus',hp: 60, atk: 60, def: 60, satk: 85, sdef: 85, spd: 85,
        ex: EX.tmp, typeI: PKTP_GHST},
    {number: 201, name:'Unown',     hp: 48, atk: 72, def: 48, satk: 72, sdef: 48, spd: 48,
        ex: EX.tmp, typeI: PKTP_PSYC},
    {number: 202, name:'Wobbuffet', hp:190, atk: 33, def: 58, satk: 33, sdef: 58, spd: 33,
        ex: EX.tmp, typeI: PKTP_PSYC},
    {number: 203, name:'Girafarig', hp: 70, atk: 80, def: 65, satk: 90, sdef: 65, spd: 85,
        ex: EX.tmp, typeI: PKTP_NORM, typeII: PKTP_PSYC},
    {number: 204, name:'Pineco',    hp: 50, atk: 65, def: 90, satk: 35, sdef: 35, spd: 15,
        ex: EX.tmp, typeI: PKTP_BUG},
    {number: 205, name:'Forretress',hp: 75, atk: 90, def:140, satk: 60, sdef: 60, spd: 40,
        ex: EX.tmp, typeI: PKTP_BUG, typeII: PKTP_STEL},
    {number: 206, name:'Dunsparce', hp:100, atk: 70, def: 70, satk: 65, sdef: 65, spd: 45,
        ex: EX.tmp, typeI: PKTP_NORM},
    {number: 207, name:'Gligar',    hp: 65, atk: 75, def:105, satk: 35, sdef: 65, spd: 85,
        ex: EX.tmp, typeI: PKTP_GRND, typeII: PKTP_FLY},
    {number: 208, name:'Steelix',   hp: 75, atk: 85, def:200, satk: 55, sdef: 65, spd: 30,
        ex: EX.tmp, typeI: PKTP_STEL, typeII: PKTP_GRND},
    {number: 209, name:'Snubbull',  hp: 60, atk: 80, def: 50, satk: 40, sdef: 40, spd: 30,
        ex: EX.tmp, typeI: PKTP_FAIR},
    {number: 210, name:'Granbull',  hp: 90, atk:120, def: 75, satk: 60, sdef: 60, spd: 45,
        ex: EX.tmp, typeI: PKTP_FAIR},
    {number: 211, name:'Qwilfish',  hp: 65, atk: 95, def: 75, satk: 55, sdef: 55, spd: 85,
        ex: EX.tmp, typeI: PKTP_WATR, typeII: PKTP_POSN},
    {number: 212, name:'Scizor',    hp: 70, atk:130, def:100, satk: 55, sdef: 80, spd: 65,
        ex: EX.tmp, typeI: PKTP_BUG, typeII: PKTP_STEL},
    {number: 213, name:'Shuckle',   hp: 20, atk: 10, def:230, satk: 10, sdef:230, spd:  5,
        ex: EX.tmp, typeI: PKTP_BUG, typeII: PKTP_ROCK},
    {number: 214, name:'Heracross', hp: 80, atk:125, def: 75, satk: 40, sdef: 95, spd: 85,
        ex: EX.tmp, typeI: PKTP_BUG, typeII: PKTP_FIGT},
    {number: 215, name:'Sneasel',   hp: 55, atk: 95, def: 55, satk: 35, sdef: 75, spd:115,
        ex: EX.tmp, typeI: PKTP_DARK, typeII: PKTP_ICE},
    {number: 216, name:'Teddiursa', hp: 60, atk: 80, def: 50, satk: 50, sdef: 50, spd: 40,
        ex: EX.tmp, typeI: PKTP_NORM},
    {number: 217, name:'Ursaring',  hp: 90, atk:130, def: 75, satk: 75, sdef: 75, spd: 55,
        ex: EX.tmp, typeI: PKTP_NORM},
    {number: 218, name:'Slugma',    hp: 40, atk: 40, def: 40, satk: 70, sdef: 40, spd: 20,
        ex: EX.tmp, typeI: PKTP_FIRE},
    {number: 219, name:'Magcargo',  hp: 50, atk: 50, def:120, satk: 80, sdef: 80, spd: 30,
        ex: EX.tmp, typeI: PKTP_FIRE, typeII: PKTP_ROCK},
    {number: 220, name:'Swinub',    hp: 50, atk: 50, def: 40, satk: 30, sdef: 30, spd: 50,
        ex: EX.tmp, typeI: PKTP_ICE, typeII: PKTP_GRND},
    {number: 221, name:'Piloswine', hp:100, atk:100, def: 80, satk: 60, sdef: 60, spd: 50,
        ex: EX.tmp, typeI: PKTP_ICE, typeII: PKTP_GRND},
    {number: 222, name:'Corsola',   hp: 55, atk: 55, def: 85, satk: 65, sdef: 85, spd: 35,
        ex: EX.tmp, typeI: PKTP_WATR, typeII: PKTP_ROCK},
    {number: 223, name:'Remoraid',  hp: 35, atk: 65, def: 35, satk: 65, sdef: 35, spd: 65,
        ex: EX.tmp, typeI: PKTP_WATR},
    {number: 224, name:'Octillery', hp: 75, atk:105, def: 75, satk:105, sdef: 75, spd: 45,
        ex: EX.tmp, typeI: PKTP_WATR},
    {number: 225, name:'Delibird',  hp: 45, atk: 55, def: 45, satk: 65, sdef: 45, spd: 75,
        ex: EX.tmp, typeI: PKTP_ICE, typeII: PKTP_FLY},
    {number: 226, name:'Mantine',   hp: 65, atk: 40, def: 70, satk: 80, sdef:140, spd: 70,
        ex: EX.tmp, typeI: PKTP_WATR, typeII: PKTP_FLY},
    {number: 227, name:'Skarmory',  hp: 65, atk: 80, def:140, satk: 40, sdef: 70, spd: 70,
        ex: EX.tmp, typeI: PKTP_STEL, typeII: PKTP_FLY},
    {number: 228, name:'Houndour',  hp: 45, atk: 60, def: 30, satk: 80, sdef: 50, spd: 65,
        ex: EX.tmp, typeI: PKTP_DARK, typeII: PKTP_FIRE},
    {number: 229, name:'Houndoom',  hp: 75, atk: 90, def: 50, satk:110, sdef: 80, spd: 95,
        ex: EX.tmp, typeI: PKTP_DARK, typeII: PKTP_FIRE},
    {number: 230, name:'Kingdra',   hp: 75, atk: 95, def: 95, satk: 95, sdef: 95, spd: 85,
        ex: EX.tmp, typeI: PKTP_WATR, typeII: PKTP_DRAG},
    {number: 231, name:'Phanpy',    hp: 90, atk: 60, def: 60, satk: 40, sdef: 40, spd: 40,
        ex: EX.tmp, typeI: PKTP_GRND},
    {number: 232, name:'Donphan',   hp: 90, atk:120, def:120, satk: 60, sdef: 60, spd: 50,
        ex: EX.tmp, typeI: PKTP_GRND},
    {number: 233, name:'Porygon2',  hp: 85, atk: 80, def: 90, satk:105, sdef: 95, spd: 60,
        ex: EX.tmp, typeI: PKTP_NORM},
    {number: 234, name:'Stantler',  hp: 73, atk: 95, def: 62, satk: 85, sdef: 65, spd: 85,
        ex: EX.tmp, typeI: PKTP_NORM},
    {number: 235, name:'Smeargle',  hp: 55, atk: 20, def: 35, satk: 20, sdef: 45, spd: 75,
        ex: EX.tmp, typeI: PKTP_NORM},
    {number: 236, name:'Tyrogue',   hp: 35, atk: 35, def: 35, satk: 35, sdef: 35, spd: 35,
        ex: EX.tmp, typeI: PKTP_FIGT},
    {number: 237, name:'Hitmontop', hp: 50, atk: 95, def: 95, satk: 35, sdef:110, spd: 70,
        ex: EX.tmp, typeI: PKTP_FIGT},
    {number: 238, name:'Smoochum',  hp: 45, atk: 30, def: 15, satk: 85, sdef: 65, spd: 65,
        ex: EX.tmp, typeI: PKTP_ICE, typeII: PKTP_PSYC},
    {number: 239, name:'Elekid',    hp: 45, atk: 63, def: 37, satk: 65, sdef: 55, spd: 95,
        ex: EX.tmp, typeI: PKTP_ELEC},
    {number: 240, name:'Magby',     hp: 45, atk: 75, def: 37, satk: 70, sdef: 55, spd: 83,
        ex: EX.tmp, typeI: PKTP_FIRE},
    {number: 241, name:'Miltank',   hp: 95, atk: 80, def:105, satk: 40, sdef: 70, spd:100,
        ex: EX.tmp, typeI: PKTP_NORM},
    {number: 242, name:'Blissey',   hp:255, atk: 10, def: 10, satk: 75, sdef:135, spd: 55,
        ex: EX.tmp, typeI: PKTP_NORM},
    {number: 243, name:'Raikou',    hp: 90, atk: 85, def: 75, satk:115, sdef:100, spd:115,
        ex: EX.tmp, typeI: PKTP_ELEC},
    {number: 244, name:'Entei',     hp:115, atk:115, def: 85, satk: 90, sdef: 75, spd:100,
        ex: EX.tmp, typeI: PKTP_FIRE},
    {number: 245, name:'Suicune',   hp:100, atk: 75, def:115, satk: 90, sdef:115, spd: 85,
        ex: EX.tmp, typeI: PKTP_WATR},
    {number: 246, name:'Larvitar',  hp: 50, atk: 64, def: 50, satk: 45, sdef: 50, spd: 41,
        ex: EX.tmp, typeI: PKTP_ROCK, typeII: PKTP_GRND},
    {number: 247, name:'Pupitar',   hp: 70, atk: 84, def: 70, satk: 65, sdef: 70, spd: 51,
        ex: EX.tmp, typeI: PKTP_ROCK, typeII: PKTP_GRND},
    {number: 248, name:'Tyranitar', hp:100, atk:134, def:110, satk: 95, sdef:154, spd: 61,
        ex: EX.tmp, typeI: PKTP_ROCK, typeII: PKTP_DARK},
    {number: 249, name:'Lugia',     hp:106, atk: 90, def:130, satk: 90, sdef:154, spd:110,
        ex: EX.tmp, typeI: PKTP_PSYC, typeII: PKTP_FLY},
    {number: 250, name:'Ho-Oh',     hp:106, atk:130, def: 90, satk:110, sdef:154, spd: 90,
        ex: EX.tmp, typeI: PKTP_FIRE, typeII: PKTP_FLY},
    {number: 251, name:'Celebi',    hp:100, atk:100, def:100, satk:100, sdef:100, spd:100,
        ex: EX.tmp, typeI: PKTP_PSYC, typeII: PKTP_GRAS},

    {number: 252, name:'Treecko',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 253, name:'Grovyle',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 254, name:'Sceptile',  hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 255, name:'Torchic',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 256, name:'Combusken', hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 257, name:'Blaziken',  hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 258, name:'Mudkip',    hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 259, name:'Marshtomp', hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 260, name:'Swampert',  hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 261, name:'Poochyena', hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 262, name:'Mightyena', hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 263, name:'Zigzagoon', hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 264, name:'Linoone',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 265, name:'Wurmple',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 266, name:'Silcon',    hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 267, name:'Beautifly', hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 268, name:'Cascoon',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 269, name:'Dustox',    hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 270, name:'Lotad',     hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 271, name:'Lombre',    hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 272, name:'Ludicolo',  hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 273, name:'Seedot',    hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 274, name:'Nuzleaf',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 275, name:'Shiftry',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 276, name:'Taillow',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 277, name:'Swellow',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 278, name:'Wingull',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 279, name:'Pelipper',  hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 280, name:'Ralts',     hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 281, name:'Kirlia',    hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 282, name:'Gardevoir', hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 283, name:'Surskit',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 284, name:'Masquerain',hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 285, name:'Shroomish', hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 286, name:'Breloom',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 287, name:'Slakoth',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 288, name:'Vigoroth',  hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 289, name:'Slaking',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 290, name:'Nincada',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 291, name:'Ninjask',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 292, name:'Shedinja',  hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 293, name:'Whismur',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 294, name:'Loudred',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 295, name:'Exploud',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 296, name:'Makuhita',  hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 297, name:'Hariyama',  hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 298, name:'Azurill',   hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 299, name:'Nosepass',  hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
    {number: 300, name:'Skitty',    hp: 0, atk: 0, def: 0, satk: 0, sdef: 0, spd: 0, ex: EX.tmp, typeI: PKTP_QQQQ, typeII: PKTP_QQQQ},
]


// this is a map from index to national dex number
// by doing PKMN_INDEX_TO_NUMBER_MAP[i] you will get 
// the national dex number or a -1 if there's no pokemon with that index number.
const PKMN_INDEX_TO_NUMBER_MAP = [
    //00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 0A, 0B, 0C, 0D, 0E, 0F
      -1,112,115, 32, 35, 21,100, 34, 80,  2,103,108,102, 88, 94, 29,
    //10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 1A, 1B, 1C, 1D, 1E, 1F
      31,104,111,131, 59,151,130, 90, 72, 92,123,120,  9,127,114, -1,
    //20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 2A, 2B, 2C, 2D, 2E, 2F
      -1, 58, 95, 22, 16, 79, 64, 75,113, 67,122,106,107, 24, 47, 54,
    //30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 3A, 3B, 3C, 3D, 3E, 3F
      96, 76, -1,126, -1,125, 82,109, -1, 56, 86, 50,128, -1, -1, -1,
    //40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 4A, 4B, 4C, 4D, 4E, 4F
      83, 48,149, -1, -1, -1, 84, 60,124,146,144,145,132, 52, 98, -1,
    //50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 5A, 5B, 5C, 5D, 5E, 5F
      -1, -1, 37, 38, 25, 26, -1, -1,147,148,140,141,116,117, -1, -1,
    //60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 6A, 6B, 6C, 6D, 6E, 6F
      27, 28,138,139, 39, 40,133,136,135,134, 66, 41, 23, 46, 61, 62,
    //70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 7A, 7B, 7C, 7D, 7E, 7F
      13, 14, 15, -1, 85, 57, 51, 49, 87, -1, -1, 10, 11, 12, 68, -1,
    //80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 8A, 8B, 8C, 8D, 8E, 8F
      55, 97, 42,150,143,129, -1, -1, 89, -1, 99, 91, -1,101, 36,110,
    //90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 9A, 9B, 9C, 9D, 9E, 9F
      53,105, -1, 93, 63, 65, 17, 18,121,  1,  3, 73, -1,118,119, -1,
    //A0, A1, A2, A3, A4, A5, A6, A7, A8, A9, AA, AB, AC, AD, AE, AF
      -1, -1, -1, 77, 78, 19, 20, 33, 30, 74,137,142, -1, 81, -1, -1,
    //B0, B1, B2, B3, B4, B5, B6, B7, B8, B9, BA, BB, BC, BD, BE, BF
       4,  7,  5,  8,  6, -1, -1, -1, -1, 43, 44, 45, 69, 70, 71, -1,
];

class Move {
    constructor(name, pp, type, patch) {
        this.name = name;
        this.pp = pp;
        this.type = type;
        if (patch !== undefined) {
            this.patch = patch;
        }
    }

    forGeneration (gen) {
        const result = { name:this.name, pp:this.pp, type: this.type };
        if (gen === 'I') return result;
        if (this.patch !== undefined) {
            if (this.patch.genII !== undefined) {
                this.apply(result, this.patch.genII);
            }
            if (gen === 'II') return result;
            if (this.patch.genIII !== undefined) {
                this.apply(result, this.patch.genIII);
            }
        }
        return result;
    }

    apply (result, patch) {
        if (patch.pp !== undefined) {
            result.pp = patch.pp;
        }
        if (patch.type !== undefined) {
            result.type = patch.type;
        }
    }
}

const INDEX_TO_MOVE = [
    null, //0x00 -- there's no move at index 0
    new Move("Pound",          35, PKTP_NORM), //0x01
    new Move("Karate Chop",    25, PKTP_NORM, {genII: {type: PKTP_FIGT}}), //0x02
    new Move("Double Slap",    10, PKTP_NORM), //0x03
    new Move("Comet Punch",    15, PKTP_NORM), //0x04
    new Move("Mega Punch",     20, PKTP_NORM), //0x05
    new Move("Pay Day",        20, PKTP_NORM), //0x06
    new Move("Fire Punch",     15, PKTP_FIRE), //0x07
    new Move("Ice Punch",      15, PKTP_ICE), //0x08
    new Move("Thunder Punch",  15, PKTP_ELEC), //0x09
    new Move("Scratch",        35, PKTP_NORM), //0x0A - 10
    new Move("Vise Grip",      30, PKTP_NORM), //0x0B
    new Move("Guillotine",     5,  PKTP_NORM), //0x0C
    new Move("Razor Wind",     10, PKTP_NORM), //0x0D
    new Move("Swords Dance",   30, PKTP_NORM), //0x0E
    new Move("Cut",            30, PKTP_NORM), //0x0F - 15
    new Move("Gust",           35, PKTP_NORM, {genII: {type: PKTP_FLY}}), //0x10
    new Move("Wing Attack",    35, PKTP_FLY), //0x11
    new Move("Whirlwind",      20, PKTP_NORM), //0x12
    new Move("Fly",            15, PKTP_FLY), //0x13
    new Move("Bind",           20, PKTP_NORM), //0x14 - 20
    new Move("Slam",           20, PKTP_NORM), //0x15
    new Move("Vine Whip",      10, PKTP_GRAS), //0x16
    new Move("Stomp",          20, PKTP_NORM), //0x17
    new Move("Double Kick",    30, PKTP_FIGT), //0x18
    new Move("Mega Kick",      5,  PKTP_NORM), //0x19 - 25
    new Move("Jump Kick",      25, PKTP_FIGT), //0x1A
    new Move("Rolling Kick",   15, PKTP_FIGT), //0x1B
    new Move("Sand Attack",    15, PKTP_NORM, {genII: {type: PKTP_GRND}}), //0x1C
    new Move("Headbutt",       15, PKTP_NORM), //0x1D
    new Move("Horn Attack",    25, PKTP_NORM), //0x1E - 30
    new Move("Fury Attack",    20, PKTP_NORM), //0x1F
    new Move("Horn Drill",     5,  PKTP_NORM), //0x20
    new Move("Tackle",         35, PKTP_NORM), //0x21
    new Move("Body Slam",      15, PKTP_NORM), //0x22
    new Move("Wrap",           20, PKTP_NORM), //0x23 - 35
    new Move("Take Down",      20, PKTP_NORM), //0x24
    new Move("Thrash",         20, PKTP_NORM), //0x25
    new Move("Double-Edge",    15, PKTP_NORM), //0x26
    new Move("Tail Whip",      30, PKTP_NORM), //0x27
    new Move("Poison Sting",   35, PKTP_POSN), //0x28 - 40
    new Move("Twineedle",      20, PKTP_BUG), //0x29
    new Move("Pin Missile",    20, PKTP_BUG), //0x2A
    new Move("Leer",           30, PKTP_NORM), //0x2B
    new Move("Bite",           25, PKTP_NORM, {genII: {type: PKTP_DARK}}), //0x2C
    new Move("Growl",          40, PKTP_NORM), //0x2D - 45
    new Move("Roar",           20, PKTP_NORM), //0x2E
    new Move("Sing",           15, PKTP_NORM), //0x2F
    new Move("Supersonic",     20, PKTP_NORM), //0x30
    new Move("Sonic Boom",     20, PKTP_NORM), //0x31
    new Move("Disable",        20, PKTP_NORM), //0x32 - 50
    new Move("Acid",           30, PKTP_POSN), //0x33
    new Move("Ember",          25, PKTP_FIRE), //0x34
    new Move("Flamethrower",   15, PKTP_FIRE), //0x35
    new Move("Mist",           30, PKTP_ICE), //0x36
    new Move("Water Gun",      25, PKTP_WATR), //0x37 - 55
    new Move("Hydro Pump",     5,  PKTP_WATR), //0x38
    new Move("Surf",           15, PKTP_WATR), //0x39
    new Move("Ice Beam",       10, PKTP_ICE), //0x3A
    new Move("Blizzard",       5,  PKTP_ICE), //0x3B
    new Move("Psybeam",        20, PKTP_PSYC), //0x3C - 60
    new Move("Bubble Beam",    20, PKTP_WATR), //0x3D
    new Move("Aurora Beam",    20, PKTP_ICE), //0x3E
    new Move("Hyper Beam",     5,  PKTP_NORM), //0x3F
    new Move("Peck",           35, PKTP_FLY), //0x40
    new Move("Drill Peck",     20, PKTP_FLY), //0x41 - 65
    new Move("Submission",     25, PKTP_FIGT), //0x42
    new Move("Low Kick",       20, PKTP_FIGT), //0x43
    new Move("Counter",        20, PKTP_FIGT), //0x44
    new Move("Seismic Toss",   20, PKTP_FIGT), //0x45
    new Move("Strength",       15, PKTP_NORM), //0x46 - 70
    new Move("Absorb",         20, PKTP_GRAS), //0x47
    new Move("Mega Drain",     10, PKTP_GRAS), //0x48
    new Move("Leech Seed",     10, PKTP_GRAS), //0x49
    new Move("Growth",         40, PKTP_NORM), //0x4A
    new Move("Razor Leaf",     25, PKTP_GRAS), //0x4B - 75
    new Move("Solar Beam",     10, PKTP_GRAS), //0x4C
    new Move("Poison Powder",  35, PKTP_POSN), //0x4D
    new Move("Stun Spore",     30, PKTP_GRAS), //0x4E
    new Move("Sleep Powder",   15, PKTP_GRAS), //0x4F
    new Move("Petal Dance",    20, PKTP_GRAS), //0x50 - 80
    new Move("String Shot",    40, PKTP_BUG), //0x51
    new Move("Dragon Rage",    10, PKTP_DRAG), //0x52
    new Move("Fire Spin",      15, PKTP_FIRE), //0x53
    new Move("Thunder Shock",  30, PKTP_ELEC), //0x54
    new Move("Thunderbolt",    15, PKTP_ELEC), //0x55 - 85
    new Move("Thunder Wave",   20, PKTP_ELEC), //0x56
    new Move("Thunder",        10, PKTP_ELEC), //0x57
    new Move("Rock Throw",     15, PKTP_ROCK), //0x58
    new Move("Earthquake",     10, PKTP_GRND), //0x59
    new Move("Fissure",        5,  PKTP_GRND), //0x5A - 90
    new Move("Dig",            10, PKTP_GRND), //0x5B
    new Move("Toxic",          10, PKTP_POSN), //0x5C
    new Move("Confusion",      25, PKTP_PSYC), //0x5D
    new Move("Psychic",        10, PKTP_PSYC), //0x5E
    new Move("Hypnosis",       20, PKTP_PSYC), //0x5F - 95
    new Move("Meditate",       40, PKTP_PSYC), //0x60
    new Move("Agility",        30, PKTP_PSYC), //0x61
    new Move("Quick Attack",   30, PKTP_NORM), //0x62
    new Move("Rage",           20, PKTP_NORM), //0x63
    new Move("Teleport",       20, PKTP_PSYC), //0x64 - 100
    new Move("Night Shade",    15, PKTP_GHST), //0x65
    new Move("Mimic",          10, PKTP_NORM), //0x66
    new Move("Screech",        40, PKTP_NORM), //0x67
    new Move("Double Team",    15, PKTP_NORM), //0x68
    new Move("Recover",        20, PKTP_NORM), //0x69 - 105
    new Move("Harden",         30, PKTP_NORM), //0x6A
    new Move("Minimize",       20, PKTP_NORM), //0x6B
    new Move("Smokescreen",    20, PKTP_NORM), //0x6C
    new Move("Confuse Ray",    10, PKTP_GHST), //0x6D
    new Move("Withdraw",       40, PKTP_WATR), //0x6E - 110
    new Move("Defense Curl",   40, PKTP_NORM), //0x6F
    new Move("Barrier",        30, PKTP_PSYC), //0x70
    new Move("Light Screen",   30, PKTP_PSYC), //0x71
    new Move("Haze",           30, PKTP_ICE), //0x72
    new Move("Reflect",        20, PKTP_PSYC), //0x73 - 115
    new Move("Focus Energy",   30, PKTP_NORM), //0x74
    new Move("Bide",           10, PKTP_NORM), //0x75
    new Move("Metronome",      10, PKTP_NORM), //0x76
    new Move("Mirror Move",    20, PKTP_FLY), //0x77
    new Move("Self-Destruct",  5,  PKTP_NORM), //0x78 - 120
    new Move("Egg Bomb",       10, PKTP_NORM), //0x79
    new Move("Lick",           30, PKTP_GHST), //0x7A
    new Move("Smog",           20, PKTP_POSN), //0x7B
    new Move("Sludge",         20, PKTP_POSN), //0x7C
    new Move("Bone Club",      20, PKTP_GRND), //0x7D - 125
    new Move("Fire Blast",     5,  PKTP_FIRE), //0x7E
    new Move("Waterfall",      15, PKTP_WATR), //0x7F
    new Move("Clamp",          10, PKTP_WATR), //0x80
    new Move("Swift",          20, PKTP_NORM), //0x81
    new Move("Skull Bash",     15, PKTP_NORM), //0x82 - 130
    new Move("Spike Cannon",   15, PKTP_NORM), //0x83
    new Move("Constrict",      35, PKTP_NORM), //0x84
    new Move("Amnesia",        20, PKTP_PSYC), //0x85
    new Move("Kinesis",        15, PKTP_PSYC), //0x86
    new Move("Soft-Boiled",    10, PKTP_NORM), //0x87 - 135
    new Move("High Jump Kick", 20, PKTP_FIGT), //0x88
    new Move("Glare",          30, PKTP_NORM), //0x89
    new Move("Dream Eater",    15, PKTP_PSYC), //0x8A
    new Move("Poison Gas",     40, PKTP_POSN), //0x8B
    new Move("Barrage",        20, PKTP_NORM), //0x8C - 140
    new Move("Leech Life",     15, PKTP_BUG), //0x8D
    new Move("Lovely Kiss",    10, PKTP_NORM), //0x8E
    new Move("Sky Attack",     5,  PKTP_FLY), //0x8F
    new Move("Transform",      10, PKTP_NORM), //0x90
    new Move("Bubble",         30, PKTP_WATR), //0x91 - 145
    new Move("Dizzy Punch",    10, PKTP_NORM), //0x92
    new Move("Spore",          15, PKTP_GRAS), //0x93
    new Move("Flash",          20, PKTP_NORM), //0x94
    new Move("Psywave",        15, PKTP_PSYC), //0x95
    new Move("Splash",         40, PKTP_NORM), //0x96 - 150
    new Move("Acid Armor",     40, PKTP_POSN), //0x97
    new Move("Crabhammer",     10, PKTP_WATR), //0x98
    new Move("Explosion",      5,  PKTP_NORM), //0x99
    new Move("Fury Swipes",    15, PKTP_NORM), //0x9A
    new Move("Bonemerang",     10, PKTP_GRND), //0x9B - 155
    new Move("Rest",           10, PKTP_PSYC), //0x9C
    new Move("Rock Slide",     10, PKTP_ROCK), //0x9D
    new Move("Hyper Fang",     15, PKTP_NORM), //0x9E
    new Move("Sharpen",        30, PKTP_NORM), //0x9F
    new Move("Conversion",     30, PKTP_NORM), //0xA0 - 160
    new Move("Tri Attack",     10, PKTP_NORM), //0xA1
    new Move("Super Fang",     10, PKTP_NORM), //0xA2
    new Move("Slash",          20, PKTP_NORM), //0xA3
    new Move("Substitue",      10, PKTP_NORM), //0xA4
    new Move("Struggle",       10, PKTP_NORM,{genII: {pp: 1}}), //0xA5 - 165
    new Move("Sketch",         1,  PKTP_NORM), //0xA6
    new Move("Triple Kick",    10, PKTP_FIGT), //0xA7
    new Move("Thief",          10, PKTP_DARK), //0xA8
    new Move("Spider Web",     10, PKTP_BUG), //0xA9
    new Move("Mind Reader",    5,  PKTP_NORM), //0xAA - 170
    new Move("Nightmare",      15, PKTP_GHST), //0xAB
    new Move("Flame Wheel",    25, PKTP_FIRE), //0xAC
    new Move("Snore",          15, PKTP_NORM), //0xAD
    new Move("Curse",          10, PKTP_QQQQ), //0xAE
    new Move("Flail",          15, PKTP_NORM), //0xAF - 175
    new Move("Conversion 2",   30, PKTP_NORM), //0xB0
    new Move("Aeroblast",      5, PKTP_FLY), //0xB1
    new Move("Cotton Spore",   40, PKTP_GRAS), //0xB2
    new Move("Reversal",       15, PKTP_FIGT), //0xB3
    new Move("Spite",          10, PKTP_GHST), //0xB4 - 180
    new Move("Powder Snow",    25, PKTP_ICE), //0xB5
    new Move("Protect",        10, PKTP_NORM), //0xB6
    new Move("Mach Punch",     30, PKTP_FIGT), //0xB7
    new Move("Scary Face",     10, PKTP_NORM), //0xB8
    new Move("Feint Attack",   20, PKTP_DARK), //0xB9 - 185
    new Move("Sweet Kiss",     10, PKTP_NORM), //0xBA
    new Move("Belly Drum",     10, PKTP_NORM), //0xBB
    new Move("Sludge Bomb",    10, PKTP_POSN), //0xBC
    new Move("Mud-Slap",       10, PKTP_GRND), //0xBD
    new Move("Octazooka",      10, PKTP_WATR), //0xBE - 190
    new Move("Spikes",         20, PKTP_GRND), //0xBF
    new Move("Zap Cannon",     5,  PKTP_ELEC), //0xC0
    new Move("Foresight",      40, PKTP_NORM), //0xC1
    new Move("Destiny Bond",   5,  PKTP_GHST), //0xC2
    new Move("Perish Song",    5,  PKTP_NORM), //0xC3 - 195
    new Move("Icy Wind",       15, PKTP_ICE), //0xC4
    new Move("Detect",         5,  PKTP_FIGT), //0xC5
    new Move("Bone Rush",      10, PKTP_GRND), //0xC6
    new Move("Lock-On",        5,  PKTP_NORM), //0xC7
    new Move("Outrage",        15, PKTP_DRAG), //0xC8 - 200
    new Move("Sandstorm",      10, PKTP_ROCK), //0xC9
    new Move("Giga Drain",     5,  PKTP_GRAS), //0xCA
    new Move("Endure",         10, PKTP_NORM), //0xCB
    new Move("Charm",          20, PKTP_NORM), //0xCC
    new Move("Rollout",        20, PKTP_ROCK), //0xCD - 205
    new Move("False Swipe",    40, PKTP_NORM), //0xCE
    new Move("Swagger",        15, PKTP_NORM), //0xCF
    new Move("Milk Drink",     10, PKTP_NORM), //0xD0
    new Move("Spark",          20, PKTP_ELEC), //0xD1
    new Move("Fury Cutter",    20, PKTP_BUG), //0xD2 - 210
    new Move("Steel Wing",     25, PKTP_STEL), //0xD3
    new Move("Mean Look",      5,  PKTP_NORM), //0xD4
    new Move("Attract",        15, PKTP_NORM), //0xD5
    new Move("Sleep Talk",     10, PKTP_NORM), //0xD6
    new Move("Heal Bell",      5,  PKTP_NORM), //0xD7 - 215
    new Move("Return",         20, PKTP_NORM), //0xD8
    new Move("Present",        15, PKTP_NORM), //0xD9
    new Move("Frustration",    20, PKTP_NORM), //0xDA
    new Move("Safeguard",      25, PKTP_NORM), //0xDB
    new Move("Pain Split",     20, PKTP_NORM), //0xDC - 220
    new Move("Sacred Fire",    5, PKTP_FIRE), //0xDD
    new Move("Magnitude",      30, PKTP_GRND), //0xDE
    new Move("Dynamic Punch",  5, PKTP_FIGT), //0xDF
    new Move("Megahorn",       10, PKTP_BUG), //0xE0
    new Move("Dragon Breath",  20, PKTP_DRAG), //0xE1 - 225
    new Move("Baton Pass",     40, PKTP_NORM), //0xE2
    new Move("Encore",         5, PKTP_NORM), //0xE3
    new Move("Pursuit",        20, PKTP_DARK), //0xE4
    new Move("Rapid Spin",     40, PKTP_NORM), //0xE5
    new Move("Sweet Scent",    20, PKTP_NORM), //0xE6 - 230
    new Move("Iron Tail",      15, PKTP_STEL), //0xE7
    new Move("Metal Claw",     35, PKTP_STEL), //0xE8
    new Move("Vital Throw",    10, PKTP_FIGT), //0xE9
    new Move("Morning Sun",    5,  PKTP_NORM), //0xEA
    new Move("Synthesis",      5,  PKTP_GRAS), //0xEB - 235
    new Move("Moonlight",      5,  PKTP_NORM), //0xEC
    new Move("Hidden Power",   15, PKTP_NORM), //0xED
    new Move("Cross Chop",     5,  PKTP_FIGT), //0xEE
    new Move("Twister",        20, PKTP_DRAG), //0xEF
    new Move("Rain Dance",     5,  PKTP_WATR), //0xF0 - 240
    new Move("Sunny Day",      5,  PKTP_FIRE), //0xF1
    new Move("Crunch",         15, PKTP_DARK), //0xF2
    new Move("Mirror Coat",    20, PKTP_PSYC), //0xF3
    new Move("Psych Up",       10, PKTP_NORM), //0xF4
    new Move("Extreme Speed",  5,  PKTP_NORM), //0xF5 - 245
    new Move("Ancient Power",  5,  PKTP_ROCK), //0xF6
    new Move("Shadow Ball",    15, PKTP_GHST), //0xF7
    new Move("Future Sight",   15, PKTP_PSYC), //0xF8
    new Move("Rock Smash",     15, PKTP_FIGT), //0xF9
    new Move("Whirlpool",      15, PKTP_WATR), //0xFA - 250
];


const GEN_I_ITEM_NAME_MAP = [
    // 00 - 07
    'Glitch !?/x', 'Master Ball', 
    'Ultra Ball', 'Great Ball',
    'Poke Ball', 'Town Map', 
    'Bicycle', 'Surfboard (?????)',
    // 08 - 0F
    'Safari Ball','Pokédex',
    'Moon Stone','Antidote',
    'Burn Heal','Ice Heal',
    'Awakening','Paralyze Heal',
    // 10 - 17
    'Full Restore', 'Max Potion',
    'Hyper Potion','Super Potion',
    'Potion','BoulderBadge',
    'CascadeBadge','ThunderBadge',
    // 18 - 1F
    'RainbowBadge','SoulBadge','MarshBadge','VolcanoBadge',
    'EarthBadge','Escape Rope','Repel','Old Amber',
    // 20 - 27
    'Fire Stone','Thunder Stone','Water Stone','HP Up',
    'Protein','Iron','Carbos','Calcium',
    // 28 - 2F
    'Rare Candy','Dome Fossil','Helix Fossil','Secret Key',
    'Surfboard (?????)','Bike Voucher','X Accuracy','Leaf Stone',
    // 30 - 37
    'Card Key','Nugget','Glitch PP Up','Poké Doll',
    'Full Heal','Revive','Max Revive','Guard Spec.',
    // 38 - 3F
    'Super Repel','Max Repel','Dire Hit','Coin',
    'Fresh Water','Soda Pop','Lemonade','S.S. Ticket',
    // 40 - 47
    'Gold Teeth','X Attack','X Defend','X Speed',
    'X Special','Coin Case','Oak\'s Parcel','Itemfinder',
    // 48 - 4F
    'Silph Scope','Poké Flute','Lift Key','Exp. All',
    'Old Rod','Good Rod','Super Rod','PP Up',
    // 50 - 57
    'Ether','Max Ether','Elixer','Max Elixer',
    '-','-','-','-',
    // 58 - 5F
    '-','-','-','-','-','-','-','-',
    // 60 - 6F
    '-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-',
    // 70 - 7F
    '-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-',
    // 80 - 8F
    '-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-',
    // 90 - 9F
    '-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-',
    // A0 - AF
    '-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-',
    // B0 - BF
    '-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-',
    // C0 - C7
    '-','-','-','-','HM01 Cut','HM02 Fly','HM03 Surf','HM04 Strength',
    // C7 - CC
    'HM05 Flash','TM01 Mega Punch','TM02 Razor Wind','TM03 Swords Dance',
    // CD - CF
    'TM04 Whirlwind','TM05 Mega Kick','TM06 Toxic','TM07 Horn Drill',
    // D0 - D7
    'TM08 Body Slam','TM09 Take Down','TM10 Double Edge','TM11 Bubble Beam',
    'TM12 Water Gun','TM13 Ice Beam','TM14 Blizzard','TM15 Hyper Beam',
    // D8 - DF
    'TM16 Pay Day','TM17 Submission','TM18 Counter','TM19 Seismic Toss',
    'TM20 Rage','TM21 Mega Drain','TM22 Solar Beam','TM23 Dragon Rage',
    // E0 - E7
    'TM24 Thunderbolt','TM25 Thunder','TM26 Earthquake','TM27 Fissure',
    'TM28 Dig','TM29 Psychic','TM30 Teleport','TM31 Mimic',
    // E8 - EF
    'TM32 Double Team','TM33 Reflect','TM34 Bide','TM35 Metronome',
    'TM36 Selfdestruct','TM37 Egg Bomb','TM38 Fire Blast','TM39 Swift',
    // F0 - F7
    'TM40 Skull Bash','TM41 Softboiled','TM42 Dream Eater','TM43 Sky Attack',
    'TM44 Rest','TM45 Thunder Wave','TM46 Psywave','TM47 Explosion',
    // F8 - FF
    'TM48 Rock Slide','TM49 Tri Attack','TM50 Substitue','TM51 Cut',
    'TM52 Fly','TM53 Surf','TM54 Strength','TM55 Flash',
];


const GEN_II_ITEM_NAME_MAP = [
    // 00 - 07
    '?', 'Master Ball', 
    'Ultra Ball', 'Bright Powder',
    'Great Ball', 'Poke Ball', 
    'Teru-sama', 'Bicycle', 
    // 08 - 0F
    'Moon Stone','Antidote', 
    'Burn Heal','Ice Heal',
    'Awakening','Paralyze Heal',
    'Full Restore','Max Potion',
    // 10 - 17
    'Hyper Potion','Super Potion', 
    'Potion', 'Escape Rope',
    'Repel','Max Elixer',
    'Fire Stone','Thunder Stone',
    // 18 - 1F
    'Water Stone','Teru-sama',
    'HP Up', 'Protein',
    'Iron','Carbos', 
    'Lucky Punch', 'Calcium',
    // 20 - 27
    'Rare Candy','X Accuracy',
    'Leaf Stone','Metal Powder',
    'Nugget','Poké Doll',
    'Full Heal','Revive',
    // 28 - 2F
    'Max Revive','Guard Spec.',
    'Super Repel','Max Repel',
    'Dir Hit','Teru-sama',
    'Fresh Water','Soda Pop',
    // 30 - 37
    'Lemonade','X Attack',
    'Teru-sama','X Defend',
    'X Speed','X Special',
    'Coin Case','Itemfinder',
    // 38 - 3F
    'Teru-sama','Exp. Share','Old Rod','Good Rod',
    'Silver Leaf','Super Rod','PP Up','Ether',
    // 40 - 47
    'Max Ether','Elixer','Red Scale','Secret Potion',
    'S.S. Ticket','Mystery Egg','Clear Bell (Crystal Only)','Silver Wing',
    // 48 - 4F
    'Moomoo Milk','Quick Claw','Poison Cure (Pecha) Berry','Gold Leaf',
    'Soft Sand','Sharp Beak','Paralyze Cure (Cheri) Berry','Burnt (Aspear) Berry ',
    // 50 - 57
    'Ice (Rawst) Berry','Poison Barb','King\'s Rock' ,'Bitter Berry (Persim)',
    'Mint (Chesto) Berry','Red Apricorn','Tiny Mushroom','Big Mushroom',
    // 58 - 5F
    'Silver Powder','Blue Apricorn','Teru-sama','Amulet Coin',
    'Yellow Apricorn','Green Apricorn','Cleanse Tag','Mystic Water',
    // 60 - 6F
    'Twisted Spoon','White Apricorn','Blackbelt','Black Apricorn',
    'Teru-sama','Pink Apricorn','Black Glasses','Slowpoke Tail',
    'Pink Bow','Stick','Smoke Ball','Never-Melt Ice',
    'Magnet','Miracle (Lum) Berry','Pearl','Big Pearl',
    // 70 - 7F
    'Everstone','Spell Tag','Rage Candy Bar','GS Ball (Crystal Only)',
    'Blue Card (Crystal Only)','Miracle Seed','Thick Club','Focus Band',
    'Teru-sama','Energy Powder','Energy Root','Heal Powder',
    'Revival Herb','Hard Stone','Lucky Egg','Card Key',
    // 80 - 8F
    'Machine Part','Egg Ticket (Crystal Only)','Lost Item','Stardust',
    'Star Piece','Basement Key','Pass','Teru-sama',
    'Teru-sama','Teru-sama','Charcoal','Berry Juice',
    'Scope Lens','Teru-sama','Teru-sama','Metal Coat',
    // 90 - 9F
    'Dragon Fang','Teru-sama','Leftovers','Teru-sama',
    'Teru-sama','Teru-sama','Mystery (Leppa) Berry','Dragon Scale',
    'Berserk Gene','Teru-sama','Teru-sama','Teru-sama',
    'Sacred Ash','Heavy Ball','Flower Mail','Level Ball',
    // A0 - AF
    'Lure Ball','Fast Ball','Teru-sama','Light Ball',
    'Friend Bal','Moon Ball','Love Ball','Normal Box',
    'Gorgeous Box','Sun Stone','Polkadot Bow','Teru-sama',
    'Up-Grade','Berry (Oran)','Gold (Sitrus) Berry','Squirt Bottle',
    // B0 - BE
    'Teru-sama','Park Ball','Rainbow Wing','Teru-sama',
    'Brick Piece','Surf Mail','Light-Blue Mail','Portrait Mail',
    'Lovely Mail','Eon Mail','Morph Mail','Bluesky Mail',
    'Music Mail','Mirage Mail','Teru-sama',
    // TM and HM
    'TM01 Dynamic Punch', //BF
    // C0 - C7
    'TM02 Headbutt',
    'TM03 Curse',
    'TM04 Rollout',
    'TM04 --',
    'TM05 Roar',
    'TM06 Toxic',
    'TM07 Zap Cannon',
    'TM08 Rock Smash',
    // C7 - CF
    'TM09 Psych Up',
    'TM10 Hidden Power',
    'TM11 Sunny Day',
    'TM12 Sweet Scen',
    'TM13 Snore',
    'TM14 Blizzard',
    'TM15 Hyper Beam',
    'TM16 Icy Wind',
    // D0 - D7
    'TM17 Protect',
    'TM18 Rain Dance',
    'TM19 Giga Drain',
    'TM20 Endure',
    'TM21 Frustration',
    'TM22 Solar Beam',
    'TM23 Iron Tail',
    'TM24 Dragon Breath',
    // D8 - DF
    'TM25 Thunder',
    'TM26 Earthquake',
    'TM27 Return',
    'TM28 Dig',
    'TM28 --',
    'TM29 Psychic',
    'TM30 Shadow Ball',
    'TM31 Mud-Slap',
    // E0 - E7
    'TM32 Double Team',
    'TM33 Ice Punch',
    'TM34 Swagger',
    'TM35 Sleep Talk',
    'TM36 Sludge Bomb',
    'TM37 Sandstorm',
    'TM38 Fire Blast',
    'TM39 Swift',
    // E8 - EF
    'TM40 Defense Curl',
    'TM41 Thunder Punch',
    'TM42 Dream Eater',
    'TM43 Detect',
    'TM44 Rest',
    'TM45 Attract',
    'TM46 Thief',
    'TM47 Steel Wing',
    // F0 - F7
    'TM48 Fire Punch',
    'TM49 Fury Cutter',
    'TM50 Nightmare',
    'HM01 Cut',
    'HM02 Fly',
    'HM03 Surf',
    'HM04 Strength',
    'HM05 Flash',
    // F8 - FF
    'HM06 Whirlpool',
    'HM07 Waterfall',
    'HM08 --',
    'HM09 --',
    'HM10 --',
    'HM11 --',
    'HM12 --','Cancel',
];
