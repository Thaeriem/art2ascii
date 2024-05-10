import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    console.log("Extension activated");

    const provider = new CustomSidebarViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            CustomSidebarViewProvider.viewType,
            provider
        )
    );
}

class CustomSidebarViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "art2ascii.openview";
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
