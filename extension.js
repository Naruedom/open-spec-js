// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// import * as fs from "fs";   

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "open-spec-js" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json`
	let disposable = vscode.commands.registerCommand('open-spec-js.toggle', async function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user

		var currentPath = vscode.window.activeTextEditor.document.uri.fsPath;
		var fileName = /[^/]*$/.exec(currentPath)[0];

		var isFileJs = currentPath.substring(currentPath.length - 3).toLowerCase() === '.js';
		var isFileSpecJs = currentPath.substring(currentPath.length - 7).toLowerCase() === 'spec.js';

		var isFileTs = currentPath.substring(currentPath.length - 3).toLowerCase() === '.ts';
		var isFileSpecTs = currentPath.substring(currentPath.length - 7).toLowerCase() === 'spec.ts';

		let uri = '';
		var fileTarget = '';

		if (isFileJs && !isFileSpecJs) {
			fileTarget = fileName.slice(0, -2) + 'spec.js'
			uri = await findFile(fileTarget);
		}
		else if (isFileSpecJs) {
			fileTarget = fileName.slice(0, -7) + 'js'
			uri = await findFile(fileTarget);
		}
		else if (isFileTs && !isFileSpecTs) {
			fileTarget = fileName.slice(0, -2) + 'spec.ts'
			uri = await findFile(fileTarget);
		}
		else if (isFileSpecTs) {
			fileTarget = fileName.slice(0, -7) + 'ts'
			uri = await findFile(fileTarget);
		}

		if (uri) {
			vscode.window.showInformationMessage('open file: "' + fileTarget + '"');
			vscode.workspace.openTextDocument(uri).then(doc => {
				vscode.window.showTextDocument(doc);
			});
		}
		else if (fileTarget === '') {
			vscode.window.showInformationMessage('This file is not supported.');
		}
		else {
			vscode.window.showInformationMessage('file not found: "' + fileTarget + '"');
		}
	});

	context.subscriptions.push(disposable);
}

async function findFile(name) {
	let uri = undefined;
	await vscode.workspace.findFiles('**/' + name, '**/node_modules/**').then((value) => {
		console.log('value', value);
		if (value.length) {
			uri = value[0];
		}
	});
	return uri ? uri : '';
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
