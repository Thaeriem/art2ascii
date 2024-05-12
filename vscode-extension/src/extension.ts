import * as vscode from "vscode";
import { default as AnsiUp } from 'ansi_up';

export function activate(context: vscode.ExtensionContext) {
    console.log("Extension activated");
    const extensionPath = vscode.extensions.getExtension('Thaeriem.art2ascii')?.extensionPath;
    const config = vscode.workspace.getConfiguration();
    config.update("art2ascii.gifUri", extensionPath + "/output.data", 
    vscode.ConfigurationTarget.Global);
    let terminalInstance: vscode.Terminal;
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
                    }
                }
            });
            vscode.commands.executeCommand("art2ascii.terminal");
    });

    context.subscriptions.push(uploadArt);

    let terminal = vscode.commands.registerCommand(
        "art2ascii.terminal",
        async () => {
            if (!extensionPath) {
                vscode.window.showErrorMessage('Failed to retrieve extension directory path.');
                return;
            }

            var gifPath: string | undefined = config.get<string>('art2ascii.gifPath');
            if (gifPath == undefined) 
                gifPath = "";
            const options: vscode.TerminalOptions = {
                hideFromUser: true,
                name: "Ext Term",
            }
            terminalInstance = vscode.window.createTerminal(options);

            const predeterminedCommand = 'art2ascii -f ' + gifPath + ' -w 35 -e -o ' + extensionPath; 
            terminalInstance.sendText(predeterminedCommand);

            setTimeout(()=> {
                terminalInstance.dispose();
                vscode.window.showInformationMessage("Compiled ASCII image!");
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            }, 20000);
        });
    
    context.subscriptions.push(terminal);
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
