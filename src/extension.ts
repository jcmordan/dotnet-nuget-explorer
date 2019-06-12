'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { NugetExplorerProvider, Options } from './views/NugetExplorerProvider';
import { TreeView, window } from 'vscode';
let treeView: TreeView<Options>;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    let disposable = vscode.commands.registerCommand('packageExplorer.explore', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Package explorer');
    });

    context.subscriptions.push(disposable);

    const nodeDependenciesProvider = new NugetExplorerProvider();
    vscode.window.registerTreeDataProvider('packageExplorer', nodeDependenciesProvider);

    context.subscriptions.push(treeView);

    // console.log(treeView);

    // vscode.commands.registerCommand('packageExplorer.viewPackage', task => {
    //     vscode.tasks.executeTask(task).then(function (value) {
    //         return value;
    //     }, function (e) {
    //         console.error('Error');
    //     });
    // });
}

// this method is called when your extension is deactivated
export function deactivate() {
}