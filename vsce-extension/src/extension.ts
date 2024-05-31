import * as vscode from "vscode";
import AnsiUp from 'ansi_up';
import { Args, art2ascii } from "./art2ascii/main";

export function activate(context: vscode.ExtensionContext) {
    const extensionPath = vscode.extensions.getExtension('Thaeriem.art2ascii')?.extensionPath;
    const config = vscode.workspace.getConfiguration();
    const provider = new CustomSidebarViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            CustomSidebarViewProvider.viewType,
            provider
        )
    );
    let selectedGifPath = "";
    var gifPath: string | undefined = config.get<string>('art2ascii.gifPath');
    if (gifPath == undefined) 
        gifPath = "";   
    provider.renderFrames(gifPath);

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
    
            vscode.window.showOpenDialog(options).then(async (fileUri) => {
                if (fileUri == undefined) 
                    vscode.window.showInformationMessage("No file selected");
                else {
                    if (fileUri && fileUri.length > 0) {
                        selectedGifPath = fileUri[0].fsPath;
                        await config.update("art2ascii.gifPath", selectedGifPath, 
                        vscode.ConfigurationTarget.Global);
                        vscode.commands.executeCommand('art2ascii.render');
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
            provider.renderFrames(selectedGifPath);
        });
    
    context.subscriptions.push(render);

}

class CustomSidebarViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "art2ascii.artView";
    private _view?: vscode.WebviewView;
    private _frames: string[] = [`<pre></pre>`];
    private _framesChanged: boolean = false;

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
        let local_frames = this._frames;

        const animate = (): NodeJS.Timeout => {
            let currentIndex = 0;
            const interval = setInterval(() => {
                this._view!.webview.html = local_frames[currentIndex];
                currentIndex = (currentIndex + 1) % local_frames.length;
            }, 100);
            return interval;
        }
        let interval = animate();
        setInterval(async () => {
            if (this._framesChanged) {
                local_frames = this._frames;
                clearInterval(interval);
                this.clearHTML();
                interval = animate();
                this._framesChanged = false;
            };
        }, 1000);
    }
    private async clearHTML() {
        this._view!.webview.html = ``;
    }

    private getFrames(data: string, gradient: boolean = false): string[] {
        const ansi_up = new AnsiUp();
        let frames = data.split('@FRAME@').map(frame => {
            // Convert each frame to HTML
            if (gradient) return `<pre>${frame}</pre>`;
            const html = ansi_up.ansi_to_html(frame);
            return `<pre>${html}</pre>`;
        });
        frames.shift();
        frames.pop();
        return frames;
    }

    public async renderFrames(filename: string) {
        const args: Args = {
            filename: filename,
            width: 35,
            gradient: ["#FF0F7B", "#F89B29"]
        }
        try {
            const output = await art2ascii(args);
            this._frames = this.getFrames(output, true);
            this._framesChanged = true;
        } catch(err) {
            console.error(err);   
        }
    }
}

export function deactivate() {}
