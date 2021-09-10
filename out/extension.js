"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
const vscode = require("vscode");
function activate(context) {
    const provider2 = vscode.languages.registerCompletionItemProvider('plaintext', {
        provideCompletionItems(document, position) {
            // get all text until the `position` and check if it reads `console.`
            // and if so then complete if `log`, `warn`, and `error`
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            if (!linePrefix.endsWith('settings.')) {
                return undefined;
            }
            return [
                new vscode.CompletionItem('title', vscode.CompletionItemKind.Method),
                new vscode.CompletionItem('bgcolor', vscode.CompletionItemKind.Method),
                new vscode.CompletionItem('children', vscode.CompletionItemKind.Method),
            ];
        }
    }, '.' // triggered whenever a '.' is being typed
    );
    const provider3 = vscode.languages.registerCompletionItemProvider('plaintext', {
        provideCompletionItems(document, position) {
            // get all text until the `position` and check if it reads `console.`
            // and if so then complete if `log`, `warn`, and `error`
            const linePrefix = document.lineAt(position).text.substr(0, position.character);
            if (!linePrefix.endsWith('children.')) {
                return undefined;
            }
            return [
                new vscode.CompletionItem('title', vscode.CompletionItemKind.Method),
                new vscode.CompletionItem('bgcolor', vscode.CompletionItemKind.Method),
                new vscode.CompletionItem('children', vscode.CompletionItemKind.Method),
            ];
        }
    }, '.' // triggered whenever a '.' is being typed
    );
    context.subscriptions.push(provider2, provider3);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map