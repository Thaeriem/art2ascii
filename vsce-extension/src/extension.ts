import * as vscode from "vscode";
import { default as AnsiUp } from 'ansi_up';
import { Args, art2ascii } from "./art2ascii/main";
import fs from 'fs/promises';

export function activate(context: vscode.ExtensionContext) {
    console.log("Extension activated");
    const extensionPath = vscode.extensions.getExtension('Thaeriem.art2ascii')?.extensionPath;
    const config = vscode.workspace.getConfiguration();
    config.update("art2ascii.gifUri", extensionPath + "/output.data", 
    vscode.ConfigurationTarget.Global);
    const provider = new CustomSidebarViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            CustomSidebarViewProvider.viewType,
            provider
        )
    );

    let uploadArt = vscode.commands.registerCommand(
        "art2ascii.upload-art",
        async () => {
            const options: vscode.OpenDialogOptions = {
                canSelectFiles: true,
                canSelectMany: false,
                openLabel: "Open",
                filters: {
                    "Selectable": ["gif", "png", "jpg", "jpeg"]
                }
            };
    
            vscode.window.showOpenDialog(options).then(fileUri => {
                if (fileUri == undefined) 
                    vscode.window.showInformationMessage("No file selected");
                else {
                    if (fileUri && fileUri.length > 0) {
                        const selectedGifPath = fileUri[0].fsPath;
                        config.update("art2ascii.gifPath", selectedGifPath, 
                        vscode.ConfigurationTarget.Global);
                        runRender();
                    }
                }
            });
    });

    context.subscriptions.push(uploadArt);

    let render = vscode.commands.registerCommand(
        "art2ascii.render",
        async () => {
            if (!extensionPath) {
                vscode.window.showErrorMessage('Failed to retrieve extension directory path.');
                return;
            }

            var gifPath: string | undefined = config.get<string>('art2ascii.gifPath');
            if (gifPath == undefined) 
                gifPath = "";
            
            const args: Args = {
                filename: gifPath,
                width: 35
            }
            const ret = await art2ascii(args);
            await fs.writeFile(extensionPath + "/output.data", ret, 'utf8');
            //     vscode.commands.executeCommand('workbench.action.reloadWindow');
        });
    
    context.subscriptions.push(render);

}

async function runRender() {
    return vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        cancellable: false
    }, async (progress, token) => {
        try {
            vscode.commands.executeCommand('art2ascii.render');
            progress.report({ increment: 0 });
            await new Promise(resolve => setTimeout(resolve, 2000));
            progress.report({ increment: 20, message: "Compiling ASCII image." });
            await new Promise(resolve => setTimeout(resolve, 4000));
            progress.report({ increment: 35, message: "Compiling ASCII image.." });
            await new Promise(resolve => setTimeout(resolve, 3000));
            progress.report({ increment: 45, message: "Compiling ASCII image..." });
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.error("An error occurred:", error);
        }
    });
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
        this.updateWebviewContent();
    }

    private async updateWebviewContent(): Promise<void> {

        const frames = await this.getFrames("output.data");
        let currentIndex = 0;
        setInterval(() => {
            this._view!.webview.html = frames[currentIndex];
            // Move to next frame
            currentIndex = (currentIndex + 1) % frames.length;
        }, 83);
    }

    private async getFrames(filename: string): Promise<string[]> {
        const output = await this.readFileAsDataUri(filename);
        const ansi_up = new AnsiUp();
        let frames = output.split('@FRAME@').map(frame => {
            // Convert each frame to HTML
            const html = ansi_up.ansi_to_html(frame);
            return `<pre>${html}</pre>`;
        });
        frames.shift();
        frames.pop();
        return frames;
    }

    private async readFileAsDataUri(filename: string): Promise<string> {
        try {
            const fileUri = vscode.Uri.joinPath(this._extensionUri, filename);
            const fileContent = await vscode.workspace.fs.readFile(fileUri);
            const contentString = Buffer.from(fileContent).toString('utf-8');
            console.log("READ: " + contentString.length);
            return contentString;
        } catch (error) {
            console.error(`Error reading file ${filename}: ${error}`);
            return '';
        }
    }
}

export function deactivate() {}
