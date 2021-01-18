
class BinaryFile {
    constructor(array, codec) {
        this.array = array;
        this.codec = codec;
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

    getDelimitedString (startPos, maxLength) {
        const endPos = this.findStringLength(startPos, maxLength);
        return this.getString(startPos, endPos);
    }

    setString (startPos, newValue, max) {
        const result = this.codec.encode(newValue, max - 1); // one space for term.
        for (let i = 0; i < result.length; i++) {
            this.array[startPos + i] = result[i];
        }
        this.array[startPos + result.length] = codec.terminatingChar;
    }

    findStringLength (startPos, max)  {
        let offset = 0;
        while (offset + startPos < this.array.length) {
            if (this.codec.isTerminating(this.array[offset + startPos ])) {
                if (max !== undefined && offset > max) {
                    return max + startPos;
                }
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

    getHiNibOf(pos) {
        return this.array[pos] >> 4;
    }

    getLoNibOf(pos) {
        return this.array[pos] & 0x0F;
    }

    getHiNib(byte) {
        return byte >> 4;
    }

    getLoNib(byte) {
        return byte & 0x0F;
    }

    getUint8(position) {
        return this.array[position];
    }

    setUint8(position, value){
        this.array[position] = value;
    }

    getUint16 (position) {
        return this.getNumber(position, 2);
    }

    getUint24 (position) {
        return this.getNumber(position, 3);
    }

    getNumber (startPos, length) {
        let result = 0;
        for (let i = 0; i < length; ++i) {
            const byte = this.array[ startPos + i];
            result += (byte  << ((length - i - 1) * 8));
        }
        return result;
    }

    getChecksum(startPos, endPos) {
        let sum = 0;
        for (let i = startPos; i <= endPos; i++){
            sum = (this.array[i] + sum) & 0xFF;
        }
        sum = (~sum) & 0xFF;
        return sum;
    }
}