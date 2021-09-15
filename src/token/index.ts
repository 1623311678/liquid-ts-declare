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
  AMPERSAND: 0x26, //&
  APOSTROPHE: 0x27, //'
  HYPHEN_MINUS: 0x2d,
  SOLIDUS: 0x2f,
  DIGIT_0: 0x30, //0
  DIGIT_9: 0x39, //9
  SEMICOLON: 0x3b,
  LESS_THAN_SIGN: 0x3c,
  EQUALS_SIGN: 0x3d, //=
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
  COLON: 0x3a, //:
  COMMA: 0x2c, //,
};
enum STATE {
  NAME_START = "NAME_START",
  NAME_PROCESS = "NAME_PROCESS",
  NAME_END = "NAME_END",
  VALUE_START = "VALUE_START",
  VALUE_PROCESS = "VALUE_PROCESS",
  VALUE_END = "VALUE_END",
}
export class Token {
  private codeString = "";
  private curPos = 0;
  private state = STATE.NAME_START;
  private currentName = "";
  private map: { [key: string]: string } = {};
  constructor(codeString: string) {
    this.codeString = codeString;
  }
  private isLegal(cp: number) {
    return this.isAsciiLetter(cp) || this.isNumber(cp);
  }
  private isAsciiLetter(cp: number) {
    return this.isAsciiLower(cp) || this.isAsciiUpper(cp);
  }
  private isAsciiUpper(cp: number) {
    return (
      cp >= CODE_POINTS.LATIN_CAPITAL_A && cp <= CODE_POINTS.LATIN_CAPITAL_Z
    );
  }
  private isNumber(cp: number) {
    return cp >= CODE_POINTS.DIGIT_0 && cp <= CODE_POINTS.DIGIT_9;
  }

  private isAsciiLower(cp: number) {
    return cp >= CODE_POINTS.LATIN_SMALL_A && cp <= CODE_POINTS.LATIN_SMALL_Z;
  }
  private consume() {
    const str = this.codeString[this.curPos];
    this.curPos += 1;
    return str.charCodeAt(0);
  }
  private updateState(state: STATE) {
    this.state = state;
  }
  private toChar(cNum: number) {
    if (cNum <= 0xffff) {
      return String.fromCharCode(cNum);
    }

    cNum -= 0x10000;
    return (
      String.fromCharCode(((cNum >>> 10) & 0x3ff) | 0xd800) +
      String.fromCharCode(0xdc00 | (cNum & 0x3ff))
    );
  }
  private execute(state: STATE, cp: number) {
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
  private NAME_START(cp: number) {
    if (cp === CODE_POINTS.COLON) {
      this.updateState(STATE.NAME_END);
      this.curPos -= 1;
    } else if (this.isLegal(cp)) {
      this.currentName += this.toChar(cp);
    }
  }
  private NAME_PROCESS() {}
  private NAME_END(cp: number) {
    if (cp === CODE_POINTS.COLON) {
      this.map[this.currentName] = "";
      this.updateState(STATE.VALUE_START);
    }
  }
  private VALUE_START(cp: number) {
    if (cp === CODE_POINTS.COMMA) {
      this.curPos -= 1;
      this.updateState(STATE.VALUE_END);
    } else {
      this.map[this.currentName] += this.toChar(cp);
    }
  }

  private VALUE_PROCESS() {}
  private VALUE_END(cp: number) {
    if (cp === CODE_POINTS.COMMA) {
      this.currentName = "";
      this.updateState(STATE.NAME_START);
    }
  }
  public getDeclareMap() {
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
