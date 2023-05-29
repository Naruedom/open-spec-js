// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { log } = require('console');
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
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('open-spec-js.helloWorld', async function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user

		var currentPath = vscode.window.activeTextEditor.document.uri.fsPath;
		var fileName = /[^/]*$/.exec(currentPath)[0];

		var isFileJs = currentPath.substring(currentPath.length - 3).toLowerCase() === '.js';
		var isFileSpec = currentPath.substring(currentPath.length - 7).toLowerCase() === 'spec.js';

		let uri = '';
		var fileSpec = '';

		if (isFileJs && !isFileSpec) {
			fileSpec = fileName.slice(0, -2) + 'spec.js'
			uri = await findFile(fileSpec);
		}
		else if (isFileSpec) {
			fileSpec = fileName.slice(0, -7) + 'js'
			uri = await findFile(fileSpec);
		}

		if (uri) {
			// vscode.window.showInformationMessage('Openfile: ' + fileSpec);
			vscode.workspace.openTextDocument(uri).then(doc => {
				vscode.window.showTextDocument(doc);
			});
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
