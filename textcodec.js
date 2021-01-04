

const TERMINATING_CHAR = 0x50;
class TextCodec {

    constructor (decodingTable) {
        this.decodingTable = decodingTable;
        this.terminatingChar = TERMINATING_CHAR;
    }

    get encodingTable() {
        if (this.$$$encodingTable === undefined) {
            this.$$$encodingTable = new Map();
            for (let x = 0; x < this.decodingTable.length; ++x) {
                for (let y = 0; y < this.decodingTable[x].length; ++y) {
                    const value = (x * 0x10) + y;
                    this.$$$encodingTable.set(this.decodingTable[x][y], value);
                }
            }
        }
        return this.$$$encodingTable;
    }

    isTerminating(value) {
        return value == TERMINATING_CHAR;
    }

    decode(value){
        const result = this.decodingTable[value >> 4][ value & 0x0F];
        return result  || '�';
    }

    encode (text, max) {
        const result = [];
        for (const c of text) {
            if (result.length === max){
                return result;
            } else {
                if (this.encodingTable.has(c)) {
                    result.push(this.encodingTable.get(c));
                } else {
                    result.push(0x80); //'A'
                }
            }
        }
        return result;
    }
}

const ENGLISH_ENCODING = [
    [], // 0-
    [], // 1-
    [], // 2-
    [], // 3-
    [], // 4-
    [], // 5-
    ['A','B','C','D','E','F','G','H','I','J','K','L','M',':','ぃ','ぅ'], // 6-
    ['‘','’','“','”','・','⋯','ぁ','ぇ','ぉ','□','□','□','□','□','□',' '], // 7-
    ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'], // 8-
    ['Q','R','S','T','U','V','W','X','Y','Z','(',')',':',';','[',']'], // 9-
    ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'], // A-
    ['q','r','s','t','u','v','w','x','y','z','é', '\'d','\'l','\'s','\'t','\'v'], // B-
    [], // C-
    [], // D-
    ['\'','ᴾₖ','ᴹₙ','-','\'r','\'m','?','!','.','ァ','ゥ','ェ','▷','▶','▼','♂',], // E-
    ['¥','×','.','/',',','♀','0','1','2','3','4','5','6','7','8','9',]  // F-
];



const JAPANESE_ENCODING = [
    [null,'イ゙','ヴ','エ゙','オ゙','ガ','ギ','グ','ゲ','ゴ','ザ','ジ','ズ','ゼ','ゾ','ダ'], // 0-
    ['ヂ','ヅ','デ','ド','ナ゙','ニ゙','ヌ゙','ネ゙','ノ゙','バ','ビ','ブ','ボ','マ゙','ミ゙','ム゙'], // 1-
    ['ィ゙','あ゙','い゙','ゔ','え゙','お゙','が','ぎ','ぐ','げ','ご','ざ','じ','ず','ぜ','ぞ'], // 2-
    ['だ','ぢ','づ','で','ど','な゙','に゙','ぬ゙','ね゙','の゙','ば','び','ぶ','べ','ぼ','ま゙'], // 3-
    ['パ','ピ','プ','ポ','ぱ','ぴ','ぷ','ぺ','ぽ','ま゚','□','□','□','も゚'], // 4-
    [], // 5-
    ['A','B','C','D','E','F','G','H','I','V','S','L','M','：','ぃ','ぅ'], // 6-
    ['「','」','『','』','・','…','ぁ','ぇ','ぉ','□','□','□','□','□','□','□'],  // 7-
    ['ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ','タ'],  // 8-
    ['チ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ホ','マ','ミ','ム'], // 9-
    ['メ','モ','ヤ','ユ','ヨ','ラ','ル','レ','ロ','ワ','ヲ','ン','ッ','ャ','ュ','ョ'], // A-
    ['ィ','あ','い','う','え','お','か','き','く','け','こ','さ','し','す','せ','そ'], // B-
    ['た','ち','つ','て','と','な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ','ま'], // C-
    ['み','む','め','も','や','ゆ','よ','ら','り','る','れ','ろ','わ','を','ん','っ'], // D-
    ['ゃ','ゅ','ょ','ー','゜','゛', '?','!', '', '。','ァ','ゥ','ェ','▷','▶','▼','♂'], // E-
    ['円','×','.','/','ォ','♀','0','1','2','3','4','5','6','7','8','9'], // F-
];


const FRENCH_GERMAN_ENCODING = [
    [], // 0_
    [], // 1_
    [], // 2_
    [], // 3_
    [], // 4_
    [], // 5_
    [], // 6_
    [], // 7_
    ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'],
    ['Q','R','S','T','U','V','W','X','Y','Z','(',')',':',';','[',']'],
    ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'],
    ['q','r','s','t','u','v','w','x','y','z','à','è','é','ù','ß','ç'],
    ['Ä','Ö','Ü','ä','ö','ü','ë','ï','â','ô','û','ê','î','□','□','□'],
    ['□','□','□','□','c\'','d\'','j\'','l\'','m\'','n\'','p\'','s\'','\'s','t\'','u\'','y\''],
    ['\'','ᴾₖ','ᴹₙ','-','+','□','?','!','.','ァ','ゥ','ェ','▷','▶','▼','♂'],
    ['¥','×','.','/',',','♀','0','1','2','3','4','5','6','7','8','9']
];

const ITALIAN_SPANISH_ENCODING = [
    [], // 0_
    [], // 1_
    [], // 2_
    [], // 3_
    [], // 4_
    [], // 5_
    ['A','B','C','D','E','F','G','H','I','V','S','L','M',':','ぃ','ぅ'], // 6_
    ['‘','’','“','”','・','⋯','ぁ','ぇ','ぉ','□','□','□','□','□','□','□'], // 7_
    ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'], // 8_
    ['Q','R','S','T','U','V','W','X','Y','Z','(',')',':',';','[',']'], // 9_
    ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'], // A_
    ['q','r','s','t','u','v','w','x','y','z','à','è','é','ù','À','Á'], // B_
    ['Ä','Ö','Ü','ä','ö','ü','È','É','Ì','Í','Ñ','Ò','Ó','Ù','Ú','á'], // C_
    ['ì','í','ñ','ò','ó','ú','º','&','\'d','\'l','\'m','\'r','\'s','\'t','\'v', ' '], // D_
    ['\'','ᴾₖ','ᴹₙ','-','¿','¡','?','!','.','ァ','ゥ','ェ','▷','▶','▼','♂'], // E_
    ['¥','×','.','/',',','♀','0','1','2','3','4','5','6','7','8','9'] // F_
]

const AMERICA_TEXT_CODEC = new TextCodec(ENGLISH_ENCODING);
const JAPAN_TEXT_CODEC = new TextCodec(JAPANESE_ENCODING);
const ITALIAN_SPANISH_CODEC = new TextCodec(ITALIAN_SPANISH_ENCODING);
const FRENCH_GERMAN_CODEC = new TextCodec(FRENCH_GERMAN_ENCODING);


