"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-constant-condition */
var CODE_POINTS = {
    DIGIT_0: 0x30,
    DIGIT_9: 0x39,
    LATIN_CAPITAL_A: 0x41,
    LATIN_CAPITAL_Z: 0x5a,
    LATIN_SMALL_A: 0x61,
    LATIN_SMALL_Z: 0x7a,
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
var Token = /** @class */ (function () {
    function Token(codeString) {
        this.codeString = "";
        this.curPos = 0;
        this.state = STATE.NAME_START;
        this.currentName = "";
        this.map = {};
        this.codeString = codeString;
    }
    Token.prototype.isLegal = function (cp) {
        return this.isAsciiLetter(cp) || this.isNumber(cp);
    };
    Token.prototype.isAsciiLetter = function (cp) {
        return this.isAsciiLower(cp) || this.isAsciiUpper(cp);
    };
    Token.prototype.isAsciiUpper = function (cp) {
        return (cp >= CODE_POINTS.LATIN_CAPITAL_A && cp <= CODE_POINTS.LATIN_CAPITAL_Z);
    };
    Token.prototype.isNumber = function (cp) {
        return cp >= CODE_POINTS.DIGIT_0 && cp <= CODE_POINTS.DIGIT_9;
    };
    Token.prototype.isAsciiLower = function (cp) {
        return cp >= CODE_POINTS.LATIN_SMALL_A && cp <= CODE_POINTS.LATIN_SMALL_Z;
    };
    Token.prototype.consume = function () {
        var str = this.codeString[this.curPos];
        this.curPos += 1;
        return str.charCodeAt(0);
    };
    Token.prototype.updateState = function (state) {
        this.state = state;
    };
    Token.prototype.toChar = function (cNum) {
        if (cNum <= 0xffff) {
            return String.fromCharCode(cNum);
        }
        cNum -= 0x10000;
        return (String.fromCharCode(((cNum >>> 10) & 0x3ff) | 0xd800) +
            String.fromCharCode(0xdc00 | (cNum & 0x3ff)));
    };
    Token.prototype.execute = function (state, cp) {
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
    };
    Token.prototype.NAME_START = function (cp) {
        if (cp === CODE_POINTS.COLON) {
            this.updateState(STATE.NAME_END);
            this.curPos -= 1;
        }
        else if (this.isLegal(cp)) {
            this.currentName += this.toChar(cp);
        }
    };
    Token.prototype.NAME_PROCESS = function () {
        // TO DO
    };
    Token.prototype.NAME_END = function (cp) {
        if (cp === CODE_POINTS.COLON) {
            this.map[this.currentName] = "";
            this.updateState(STATE.VALUE_START);
        }
    };
    Token.prototype.VALUE_START = function (cp) {
        if (cp === CODE_POINTS.COMMA) {
            this.curPos -= 1;
            this.updateState(STATE.VALUE_END);
        }
        else {
            this.map[this.currentName] += this.toChar(cp);
        }
    };
    Token.prototype.VALUE_PROCESS = function () {
        // TO DO
    };
    Token.prototype.VALUE_END = function (cp) {
        if (cp === CODE_POINTS.COMMA) {
            this.currentName = "";
            this.updateState(STATE.NAME_START);
        }
    };
    Token.prototype.getDeclareMap = function () {
        while (this.curPos < this.codeString.length) {
            var consumeStr = this.consume();
            this.execute(this.state, consumeStr);
        }
        if (this.curPos === this.codeString.length) {
            this.currentName = "";
            this.updateState(STATE.NAME_START);
            return this.map;
        }
    };
    return Token;
}());
exports.Token = Token;
//# sourceMappingURL=index.js.map