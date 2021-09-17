/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/ban-types */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import fs = require("fs");
import { Token } from "../token";
import * as vscode from "vscode";
const startFlag = "{%comment%}";
const endFlag = "{%endcomment%}";
interface NS {
  [key: string]: any
}
export class Provider {
  private nameSpace:  NS = {};
  constructor(ns:  NS) {
    this.nameSpace = ns;
  }
  getProvider() {
    const ns:  NS = this.nameSpace;
    let res: any[] = [];
    function generate(declareObj: NS, linePrefix: string, key: string) {
      for (const key2 in declareObj) {
        if (linePrefix.endsWith(`${key}.`)) {
          res.push(
            new vscode.CompletionItem(
              `${key2}`,
              vscode.CompletionItemKind.Method
            )
          );
        }
      }
    }
    function getDeclareArrByMap(map: NS, linePrefix: string) {
      res = [];
      const interateMap = map;
      let declare: any = {};
      for (const key in interateMap) {
        const declareObj = ns[map[key]];
        declare = declareObj;
        generate(declareObj, linePrefix, key);
      }
      function interate(params: NS,K:string) {
				generate(params, linePrefix, K);
        for (const keyP in params) {
          if (Object.keys(params[keyP]).length > 0) {
            interate(params[keyP],keyP);
          }
        }
      }
      for (const keyD in declare) {
        const params = declare[keyD];
        interate(params,keyD);
      }
    }
    return vscode.languages.registerCompletionItemProvider(
      ["plaintext","liquid"],
      {
        provideCompletionItems(
          document: vscode.TextDocument,
          position: vscode.Position
        ) {
          // const wfArr: any = vscode.workspace.workspaceFolders;
          // const curWf1 = wfArr[0].uri.fsPath;
          const currentlyOpenTabfilePath =
            vscode.window.activeTextEditor?.document.uri.fsPath;
          const data = fs.readFileSync(
            String(currentlyOpenTabfilePath),
            "utf8"
          );
          let codeString = data
            .replace(/\n/g, "")
            .replace(/' '/g, "")
            .replace(/\./g, "")
            .replace(/\s+/g, "");
          const startIndex = codeString.indexOf(startFlag);
          const endIndex = codeString.indexOf(endFlag);
          codeString = codeString.slice(
            startIndex + startFlag.length,
            endIndex
          );
          const token = new Token(codeString);
          const declareMap = token.getDeclareMap();
          const linePrefix = document
            .lineAt(position)
            .text.substr(0, position.character);
          getDeclareArrByMap((declareMap as NS), linePrefix);
          return res;
        },
      },
      "." // triggered whenever a '.' is being typed
    );
  }
}
