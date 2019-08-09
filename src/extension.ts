'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { NugetExplorerProvider } from './providers/NugetExplorerProvider';
import {
    window,
    Uri,
    ViewColumn,
    ExtensionContext
} from 'vscode';
import * as path from 'path';


function loadScript(context: ExtensionContext, path: string) {
    return `<script src="${Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource' }).toString()}"></script>`;
}

let explorePackageButton: vscode.StatusBarItem;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    const explorePackageCommandId = 'packageExplorer.explore';
    let disposable = vscode.commands.registerCommand(explorePackageCommandId, () => {
        // The code you place here will be executed every time your command is executed

        const panel = window.createWebviewPanel('packageManager', "Package Manager", ViewColumn.Active, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [Uri.file(path.join(context.extensionPath, 'out'))]
        });

        panel.webview.html = getWebviewContent(context);

        panel.webview.onDidReceiveMessage((event) => {
            console.log(event);
        });


        setTimeout(() => {
            panel.webview.postMessage({
                date: Date.now,
                command: 'data'
            });
        }, 500);
    });



    context.subscriptions.push(disposable);

    const nodeDependenciesProvider = new NugetExplorerProvider();
    vscode.window.registerTreeDataProvider('packageExplorer', nodeDependenciesProvider);

    explorePackageButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    explorePackageButton.text = 'Manage Nuget Packages';
    explorePackageButton.command = explorePackageCommandId;
    explorePackageButton.show();

    context.subscriptions.push(explorePackageButton);

    vscode.window.registerWebviewPanelSerializer('packageManager', new PackageManagerSerializer(context));
}


// this method is called when your extension is deactivated
export function deactivate() {
}

function getWebviewContent(context: ExtensionContext) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    </head>
    <body>
        <div id="root"></div>
        <div id="id"></div> 
        ${loadScript(context, 'out/vendor.js')}
        ${loadScript(context, 'out/view.js')}
        <script>
        debugger;
            window.value=90; 
            window.settings = {
                date: ${Date.now}
            }
        </script>
    </body>
    </html>
`;
}

class PackageManagerSerializer implements vscode.WebviewPanelSerializer {

    constructor(private context: ExtensionContext) {
    }

    async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
        // `state` is the state persisted using `setState` inside the webview
        console.log(`Got state: ${state}`);

        state = {
            workspace: vscode.workspace
        };

        // Restore the content of our webview.
        //
        // Make sure we hold on to the `webviewPanel` passed in here and
        // also restore any event listeners we need on it.
        webviewPanel.webview.html = getWebviewContent(this.context);


    }
}
