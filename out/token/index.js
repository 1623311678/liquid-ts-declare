"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-constant-condition */
const CODE_POINTS = {
    EOF: -1,
    NULL: 0x00,
    TABULATION: 0x09,
    CARRIAGE_RETURN: 0x0d,
    LINE_FEED: 0x0a,
    FORM_FEED: 0x0c,
    SPACE: 0x20,
    EXCLAMATION_MARK: 0x21,
    QUOTATION_MARK: 0x22,
    NUMBER_SIGN: 0x23,
    AMPERSAND: 0x26,
    APOSTROPHE: 0x27,
    HYPHEN_MINUS: 0x2d,
    SOLIDUS: 0x2f,
    DIGIT_0: 0x30,
    DIGIT_9: 0x39,
    SEMICOLON: 0x3b,
    LESS_THAN_SIGN: 0x3c,
    EQUALS_SIGN: 0x3d,
    GREATER_THAN_SIGN: 0x3e,
    QUESTION_MARK: 0x3f,
    LATIN_CAPITAL_A: 0x41,
    LATIN_CAPITAL_F: 0x46,
    LATIN_CAPITAL_X: 0x58,
    LATIN_CAPITAL_Z: 0x5a,
    RIGHT_SQUARE_BRACKET: 0x5d,
    GRAVE_ACCENT: 0x60,
    LATIN_SMALL_A: 0x61,
    LATIN_SMALL_F: 0x66,
    LATIN_SMALL_X: 0x78,
    LATIN_SMALL_Z: 0x7a,
    REPLACEMENT_CHARACTER: 0xfffd,
    COLON: 0x3a,
    COMMA: 0x2c, //,
};
var STATE;
(function (STATE) {
    STATE["NAME_START"] = "NAME_START";
    STATE["NAME_PROCESS"] = "NAME_PROCESS";
    STATE["NAME_END"] = "NAME_END";
    STATE["VALUE_START"] = "VALUE_START";
    STATE["VALUE_PROCESS"] = "VALUE_PROCESS";
    STATE["VALUE_END"] = "VALUE_END";
})(STATE || (STATE = {}));
class Token {
    constructor(codeString) {
        this.codeString = "";
        this.curPos = 0;
        this.state = STATE.NAME_START;
        this.currentName = "";
        this.map = {};
        this.codeString = codeString;
    }
    isLegal(cp) {
        return this.isAsciiLetter(cp) || this.isNumber(cp);
    }
    isAsciiLetter(cp) {
        return this.isAsciiLower(cp) || this.isAsciiUpper(cp);
    }
    isAsciiUpper(cp) {
        return (cp >= CODE_POINTS.LATIN_CAPITAL_A && cp <= CODE_POINTS.LATIN_CAPITAL_Z);
    }
    isNumber(cp) {
        return cp >= CODE_POINTS.DIGIT_0 && cp <= CODE_POINTS.DIGIT_9;
    }
    isAsciiLower(cp) {
        return cp >= CODE_POINTS.LATIN_SMALL_A && cp <= CODE_POINTS.LATIN_SMALL_Z;
    }
    consume() {
        const str = this.codeString[this.curPos];
        this.curPos += 1;
        return str.charCodeAt(0);
    }
    updateState(state) {
        this.state = state;
    }
    toChar(cNum) {
        if (cNum <= 0xffff) {
            return String.fromCharCode(cNum);
        }
        cNum -= 0x10000;
        return (String.fromCharCode(((cNum >>> 10) & 0x3ff) | 0xd800) +
            String.fromCharCode(0xdc00 | (cNum & 0x3ff)));
    }
    execute(state, cp) {
        switch (state) {
            case STATE.NAME_START: {
                this.NAME_START(cp);
                break;
            }
            case STATE.NAME_PROCESS: {
                this.NAME_PROCESS();
                break;
            }
            case STATE.NAME_END: {
                this.NAME_END(cp);
                break;
            }
            case STATE.VALUE_START: {
                this.VALUE_START(cp);
                break;
            }
            case STATE.VALUE_PROCESS: {
                this.VALUE_PROCESS();
                break;
            }
            case STATE.VALUE_END: {
                this.VALUE_END(cp);
                break;
            }
        }
    }
    NAME_START(cp) {
        if (cp === CODE_POINTS.COLON) {
            this.updateState(STATE.NAME_END);
            this.curPos -= 1;
        }
        else if (this.isLegal(cp)) {
            this.currentName += this.toChar(cp);
        }
    }
    NAME_PROCESS() { }
    NAME_END(cp) {
        if (cp === CODE_POINTS.COLON) {
            this.map[this.currentName] = "";
            this.updateState(STATE.VALUE_START);
        }
    }
    VALUE_START(cp) {
        if (cp === CODE_POINTS.COMMA) {
            this.curPos -= 1;
            this.updateState(STATE.VALUE_END);
        }
        else {
            this.map[this.currentName] += this.toChar(cp);
        }
    }
    VALUE_PROCESS() { }
    VALUE_END(cp) {
        if (cp === CODE_POINTS.COMMA) {
            this.currentName = "";
            this.updateState(STATE.NAME_START);
        }
    }
    getDeclareMap() {
        while (this.curPos < this.codeString.length) {
            const consumeStr = this.consume();
            this.execute(this.state, consumeStr);
        }
        if (this.curPos === this.codeString.length) {
            this.currentName = "";
            this.updateState(STATE.NAME_START);
            return this.map;
        }
    }
}
exports.Token = Token;
//# sourceMappingURL=index.js.map