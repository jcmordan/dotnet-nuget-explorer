import {
    WorkspaceFolder,
    TreeDataProvider,
    Event,
    TreeItem,
    ProviderResult,
    TreeItemCollapsibleState,
    Command,
    EventEmitter
} from 'vscode';

import * as path from 'path';


interface ItemModel {
    title: string;
    details: string;
    iconPath: {
        light: string,
        dark: string,
    };
    command?: Command;
}

export class NugetExplorerProvider implements TreeDataProvider<Options> {
    items: ItemModel[] = [
        {
            title: 'Packages',
            details: 'Package Explorer',
            iconPath: {
                light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'nuget.svg'),
                dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'nuget.svg')
            },
            command: {
                command: 'packageExplorer.explore',
                title: 'Package Explorer'
            }
        }
    ];

    private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>();
    readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;

    // constructor(private workspaceFolders: WorkspaceFolder[] | undefined) {
    // }


    getTreeItem(element: Options): TreeItem {
        return element;
    }

    getChildren(element?: Options | undefined): Promise<Options[]> {
        return Promise.resolve(
            this.items.map(item => new Options(item.title, item.details, /*item.iconPath, */TreeItemCollapsibleState.None, item.command))
        );
    }
}


export class Options extends TreeItem {


    constructor(
        public readonly label: string,
        private readonly details: string,
        // readonly iconPath: any,
        public readonly collapsibleState: TreeItemCollapsibleState,
        command?: Command
    ) {
        super(label, collapsibleState);
        this.command = command;
    }

    get tooltip(): string {
        return `${this.details}`;
    }

    get description(): string {
        return `${this.label} - ${this.details}`;
    }

    contextValue = 'dependency';
    iconPath = {
        light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'download.svg'),
        dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'download.svg')
    };
}