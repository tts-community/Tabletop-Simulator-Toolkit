// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TabletopSimulatorObjectsProvider, TtsObject } from './TtsObjectsBrowser';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "tabletop-simulator-toolkit" is now active!');
	
	vscode.window.registerTreeDataProvider("ttsxobjects", new TabletopSimulatorObjectsProvider());
	
	const myProvider = new class implements vscode.TextDocumentContentProvider {

		// emitter and its event
		onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
		onDidChange = this.onDidChangeEmitter.event;

		provideTextDocumentContent(uri: vscode.Uri): string {
			return `I'm a document at ${uri.toString()}`;
		}
	};

	context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider("tabletopsimulatorscheme", myProvider));

	context.subscriptions.push(vscode.commands.registerCommand('extension.openTtsObject', async ttsobject => {
		let uri = vscode.Uri.parse(`tabletopsimulatorscheme:${ttsobject.label}`);
		let doc = await vscode.workspace.openTextDocument(uri);
		await vscode.window.showTextDocument(doc, {preview: false});
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {}
