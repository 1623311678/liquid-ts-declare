"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/ban-types */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
const token_1 = require("../token");
const vscode = require("vscode");
const startFlag = "{%comment%}";
const endFlag = "{%endcomment%}";
class Provider {
    constructor(ns) {
        this.nameSpace = {};
        this.nameSpace = ns;
    }
    getProvider() {
        const ns = this.nameSpace;
        let res = [];
        function generate(declareObj, linePrefix, key) {
            for (const key2 in declareObj) {
                if (linePrefix.endsWith(`${key}.`)) {
                    res.push(new vscode.CompletionItem(`${key2}`, vscode.CompletionItemKind.Method));
                }
            }
        }
        function getDeclareArrByMap(map, linePrefix) {
            res = [];
            const interateMap = map;
            let declare = {};
            for (const key in interateMap) {
                const declareObj = ns[map[key]];
                declare = declareObj;
                generate(declareObj, linePrefix, key);
            }
            function interate(params, K) {
                generate(params, linePrefix, K);
                for (const keyP in params) {
                    if (Object.keys(params[keyP]).length > 0) {
                        interate(params[keyP], keyP);
                    }
                }
            }
            for (const keyD in declare) {
                const params = declare[keyD];
                interate(params, keyD);
            }
        }
        return vscode.languages.registerCompletionItemProvider("liquid", {
            provideCompletionItems(document, position) {
                var _a;
                const wfArr = vscode.workspace.workspaceFolders;
                const curWf1 = wfArr[0].uri.fsPath;
                const currentlyOpenTabfilePath = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri.fsPath;
                const data = fs.readFileSync(String(currentlyOpenTabfilePath), "utf8");
                let codeString = data
                    .replace(/\n/g, "")
                    .replace(/' '/g, "")
                    .replace(/\./g, "")
                    .replace(/\s+/g, "");
                const startIndex = codeString.indexOf(startFlag);
                const endIndex = codeString.indexOf(endFlag);
                codeString = codeString.slice(startIndex + startFlag.length, endIndex);
                const token = new token_1.Token(codeString);
                const declareMap = token.getDeclareMap();
                const linePrefix = document
                    .lineAt(position)
                    .text.substr(0, position.character);
                getDeclareArrByMap(declareMap, linePrefix);
                return res;
            },
        }, "." // triggered whenever a '.' is being typed
        );
    }
}
exports.Provider = Provider;
//# sourceMappingURL=index.js.map