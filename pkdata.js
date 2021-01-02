
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
    medFast: new ExpGroup(n => (n == 1)? 0 : n ** 3),
    medSlow: new ExpGroup(n => (n == 1 ?  0 : (6/5) *(n**3) - 15*(n**2) + 100*n - 140)),
    slow:    new ExpGroup(n => (n == 1 ? 0 : (5 * (n ** 3)) / 4)),
    tmp: new ExpGroup(n => n) // used as placeholder...
}

const EX = EXPERIENCE_GROUPS; // shorthand...

const PKMN_BY_NAT_NUMBER = [
    {number: 1, name:'Bulbasaur',   hp: 45, atk: 49, def: 49, satk: 65, sdef: 65, spd: 45, spc: 65, ex: EX.medSlow},
    {number: 2, name:'Ivysaur',     hp: 60, atk: 62, def: 63, satk: 80, sdef: 80, spd: 60, spc: 80, ex: EX.medSlow},
    {number: 3, name:'Venusaur',    hp: 80, atk: 82, def: 83, satk:100, sdef:100, spd: 80, spc:100, ex: EX.medSlow},
    {number: 4, name:'Charmander',  hp: 39, atk: 52, def: 43, satk: 60, sdef: 50, spd: 65, spc: 50, ex: EX.medSlow},
    {number: 5, name:'Charmeleon',  hp: 58, atk: 64, def: 58, satk: 80, sdef: 65, spd: 80, spc: 65, ex: EX.medSlow},
    {number: 6, name:'Charizard',   hp: 78, atk: 84, def: 78, satk:109, sdef: 85, spd:100, spc: 85, ex: EX.medSlow},
    {number: 7, name:'Squirtle',    hp: 44, atk: 48, def: 65, satk: 50, sdef: 64, spd: 43, spc: 50, ex: EX.medSlow},
    {number: 8, name:'Wartortle',   hp: 59, atk: 63, def: 80, satk: 65, sdef: 80, spd: 58, spc: 65, ex: EX.medSlow},
    {number: 9, name:'Blastoise',   hp: 79, atk: 83, def:100, satk: 85, sdef:105, spd: 78, spc: 85, ex: EX.medSlow},
    {number: 10, name:'Caterpie',   hp: 45, atk: 30, def: 35, satk: 20, sdef: 20, spd: 45, spc: 20, ex: EX.medFast},
    {number: 11, name:'Metapod',    hp: 50, atk: 20, def: 55, satk: 25, sdef: 25, spd: 30, spc: 25, ex: EX.medFast},
    {number: 12, name:'Butterfree', hp: 60, atk: 45, def: 50, satk: 90, sdef: 80, spd: 70, spc: 80, ex: EX.medFast},
    {number: 13, name:'Weedle',     hp: 40, atk: 35, def: 30, satk: 20, sdef: 20, spd: 50, spc: 20, ex: EX.medFast},
    {number: 14, name:'Kakuna',     hp: 45, atk: 25, def: 50, satk: 25, sdef: 25, spd: 35, spc: 25, ex: EX.medFast},
    {number: 15, name:'Beedrill',   hp: 65, atk: 80, def: 40, satk: 45, sdef: 80, spd: 75, spc: 45, ex: EX.medFast},
    {number: 16, name:'Pidgey',     hp: 40, atk: 45, def: 40, satk: 35, sdef: 35, spd: 56, spc: 35, ex: EX.medSlow},
    {number: 17, name:'Pidgeotto',  hp: 63, atk: 60, def: 55, satk: 50, sdef: 50, spd: 71, spc: 50, ex: EX.medSlow},
    {number: 18, name:'Pidgeot',    hp: 83, atk: 80, def: 75, satk: 70, sdef: 70, spd: 91, spc: 70, ex: EX.medSlow},
    {number: 19, name:'Rattata',    hp: 30, atk: 56, def: 35, satk: 25, sdef: 35, spd: 72, spc: 25, ex: EX.medFast},
    {number: 20, name:'Raticate',   hp: 55, atk: 81, def: 60, satk: 50, sdef: 70, spd: 97, spc: 50, ex: EX.medFast},
    {number: 21, name:'Spearow',    hp: 40, atk: 60, def: 30, satk: 31, sdef: 31, spd: 70, spc: 31, ex: EX.medFast},
    {number: 22, name:'Fearow',     hp: 65, atk: 90, def: 65, satk: 61, sdef: 61, spd:100, spc: 61, ex: EX.medFast},
    {number: 23, name:'Ekans',      hp: 35, atk: 60, def: 44, satk: 40, sdef: 54, spd: 55, spc: 40, ex: EX.medFast},
    {number: 24, name:'Arbok',      hp: 60, atk: 85, def: 69, satk: 65, sdef: 79, spd: 80, spc: 65, ex: EX.medFast},
    {number: 25, name:'Pikachu',    hp: 35, atk: 55, def: 30, satk: 50, sdef: 50, spd: 90, spc: 50, ex: EX.medFast},
    {number: 26, name:'Raichu',     hp: 60, atk: 90, def: 55, satk: 90, sdef: 80, spd:100, spc: 90, ex: EX.medFast},
    {number: 27, name:'Sandshrew',  hp: 50, atk: 75, def: 85, satk: 20, sdef: 30, spd: 40, spc: 30, ex: EX.medFast},
    {number: 28, name:'Sandslash',  hp: 75, atk:100, def:110, satk: 45, sdef: 35, spd: 65, spc: 55, ex: EX.medFast},
    {number: 29, name:'Nidoran♀',   hp: 55, atk: 47, def: 52, satk: 40, sdef: 40, spd: 41, spc: 40, ex: EX.medSlow},
    {number: 30, name:'Nidorina',   hp: 70, atk: 62, def: 67, satk: 55, sdef: 55, spd: 56, spc: 55, ex: EX.medSlow},
    {number: 31, name:'Nidoqueen',  hp: 90, atk: 82, def: 87, satk: 75, sdef: 85, spd: 76, spc: 75, ex: EX.medSlow},
    {number: 32, name:'Nidoran♂',   hp: 46, atk: 57, def: 40, satk: 40, sdef: 40, spd: 50, spc: 40, ex: EX.medSlow},
    {number: 33, name:'Nidorino',   hp: 61, atk: 72, def: 57, satk: 55, sdef: 55, spd: 65, spc: 55, ex: EX.medSlow},
    {number: 34, name:'Nidoking',   hp: 81, atk: 92, def: 77, satk: 85, sdef: 75, spd: 85, spc: 75, ex: EX.medSlow},
    {number: 35, name:'Clefairy',   hp: 70, atk: 45, def: 48, satk: 60, sdef: 65, spd: 35, spc: 60, ex: EX.fast},
    {number: 36, name:'Clefable',   hp: 95, atk: 70, def: 73, satk: 95, sdef: 90, spd: 60, spc: 85, ex: EX.fast},
    {number: 37, name:'Vulpix',     hp: 38, atk: 41, def: 40, satk: 50, sdef: 65, spd: 65, spc: 65, ex: EX.medFast},
    {number: 38, name:'Ninetales',  hp: 73, atk: 76, def: 75, satk: 81, sdef:100, spd:100, spc:100, ex: EX.medFast},
    {number: 39, name:'Jigglypuff', hp:115, atk: 45, def: 20, satk: 45, sdef: 25, spd: 20, spc: 25, ex: EX.fast},
    {number: 40, name:'Wigglytuff', hp:140, atk: 70, def: 45, satk: 85, sdef: 50, spd: 45, spc: 50, ex: EX.fast},
    {number: 41, name:'Zubat',      hp: 40, atk: 45, def: 35, satk: 30, sdef: 40, spd: 55, spc: 40, ex: EX.medFast},
    {number: 42, name:'Golbat',     hp: 75, atk: 80, def: 70, satk: 65, sdef: 75, spd: 90, spc: 75, ex: EX.medFast},
    {number: 43, name:'Oddish',     hp: 45, atk: 50, def: 55, satk: 75, sdef: 65, spd: 30, spc: 75, ex: EX.medSlow},
    {number: 44, name:'Gloom',      hp: 60, atk: 65, def: 70, satk: 85, sdef: 75, spd: 40, spc: 85, ex: EX.medSlow},
    {number: 45, name:'Vileplume',  hp: 75, atk: 80, def: 85, satk:110, sdef: 90, spd: 50, spc:100, ex: EX.medSlow},
    {number: 46, name:'Paras',      hp: 35, atk: 70, def: 55, satk: 45, sdef: 55, spd: 25, spc: 55, ex: EX.medFast},
    {number: 47, name:'Parasect',   hp: 60, atk: 95, def: 80, satk: 60, sdef: 80, spd: 30, spc: 80, ex: EX.medFast},
    {number: 48, name:'Venonat',    hp: 60, atk: 55, def: 50, satk: 40, sdef: 55, spd: 45, spc: 40, ex: EX.medFast},
    {number: 49, name:'Venomoth',   hp: 70, atk: 65, def: 60, satk: 90, sdef: 75, spd: 90, spc: 90, ex: EX.medFast},
    {number: 50, name:'Diglett',    hp: 10, atk: 55, def: 25, satk: 35, sdef: 45, spd: 95, spc: 45, ex: EX.medFast},
    {number: 51, name:'Dugtrio',    hp: 35, atk: 80, def: 50, satk: 50, sdef: 70, spd:120, spc: 70, ex: EX.medFast},
    {number: 52, name:'Meowth',     hp: 40, atk: 45, def: 35, satk: 40, sdef: 40, spd: 90, spc: 40, ex: EX.medFast},
    {number: 53, name:'Persian',    hp: 65, atk: 70, def: 60, satk: 65, sdef: 65, spd:115, spc: 65, ex: EX.medFast},
    {number: 54, name:'Psyduck',    hp: 50, atk: 52, def: 48, satk: 65, sdef: 50, spd: 55, spc: 50, ex: EX.medFast},
    {number: 55, name:'Golduck',    hp: 80, atk: 82, def: 78, satk: 95, sdef: 80, spd: 85, spc: 80, ex: EX.medFast},
    {number: 56, name:'Mankey',     hp: 40, atk: 80, def: 35, satk: 35, sdef: 45, spd: 70, spc: 35, ex: EX.medFast},
    {number: 57, name:'Primeape',   hp: 65, atk:105, def: 60, satk: 60, sdef: 70, spd: 95, spc: 60, ex: EX.medFast},
    {number: 58, name:'Growlithe',  hp: 55, atk: 70, def: 45, satk: 70, sdef: 50, spd: 60, spc: 50, ex: EX.slow},
    {number: 59, name:'Arcanine',   hp: 90, atk:110, def: 80, satk:100, sdef: 80, spd: 95, spc: 80, ex: EX.slow},
    {number: 60, name:'Poliwag',    hp: 40, atk: 50, def: 40, satk: 40, sdef: 40, spd: 90, spc: 40, ex: EX.medSlow},
    {number: 61, name:'Poliwhirl',  hp: 65, atk: 65, def: 65, satk: 50, sdef: 50, spd: 90, spc: 50, ex: EX.medSlow},
    {number: 62, name:'Poliwrath',  hp: 90, atk: 85, def: 95, satk: 70, sdef: 90, spd: 70, spc: 70, ex: EX.medSlow},
    {number: 63, name:'Abra',       hp: 25, atk: 20, def: 15, satk:105, sdef: 55, spd: 90, spc:105, ex: EX.medSlow},
    {number: 64, name:'Kadabra',    hp: 40, atk: 35, def: 30, satk:120, sdef: 70, spd:105, spc:120, ex: EX.medSlow},
    {number: 65, name:'Alakazam',   hp: 55, atk: 50, def: 45, satk:135, sdef: 95, spd:120, spc:135, ex: EX.medSlow},
    {number: 66, name:'Machop',     hp: 70, atk: 80, def: 50, satk: 35, sdef: 35, spd: 35, spc: 35, ex: EX.medSlow},
    {number: 67, name:'Machoke',    hp: 80, atk:100, def: 70, satk: 50, sdef: 60, spd: 45, spc: 50, ex: EX.medSlow},
    {number: 68, name:'Machamp',    hp: 90, atk:130, def: 80, satk: 65, sdef: 85, spd: 55, spc: 65, ex: EX.medSlow},
    {number: 69, name:'Bellsprout', hp: 50, atk: 75, def: 35, satk: 70, sdef: 30, spd: 40, spc: 70, ex: EX.medSlow},
    {number: 70, name:'Weepinbell', hp: 65, atk: 90, def: 50, satk: 85, sdef: 45, spd: 55, spc: 85, ex: EX.medSlow},
    {number: 71, name:'Victreebel', hp: 80, atk:105, def: 65, satk:100, sdef: 70, spd: 70, spc:100, ex: EX.medSlow},
    {number: 72, name:'Tentacool',  hp: 40, atk: 40, def: 35, satk: 50, sdef:100, spd: 70, spc:100, ex: EX.slow},
    {number: 73, name:'Tentacruel', hp: 80, atk: 70, def: 65, satk: 80, sdef:120, spd:100, spc:120, ex: EX.slow},
    {number: 74, name:'Geodude',    hp: 40, atk: 80, def:100, satk: 30, sdef: 30, spd: 20, spc: 30, ex: EX.medSlow},
    {number: 75, name:'Graveler',   hp: 55, atk: 95, def:115, satk: 45, sdef: 45, spd: 35, spc: 45, ex: EX.medSlow},
    {number: 76, name:'Golem',      hp: 80, atk:110, def:130, satk: 55, sdef: 65, spd: 45, spc: 55, ex: EX.medSlow},
    {number: 77, name:'Ponyta',     hp: 50, atk: 85, def: 55, satk: 1, sdef: 1, spd: 90, spc: 65, ex: EX.medFast},
    {number: 78, name:'Rapidash',   hp: 65, atk:100, def: 70, satk: 1, sdef: 1, spd:105, spc: 80, ex: EX.medFast},
    {number: 79, name:'Slowpoke',   hp: 90, atk: 65, def: 65, satk: 1, sdef: 1, spd: 15, spc: 40, ex: EX.medFast},
    {number: 80, name:'Slowbro',    hp: 95, atk: 75, def:110, satk: 1, sdef: 1, spd: 30, spc: 80, ex: EX.medFast},
    {number: 81, name:'Magnemite',  hp: 25, atk: 35, def: 70, satk: 1, sdef: 1, spd: 45, spc: 95, ex: EX.medFast},
    {number: 82, name:'Magneton',   hp: 50, atk: 60, def: 95, satk: 1, sdef: 1, spd: 70, spc:120, ex: EX.medFast},
    {number: 83, name:'Farfetch’d', hp: 52, atk: 65, def: 55, satk: 1, sdef: 1, spd: 60, spc: 58, ex: EX.medFast},
    {number: 84, name:'Doduo',      hp: 35, atk: 85, def: 45, satk: 1, sdef: 1, spd: 75, spc: 35, ex: EX.medFast},
    {number: 85, name:'Dodrio',     hp: 60, atk:110, def: 70, satk: 1, sdef: 1, spd:100, spc: 60, ex: EX.medFast},
    {number: 86, name:'Seel',       hp: 65, atk: 45, def: 55, satk: 1, sdef: 1, spd: 45, spc: 70, ex: EX.medFast},
    {number: 87, name:'Dewgong',    hp: 90, atk: 70, def: 80, satk: 1, sdef: 1, spd: 70, spc: 95, ex: EX.medFast},
    {number: 88, name:'Grimer',     hp: 80, atk: 80, def: 50, satk: 1, sdef: 1, spd: 25, spc: 40, ex: EX.medFast},
    {number: 89, name:'Muk',        hp:105, atk:105, def: 75, satk: 1, sdef: 1, spd: 50, spc: 65, ex: EX.medFast},
    {number: 90, name:'Shellder',   hp: 30, atk: 65, def:100, satk: 1, sdef: 1, spd: 40, spc: 45, ex: EX.slow},
    {number: 91, name:'Cloyster',   hp: 50, atk: 95, def:180, satk: 1, sdef: 1, spd: 70, spc: 85, ex: EX.slow},
    {number: 92, name:'Gastly',     hp: 30, atk: 35, def: 30, satk: 1, sdef: 1, spd: 80, spc:100, ex: EX.medSlow},
    {number: 93, name:'Haunter',    hp: 45, atk: 50, def: 45, satk: 1, sdef: 1, spd: 95, spc:115, ex: EX.medSlow},
    {number: 94, name:'Gengar',     hp: 60, atk: 65, def: 60, satk: 1, sdef: 1, spd:110, spc:130, ex: EX.medSlow},
    {number: 95, name:'Onix',       hp: 35, atk: 45, def:160, satk: 1, sdef: 1, spd: 70, spc: 30, ex: EX.medFast},
    {number: 96, name:'Drowzee',    hp: 60, atk: 48, def: 45, satk: 1, sdef: 1, spd: 42, spc: 90, ex: EX.medFast},
    {number: 97, name:'Hypno',      hp: 85, atk: 73, def: 70, satk: 1, sdef: 1, spd: 67, spc:115, ex: EX.medFast},
    {number: 98, name:'Krabby',     hp: 30, atk:105, def: 90, satk: 1, sdef: 1, spd: 50, spc: 25, ex: EX.medFast},
    {number: 99, name:'Kingler',    hp: 55, atk:130, def:115, satk: 1, sdef: 1, spd: 75, spc: 50, ex: EX.medFast},
    {number: 100, name:'Voltorb',   hp: 40, atk: 30, def: 50, satk: 1, sdef: 1, spd:100, spc: 55, ex: EX.medFast},
    {number: 101, name:'Electrode', hp: 60, atk: 50, def: 70, satk: 1, sdef: 1, spd:140, spc: 80, ex: EX.medFast},
    {number: 102, name:'Exeggcute', hp: 60, atk: 40, def: 80, satk: 1, sdef: 1, spd: 40, spc: 60, ex: EX.slow},
    {number: 103, name:'Exeggutor', hp: 95, atk: 95, def: 85, satk: 1, sdef: 1, spd: 55, spc:125, ex: EX.slow},
    {number: 104, name:'Cubone',    hp: 50, atk: 50, def: 95, satk: 1, sdef: 1, spd: 35, spc: 40, ex: EX.medFast},
    {number: 105, name:'Marowak',   hp: 60, atk: 80, def:110, satk: 1, sdef: 1, spd: 45, spc: 50, ex: EX.medFast},
    {number: 106, name:'Hitmonlee', hp: 50, atk:120, def: 53, satk: 1, sdef: 1, spd: 87, spc: 35, ex: EX.medFast},
    {number: 107, name:'Hitmonchan',hp: 50, atk:105, def: 79, satk: 1, sdef: 1, spd: 76, spc: 35, ex: EX.medFast},
    {number: 108, name:'Lickitung', hp: 90, atk: 55, def: 75, satk: 1, sdef: 1, spd: 30, spc: 60, ex: EX.medFast},
    {number: 109, name:'Koffing',   hp: 40, atk: 65, def: 95, satk: 1, sdef: 1, spd: 35, spc: 60, ex: EX.medFast},
    {number: 110, name:'Weezing',   hp: 65, atk: 90, def:120, satk: 1, sdef: 1, spd: 60, spc: 85, ex: EX.medFast},
    {number: 111, name:'Rhyhorn',   hp: 80, atk: 85, def: 95, satk: 1, sdef: 1, spd: 25, spc: 30, ex: EX.slow},
    {number: 112, name:'Rhydon',    hp:105, atk:130, def:120, satk: 1, sdef: 1, spd: 40, spc: 45, ex: EX.slow},
    {number: 113, name:'Chansey',   hp:250, atk:  5, def:  5, satk: 1, sdef: 1, spd: 50, spc:105, ex: EX.fast},
    {number: 114, name:'Tangela',   hp: 65, atk: 55, def:115, satk: 1, sdef: 1, spd: 60, spc:100, ex: EX.medFast},
    {number: 115, name:'Kangaskhan',hp:105, atk: 95, def: 80, satk: 1, sdef: 1, spd: 90, spc: 40, ex: EX.medFast},
    {number: 116, name:'Horsea',    hp: 30, atk: 40, def: 70, satk: 1, sdef: 1, spd: 60, spc: 70, ex: EX.medFast},
    {number: 117, name:'Seadra',    hp: 55, atk: 65, def: 95, satk: 1, sdef: 1, spd: 85, spc: 95, ex: EX.medFast},
    {number: 118, name:'Goldeen',   hp: 45, atk: 67, def: 60, satk: 1, sdef: 1, spd: 63, spc: 50, ex: EX.medFast},
    {number: 119, name:'Seaking',   hp: 80, atk: 92, def: 65, satk: 1, sdef: 1, spd: 68, spc: 80, ex: EX.medFast},
    {number: 120, name:'Staryu',    hp: 30, atk: 45, def: 55, satk: 1, sdef: 1, spd: 85, spc: 70, ex: EX.slow},
    {number: 121, name:'Starmie',   hp: 60, atk: 75, def: 85, satk: 1, sdef: 1, spd:115, spc:100, ex: EX.slow},
    {number: 122, name:'Mr. Mime',  hp: 40, atk: 45, def: 65, satk: 1, sdef: 1, spd: 90, spc:100, ex: EX.medFast},
    {number: 123, name:'Scyther',   hp: 70, atk:110, def: 80, satk: 1, sdef: 1, spd:105, spc: 55, ex: EX.medFast},
    {number: 124, name:'Jynx',      hp: 65, atk: 50, def: 35, satk: 1, sdef: 1, spd: 95, spc: 95, ex: EX.medFast},
    {number: 125, name:'Electabuzz',hp: 65, atk: 83, def: 57, satk: 1, sdef: 1, spd:105, spc: 85, ex: EX.medFast},
    {number: 126, name:'Magmar',    hp: 65, atk: 95, def: 57, satk: 1, sdef: 1, spd: 93, spc: 85, ex: EX.medFast},
    {number: 127, name:'Pinsir',    hp: 65, atk:125, def:100, satk: 1, sdef: 1, spd: 85, spc: 55, ex: EX.slow},
    {number: 128, name:'Tauros',    hp: 75, atk:100, def: 95, satk: 1, sdef: 1, spd:110, spc: 70, ex: EX.slow},
    {number: 129, name:'Magikarp',  hp: 20, atk: 10, def: 55, satk: 1, sdef: 1, spd: 80, spc: 20, ex: EX.slow},
    {number: 130, name:'Gyarados',  hp: 95, atk:125, def: 79, satk: 1, sdef: 1, spd: 81, spc:100, ex: EX.slow},
    {number: 131, name:'Lapras',    hp:130, atk: 85, def: 80, satk: 1, sdef: 1, spd: 60, spc: 95, ex: EX.slow},
    {number: 132, name:'Ditto',     hp: 48, atk: 48, def: 48, satk: 1, sdef: 1, spd: 48, spc: 48, ex: EX.medFast},
    {number: 133, name:'Eevee',     hp: 55, atk: 55, def: 50, satk: 1, sdef: 1, spd: 55, spc: 65, ex: EX.medFast},
    {number: 134, name:'Vaporeon',  hp:130, atk: 65, def: 60, satk: 1, sdef: 1, spd: 65, spc:110, ex: EX.medFast},
    {number: 135, name:'Jolteon',   hp: 65, atk: 65, def: 60, satk: 1, sdef: 1, spd:130, spc:110, ex: EX.medFast},
    {number: 136, name:'Flareon',   hp: 65, atk:130, def: 60, satk: 1, sdef: 1, spd: 65, spc:110, ex: EX.medFast},
    {number: 137, name:'Porygon',   hp: 65, atk: 60, def: 70, satk: 1, sdef: 1, spd: 40, spc: 75, ex: EX.medFast},
    {number: 138, name:'Omanyte',   hp: 35, atk: 40, def:100, satk: 1, sdef: 1, spd: 35, spc: 90, ex: EX.medFast},
    {number: 139, name:'Omastar',   hp: 70, atk: 60, def:125, satk: 1, sdef: 1, spd: 55, spc:115, ex: EX.medFast},
    {number: 140, name:'Kabuto',    hp: 30, atk: 80, def: 90, satk: 1, sdef: 1, spd: 55, spc: 45, ex: EX.medFast},
    {number: 141, name:'Kabutops',  hp: 60, atk:115, def:105, satk: 1, sdef: 1, spd: 80, spc: 70, ex: EX.medFast},
    {number: 142, name:'Aerodactyl',hp: 80, atk:105, def: 65, satk: 1, sdef: 1, spd:130, spc: 60, ex: EX.slow},
    {number: 143, name:'Snorlax',   hp:160, atk:110, def: 65, satk: 1, sdef: 1, spd: 30, spc: 65, ex: EX.slow},
    {number: 144, name:'Articuno',  hp: 90, atk: 85, def:100, satk: 1, sdef: 1, spd: 85, spc:125, ex: EX.slow},
    {number: 145, name:'Zapdos',    hp: 90, atk: 90, def: 85, satk: 1, sdef: 1, spd:100, spc:125, ex: EX.slow},
    {number: 146, name:'Moltres',   hp: 90, atk:100, def: 90, satk: 1, sdef: 1, spd: 90, spc:125, ex: EX.slow},
    {number: 147, name:'Dratini',   hp: 41, atk: 64, def: 45, satk: 1, sdef: 1, spd: 50, spc: 50, ex: EX.slow},
    {number: 148, name:'Dragonair', hp: 61, atk: 84, def: 65, satk: 1, sdef: 1, spd: 70, spc: 70, ex: EX.slow},
    {number: 149, name:'Dragonite', hp: 91, atk:134, def: 95, satk: 1, sdef: 1, spd: 80, spc:100, ex: EX.slow},
    {number: 150, name:'Mewtwo',    hp:106, atk:110, def: 90, satk: 1, sdef: 1, spd:130, spc:154, ex: EX.slow},
    {number: 151, name:'Mew',       hp:100, atk:100, def:100, satk: 1, sdef: 1, spd:100, spc:100, ex: EX.medSlow}
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

const INDEX_TO_MOVE = [
    null, //0x00 -- there's no move at index 0
    {name:"Pound",          pp:35}, //0x01
    {name:"Karate Chop",    pp:25}, //0x02
    {name:"Double Slap",    pp:10}, //0x03
    {name:"Comet Punch",    pp:15}, //0x04
    {name:"Mega Punch",     pp:20}, //0x05
    {name:"Pay Day",        pp:20}, //0x06
    {name:"Fire Punch",     pp:15}, //0x07
    {name:"Ice Punch",      pp:15}, //0x08
    {name:"Thunder Punch",  pp:15}, //0x09
    {name:"Scratch",        pp:35}, //0x0A - 10
    {name:"Vise Grip",      pp:30}, //0x0B
    {name:"Guillotine",     pp: 5}, //0x0C
    {name:"Razor Wind",     pp:10}, //0x0D
    {name:"Swords Dance",   pp:30}, //0x0E
    {name:"Cut",            pp:30}, //0x0F - 15
    {name:"Gust",           pp:35}, //0x10
    {name:"Wing Attack",    pp:35}, //0x11
    {name:"Whirlwind",      pp:20}, //0x12
    {name:"Fly",            pp:15}, //0x13
    {name:"Bind",           pp:20}, //0x14 - 20
    {name:"Slam",           pp:20}, //0x15
    {name:"Vine Whip",      pp:10}, //0x16
    {name:"Stomp",          pp:20}, //0x17
    {name:"Double Kick",    pp:30}, //0x18
    {name:"Mega Kick",      pp:5}, //0x19 - 25
    {name:"Jump Kick",      pp:25}, //0x1A
    {name:"Rolling Kick",   pp:15}, //0x1B
    {name:"Sand Attack",    pp:15}, //0x1C
    {name:"Headbutt",       pp:15}, //0x1D
    {name:"Horn Attack",    pp:25}, //0x1E - 30
    {name:"Fury Attack",    pp:20}, //0x1F
    {name:"Horn Drill",     pp: 5}, //0x20
    {name:"Tackle",         pp:35}, //0x21
    {name:"Body Slam",      pp:15}, //0x22
    {name:"Wrap",           pp:20}, //0x23 - 35
    {name:"Take Down",      pp:20}, //0x24
    {name:"Thrash",         pp:20}, //0x25
    {name:"Double-Edge",    pp:15}, //0x26
    {name:"Tail Whip",      pp:30}, //0x27
    {name:"Poison Sting",   pp:35}, //0x28 - 40
    {name:"Twineedle",      pp:20}, //0x29
    {name:"Pin Missile",    pp:20}, //0x2A
    {name:"Leer",           pp:30}, //0x2B
    {name:"Bite",           pp:25}, //0x2C
    {name:"Growl",          pp:40}, //0x2D - 45
    {name:"Roar",           pp:20}, //0x2E
    {name:"Sing",           pp:15}, //0x2F
    {name:"Supersonic",     pp:20}, //0x30
    {name:"Sonic Boom",     pp:20}, //0x31
    {name:"Disable",        pp:20}, //0x32 - 50
    {name:"Acid",           pp:30}, //0x33
    {name:"Ember",          pp:25}, //0x34
    {name:"Flamethrower",   pp:15}, //0x35
    {name:"Mist",           pp:30}, //0x36
    {name:"Water Gun",      pp:25}, //0x37 - 55
    {name:"Hydro Pump",     pp: 5}, //0x38
    {name:"Surf",           pp:15}, //0x39
    {name:"Ice Beam",       pp:10}, //0x3A
    {name:"Blizzard",       pp: 5}, //0x3B
    {name:"Psybeam",        pp:20}, //0x3C - 60
    {name:"Bubble Beam",    pp:20}, //0x3D
    {name:"Aurora Beam",    pp:20}, //0x3E
    {name:"Hyper Beam",     pp: 5}, //0x3F
    {name:"Peck",           pp:35}, //0x40
    {name:"Drill Peck",     pp:20}, //0x41 - 65
    {name:"Submission",     pp:25}, //0x42 
    {name:"Low Kick",       pp:20}, //0x43
    {name:"Counter",        pp:20}, //0x44
    {name:"Seismic Toss",   pp:20}, //0x45
    {name:"Strength",       pp:15}, //0x46 - 70
    {name:"Absorb",         pp:20}, //0x47
    {name:"Mega Drain",     pp:10}, //0x48
    {name:"Leech Seed",     pp:10}, //0x49
    {name:"Growth",         pp:40}, //0x4A
    {name:"Razor Leaf",     pp:25}, //0x4B - 75
    {name:"Solar Beam",     pp:10}, //0x4C
    {name:"Poison Powder",  pp:35}, //0x4D
    {name:"Stun Spore",     pp:30}, //0x4E
    {name:"Sleep Powder",   pp:15}, //0x4F
    {name:"Petal Dance",    pp:20}, //0x50 - 80
    {name:"String Shot",    pp:40}, //0x51
    {name:"Dragon Rage",    pp:10}, //0x52
    {name:"Fire Spin",      pp:15}, //0x53
    {name:"Thunder Shock",  pp:30}, //0x54
    {name:"Thunderbolt",    pp:15}, //0x55 - 85
    {name:"Thunder Wave",   pp:20}, //0x56
    {name:"Thunder",        pp:10}, //0x57
    {name:"Rock Throw",     pp:15}, //0x58
    {name:"Earthquake",     pp:10}, //0x59
    {name:"Fissure",        pp: 5}, //0x5A - 90
    {name:"Dig",            pp:10}, //0x5B
    {name:"Toxic",          pp:10}, //0x5C
    {name:"Confusion",      pp:25}, //0x5D
    {name:"Psychic",        pp:10}, //0x5E
    {name:"Hypnosis",       pp:20}, //0x5F - 95
    {name:"Meditate",       pp:40}, //0x60
    {name:"Agility",        pp:30}, //0x61
    {name:"Quick Attack",   pp:30}, //0x62
    {name:"Rage",           pp:20}, //0x63
    {name:"Teleport",       pp:20}, //0x64 - 100
    {name:"Night Shade",    pp:15}, //0x65
    {name:"Mimic",          pp:10}, //0x66
    {name:"Screech",        pp:40}, //0x67
    {name:"Double Team",    pp:15}, //0x68
    {name:"Recover",        pp:20}, //0x69 - 105
    {name:"Harden",         pp:30}, //0x6A
    {name:"Minimize",       pp:20}, //0x6B
    {name:"Smokescreen",    pp:20}, //0x6C
    {name:"Confuse Ray",    pp:10}, //0x6D
    {name:"Withdraw",       pp:40}, //0x6E - 110
    {name:"Defense Curl",   pp:40}, //0x6F
    {name:"Barrier",        pp:30}, //0x70
    {name:"Light Screen",   pp:30}, //0x71
    {name:"Haze",           pp:30}, //0x72
    {name:"Reflect",        pp:20}, //0x73 - 115
    {name:"Focus Energy",   pp:30}, //0x74
    {name:"Bide",           pp:10}, //0x75
    {name:"Metronome",      pp:10}, //0x76
    {name:"Mirror Move",    pp:20}, //0x77
    {name:"Self-Destruct",  pp: 5}, //0x78 - 120
    {name:"Egg Bomb",       pp:10}, //0x79
    {name:"Lick",           pp:30}, //0x7A
    {name:"Smog",           pp:20}, //0x7B
    {name:"Sludge",         pp:20}, //0x7C
    {name:"Bone Club",      pp:20}, //0x7D - 125
    {name:"Fire Blast",     pp: 5}, //0x7E
    {name:"Waterfall",      pp:15}, //0x7F
    {name:"Clamp",          pp:10}, //0x80
    {name:"Swift",          pp:20}, //0x81
    {name:"Skull Bash",     pp:15}, //0x82 - 130
    {name:"Spike Cannon",   pp:15}, //0x83
    {name:"Constrict",      pp:35}, //0x84
    {name:"Amnesia",        pp:20}, //0x85
    {name:"Kinesis",        pp:15}, //0x86
    {name:"Soft-Boiled",    pp:10}, //0x87 - 135
    {name:"High Jump Kick", pp:20}, //0x88
    {name:"Glare",          pp:30}, //0x89
    {name:"Dream Eater",    pp:15}, //0x8A
    {name:"Poison Gas",     pp:40}, //0x8B
    {name:"Barrage",        pp:20}, //0x8C - 140
    {name:"Leech Life",     pp:15}, //0x8D
    {name:"Lovely Kiss",    pp:10}, //0x8E
    {name:"Sky Attack",     pp: 5}, //0x8F
    {name:"Transform",      pp:10}, //0x90
    {name:"Bubble",         pp:30}, //0x91 - 145
    {name:"Dizzy Punch",    pp:10}, //0x92
    {name:"Spore",          pp:15}, //0x93
    {name:"Flash",          pp:20}, //0x94
    {name:"Psywave",        pp:15}, //0x95
    {name:"Splash",         pp:40}, //0x96 - 150
    {name:"Acid Armor",     pp:40}, //0x97
    {name:"Crabhammer",     pp:10}, //0x98
    {name:"Explosion",      pp: 5}, //0x99
    {name:"Fury Swipes",    pp:15}, //0x9A
    {name:"Bonemerang",     pp:10}, //0x9B - 155
    {name:"Rest",           pp:10}, //0x9C
    {name:"Rock Slide",     pp:10}, //0x9D
    {name:"Hyper Fang",     pp:15}, //0x9E
    {name:"Sharpen",        pp:30}, //0x9F
    {name:"Conversion",     pp:30}, //0xA0 - 160
    {name:"Tri Attack",     pp:10}, //0xA1
    {name:"Super Fang",     pp:10}, //0xA2
    {name:"Slash",          pp:20}, //0xA3
    {name:"Substitue",      pp:10}, //0xA4
    {name:"Struggle",       pp:10}, //0xA5 - 165
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
