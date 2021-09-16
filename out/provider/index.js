"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/ban-types */
// eslint-disable-next-line @typescript-eslint/no-var-requires
var fs = require("fs");
var token_1 = require("../token");
var vscode = require("vscode");
var startFlag = "{%comment%}";
var endFlag = "{%endcomment%}";
var Provider = /** @class */ (function () {
    function Provider(ns) {
        this.nameSpace = {};
        this.nameSpace = ns;
    }
    Provider.prototype.getProvider = function () {
        var ns = this.nameSpace;
        var res = [];
        function generate(declareObj, linePrefix, key) {
            for (var key2 in declareObj) {
                if (linePrefix.endsWith(key + ".")) {
                    res.push(new vscode.CompletionItem("" + key2, vscode.CompletionItemKind.Method));
                }
            }
        }
        function getDeclareArrByMap(map, linePrefix) {
            res = [];
            var interateMap = map;
            var declare = {};
            for (var key in interateMap) {
                var declareObj = ns[map[key]];
                declare = declareObj;
                generate(declareObj, linePrefix, key);
            }
            function interate(params, K) {
                generate(params, linePrefix, K);
                for (var keyP in params) {
                    if (Object.keys(params[keyP]).length > 0) {
                        interate(params[keyP], keyP);
                    }
                }
            }
            for (var keyD in declare) {
                var params = declare[keyD];
                interate(params, keyD);
            }
        }
        return vscode.languages.registerCompletionItemProvider(["plaintext", "liquid"], {
            provideCompletionItems: function (document, position) {
                var _a;
                // const wfArr: any = vscode.workspace.workspaceFolders;
                // const curWf1 = wfArr[0].uri.fsPath;
                var currentlyOpenTabfilePath = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri.fsPath;
                var data = fs.readFileSync(String(currentlyOpenTabfilePath), "utf8");
                var codeString = data
                    .replace(/\n/g, "")
                    .replace(/' '/g, "")
                    .replace(/\./g, "")
                    .replace(/\s+/g, "");
                var startIndex = codeString.indexOf(startFlag);
                var endIndex = codeString.indexOf(endFlag);
                codeString = codeString.slice(startIndex + startFlag.length, endIndex);
                var token = new token_1.Token(codeString);
                var declareMap = token.getDeclareMap();
                var linePrefix = document
                    .lineAt(position)
                    .text.substr(0, position.character);
                getDeclareArrByMap(declareMap, linePrefix);
                return res;
            },
        }, "." // triggered whenever a '.' is being typed
        );
    };
    return Provider;
}());
exports.Provider = Provider;
//# sourceMappingURL=index.js.map