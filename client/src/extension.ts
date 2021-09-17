/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext, window } from 'vscode';

import { Project } from "ts-morph";
import { getNameSpaceObjByFile } from "./utils";
import { Provider } from "./provider";
let NAME_SPECE: { [key: string]: any } = {};
function init() {
	const wfArr: any = workspace.workspaceFolders;
	if (wfArr && wfArr[0]) {
		const curWf = wfArr[0].uri.fsPath;
		const project = new Project();
		const files = project.addSourceFilesAtPaths([`${curWf}/types/**/*.d.ts`]);
		NAME_SPECE = getNameSpaceObjByFile(files);
	}
}
init();

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {

	console.log('active------');

	// implement autocomplete
	if (!NAME_SPECE) {
		init();
	}
	const ns = NAME_SPECE;
	const Provier = new Provider(ns);
	const provider = Provier.getProvider();
	context.subscriptions.push(provider);



	// The server is implemented in node
	const serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		// 这里配置server对哪种文件生效
		documentSelector: [{ scheme: 'file', language: 'liquid' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
