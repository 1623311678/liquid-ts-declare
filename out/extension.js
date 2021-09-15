"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
const vscode = require("vscode");
const ts_morph_1 = require("ts-morph");
const Util_1 = require("./Util");
const provider_1 = require("./provider");
let NAME_SPECE = null;
function init() {
    const wfArr = vscode.workspace.workspaceFolders;
    if (wfArr && wfArr[0]) {
        const curWf = wfArr[0].uri.fsPath;
        const curActive = vscode.window.activeTextEditor;
        const project = new ts_morph_1.Project();
        const files = project.addSourceFilesAtPaths([`${curWf}/**src/*.d.ts`]);
        NAME_SPECE = Util_1.getNameSpaceObjByFile(files);
    }
}
init();
function activate(context) {
    if (!NAME_SPECE) {
        init();
    }
    const ns = NAME_SPECE;
    const Provier = new provider_1.Provider(ns);
    const provider = Provier.getProvider();
    context.subscriptions.push(provider);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map