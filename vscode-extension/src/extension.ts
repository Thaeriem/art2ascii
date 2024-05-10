import * as vscode from "vscode";
import { window } from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log("Extension activated");

    const provider = new CustomSidebarViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            CustomSidebarViewProvider.viewType,
            provider
        )
    );
    let uploadArt = vscode.commands.registerCommand(
        "art2ascii.upload-art",
        () => {
            const options: vscode.OpenDialogOptions = {
                canSelectFiles: true,
                canSelectMany: false,
                openLabel: "Open",
                filters: {
                    "GIF": ["gif"],
                    "Images": ["png", "jpg"]
                }
            };
    
            vscode.window.showOpenDialog(options).then(fileUri => {
                if (fileUri == undefined) 
                    vscode.window.showInformationMessage("No file selected");
                else {
                    if (fileUri && fileUri.length > 0) {
                        const selectedGifPath = fileUri[0].fsPath;
                        vscode.workspace.getConfiguration()
                        .update("art2ascii.gifPath", selectedGifPath, 
                        vscode.ConfigurationTarget.Global);
                        vscode.window.showInformationMessage(`Selected file: ${selectedGifPath}`);
                    }
                }
            });
    
    
    });
    
    context.subscriptions.push(uploadArt);
}

class CustomSidebarViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "art2ascii.artView";
    private _view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext<unknown>,
        token: vscode.CancellationToken
    ): void | Thenable<void> {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        webviewView.webview.html = this.getHtmlContent(webviewView.webview);
        setInterval(() => {
          }, 1000);
    }

    private getHtmlContent(webview: vscode.Webview): string {
        const stylesheetUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "assets", "main.css")
        );
        const yourGif = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "assets", "ascii_popcat.gif")
        );

        return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <link rel="stylesheet" href="${stylesheetUri}" />
            </head>
            <body>
                <section>
                    <img src="${yourGif}" />
                </section>
            </body>
        </html>
        `;
    }
}

export function deactivate() {}
