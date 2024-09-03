import * as vscode from "vscode";
import AnsiUp from 'ansi_up';
import { Args, art2ascii } from "./art2ascii/main";

export function activate(context: vscode.ExtensionContext) {
    const extensionPath = vscode.extensions.getExtension('Thaeriem.art2ascii')?.extensionPath;
    const config = vscode.workspace.getConfiguration();
    let selectedGifPath = "";
    var gifPath: string | undefined = config.get<string>('art2ascii.gifPath');
    if (gifPath != undefined) selectedGifPath = gifPath;
    let tint: string[] = [];
    var tintVar: string[] | undefined = config.get<string[]>('art2ascii.tint');
    if (tintVar != undefined && tintVar[0] != '') tint = tintVar;      
    let selectedOpacity = 1.0;
    var opacity: number | undefined = config.get<number>('art2ascii.opacity');
    if (opacity != undefined) selectedOpacity = opacity;

    const provider = new CustomSidebarViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            CustomSidebarViewProvider.viewType,
            provider
        )
    );
    provider.renderFrames(selectedGifPath, tint, selectedOpacity);

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

    let render = vscode.commands.registerCommand(
        "art2ascii.render",
        async () => {
            if (!extensionPath) {
                vscode.window.showErrorMessage('Failed to retrieve extension directory path.');
                return;
            } 
            provider.renderFrames(selectedGifPath, tint, selectedOpacity);
        });

    let colorMenu = vscode.commands.registerCommand(
        "art2ascii.color-menu",
        async() => {
            const options: vscode.QuickPickOptions = {
                title: "Color Menu",
                canPickMany: false,
                placeHolder: 'Select Color Mode'
            };
            const res = await vscode.window.showQuickPick(["Tint","Gradient"], options);
            if (res == "Tint") vscode.commands.executeCommand("art2ascii.update-tint");
            else vscode.commands.executeCommand("art2ascii.update-gradient");
    });

    let updateOpacity = vscode.commands.registerCommand(
        "art2ascii.update-opacity",
        async () => {
            const isValidOpac = (opac: string): boolean => {
                const op = parseFloat(opac);
                if (!op) return false;
                return (op <= 1.00 && op > 0.00)
            }

            let opacInput = await vscode.window.showInputBox({
                placeHolder: 'Enter a numerical value between 0.01 and 1.00'
            })
            if (opacInput == undefined) return;

            if(isValidOpac(opacInput)) {
                const op = parseFloat(opacInput);
                selectedOpacity = op;
                await config.update("art2ascii.opacity", selectedOpacity, 
                vscode.ConfigurationTarget.Global);
            }
            else {
                vscode.window.showInformationMessage("Non-valid Input");
                return;
            }
            provider.renderFrames(selectedGifPath, tint, selectedOpacity);   
    });

    const isValidHex = (hex: string): boolean => {
        if (hex == "") return true;
        // Remove leading '#' if present
        hex = hex.replace(/^#/, '');
        // Validate hex string
        return /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    };

    let updateTint = vscode.commands.registerCommand(
        "art2ascii.update-tint",
        async () => {
            let hexInput = await vscode.window.showInputBox({
                placeHolder: 'Enter a hexadecimal color code (e.g., #ff5733 or ff5733)',
                title: "Select Tint"
            });
            if (hexInput == undefined) return;

            if(isValidHex(hexInput)) {
                if (hexInput == "") tint = [];
                else tint = [hexInput];
                await config.update("art2ascii.tint", tint, vscode.ConfigurationTarget.Global);
            }
            else {
                vscode.window.showInformationMessage("Non-valid Hexadecimal Input");
                return;
            }
            provider.renderFrames(selectedGifPath, tint, selectedOpacity);   
    });

    let updateGradient = vscode.commands.registerCommand( 
        "art2ascii.update-gradient",
        async() => {
            let hexInput = await vscode.window.showInputBox({
                placeHolder: 'Enter a hexadecimal color code (e.g., #ff5733 or ff5733)',
                title: "Select Gradient 1/2"
            });
            if (hexInput == undefined) return;
            let hexInput2 = await vscode.window.showInputBox({
                placeHolder: 'Enter a hexadecimal color code (e.g., #ff5733 or ff5733)',
                title: "Select Gradient 2/2"
            });
            if (hexInput2 == undefined) return;
            if(isValidHex(hexInput) && isValidHex(hexInput2)) {
                let tmp = []
                if (hexInput != "") tmp.push(hexInput);
                if (hexInput2 != "") tmp.push(hexInput2); 
                tint = tmp;
                await config.update("art2ascii.tint", tint, vscode.ConfigurationTarget.Global);
            }
            else {
                vscode.window.showInformationMessage("Non-valid Hexadecimal Input");
                return;
            }
            provider.renderFrames(selectedGifPath, tint, selectedOpacity);
            

    });
    
    context.subscriptions.push(uploadArt, colorMenu, updateGradient, updateTint, updateOpacity, render);

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
        this.clearHTML();
        this.updateWebviewContent();
    }

    private async updateWebviewContent(): Promise<void> {
        let local_frames = this._frames;
        const animate = (): NodeJS.Timeout => {
            let currentIndex = 0;
            const interval = setInterval(() => {
                if (this._view && this._view.webview) {
                    this._view.webview.html = local_frames[currentIndex];
                    currentIndex = (currentIndex + 1) % local_frames.length;
                }
            }, 150);
            return interval;
        }
        let interval = animate();
        this._view?.onDidDispose(() => {
            if (interval) clearInterval(interval);
            this.clearHTML();
        });
        setInterval(async () => {
            if (this._framesChanged) {
                if (interval) clearInterval(interval);
                local_frames = this._frames;
                this.clearHTML();
                this._framesChanged = false;
                interval = animate();
            };
        }, 1000);
    }
    private async clearHTML() {
        if (this._view && this._view.webview) this._view.webview.html = ``;
    }

    private getFrames(data: string, tint: boolean = false): string[] {
        const ansi_up = new AnsiUp();
        let frames = data.split('@FRAME@').map(frame => {
            // Convert each frame to HTML
            if (tint) return `<pre>${frame}</pre>`;
            const html = ansi_up.ansi_to_html(frame);
            return `<pre>${html}</pre>`;
        });
        frames.shift();
        frames.pop();
        return frames;
    }

    public async renderFrames(filename: string, tintColors: string[], opacity: number) {
        const args: Args = {
            filename: filename,
            width: 35,
            tints: tintColors,
            opacity: opacity,
        }
        try {
            const output = await art2ascii(args);
            this._frames = this.getFrames(output, (tintColors.length > 0));
            this._framesChanged = true;
        } catch(err) {
            console.error(err);   
        }
    }
}

export function deactivate() {}
