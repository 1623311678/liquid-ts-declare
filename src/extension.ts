/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
import * as vscode from "vscode";
import { Project } from "ts-morph";
import { getNameSpaceObjByFile } from "./Util";
import { Provider } from "./provider";
let NAME_SPECE: { [key: string]: any } = {};
function init() {
  const wfArr: any = vscode.workspace.workspaceFolders;
  if (wfArr && wfArr[0]) {
    const curWf = wfArr[0].uri.fsPath;
    const curActive = vscode.window.activeTextEditor;
    const project = new Project();
    const files = project.addSourceFilesAtPaths([`${curWf}/**src/*.d.ts`]);
    NAME_SPECE = getNameSpaceObjByFile(files);
  }
}
init();
export function activate(context: vscode.ExtensionContext) {
  if (Object.keys(NAME_SPECE).length === 0) {
    init();
  }
  const ns = NAME_SPECE;
  const Provier = new Provider(ns);
  const provider = Provier.getProvider();
  context.subscriptions.push(provider);
}
