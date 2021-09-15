"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
var vscode = require("vscode");
var ts_morph_1 = require("ts-morph");
var Util_1 = require("./Util");
var provider_1 = require("./provider");
var NAME_SPECE = null;
function init() {
    var wfArr = vscode.workspace.workspaceFolders;
    if (wfArr && wfArr[0]) {
        var curWf = wfArr[0].uri.fsPath;
        var curActive = vscode.window.activeTextEditor;
        var project = new ts_morph_1.Project();
        var files = project.addSourceFilesAtPaths([curWf + "/**src/*.d.ts"]);
        NAME_SPECE = Util_1.getNameSpaceObjByFile(files);
    }
}
init();
function activate(context) {
    if (!NAME_SPECE) {
        init();
    }
    var ns = NAME_SPECE;
    var Provier = new provider_1.Provider(ns);
    var provider = Provier.getProvider();
    context.subscriptions.push(provider);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map