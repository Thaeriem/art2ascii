import * as vscode from "vscode";
import * as path from "path";
import AnsiUp from 'ansi_up';
import { Args, art2ascii } from "./art2ascii/main";
import { STYLES } from "./art2ascii/img2ascii";
import { downloadGif } from "./extract";

const STYLE_OPTIONS = [
    { label: "" },
    { label: "greyscale" },
    { label: "retro" },
    { label: "sunrise" },
    { label: "floral" },
    { label: "cold" },
    { label: "sunset" },
    { label: "cloudy" },
    { label: "gameboy" },
    { label: "pastel" },
    { label: "midnight" }
];

export function activate(context: vscode.ExtensionContext) {
    const extensionPath = vscode.extensions.getExtension('Thaeriem.art2ascii')?.extensionPath;
    const config = vscode.workspace.getConfiguration();
    let gifPath = "";
    let style = "";
    let resolution = 100;
    let border = true;

    var configGifPath: string | undefined = config.get<string>('art2ascii.gifPath');
    var configBorder: boolean | undefined = config.get<boolean>('art2ascii.border');
    var configStyle: string | undefined = config.get<string>('art2ascii.style');
    var configRes: number | undefined = config.get<number>('art2ascii.res');

    if (configGifPath != undefined) gifPath = configGifPath;
    if (configBorder != undefined) border = configBorder;
    if (configStyle != undefined) style = configStyle;
    if (configRes != undefined) resolution = configRes;

    const provider = new CustomSidebarViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            CustomSidebarViewProvider.viewType,
            provider
        )
    );
    provider.renderFrames(gifPath, style, resolution, border);

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
                        gifPath = fileUri[0].fsPath;
                        await config.update("art2ascii.gifPath", gifPath, 
                        vscode.ConfigurationTarget.Global);
                        vscode.commands.executeCommand('art2ascii.render');
                    }
                }
            });
    });

    let pasteLink = vscode.commands.registerCommand(
        "art2ascii.paste-link",
        async () => {
            const link = await vscode.window.showInputBox({
                placeHolder: "Paste a link to an image or gif"
            });

            if (link) {
                const tempPath = path.join(extensionPath!, 'link.gif');
                downloadGif(link, tempPath, async (err) => {
                    if (err) vscode.window.showErrorMessage("Failed to download the image.");
                    else {
                        gifPath = tempPath;
                        await config.update("art2ascii.gifPath", gifPath, vscode.ConfigurationTarget.Global);
                        vscode.commands.executeCommand('art2ascii.render');
                    }
                });
            } else {
                vscode.window.showErrorMessage("Invalid URL or not an image.");
            }
        }
    );

    let render = vscode.commands.registerCommand(
        "art2ascii.render",
        async () => {
            if (!extensionPath) {
                vscode.window.showErrorMessage('Failed to retrieve extension directory path.');
                return;
            } 
            provider.renderFrames(gifPath, style, resolution, border);
        });

    let updateStyle = vscode.commands.registerCommand(
        "art2ascii.style",
        async () => {
            const selectedStyle = await vscode.window.showQuickPick(STYLE_OPTIONS, {
                placeHolder: 'Select a style',
                canPickMany: false
            });
            if (selectedStyle) {
                style = selectedStyle.label;
                await config.update("art2ascii.style", selectedStyle.label, 
                    vscode.ConfigurationTarget.Global);
            }
            provider.renderFrames(gifPath, style, resolution, border);   
    });
    
    context.subscriptions.push(uploadArt, pasteLink, render, updateStyle);

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
        const config = vscode.workspace.getConfiguration();
        let fps = 8;
        var configFPS: number | undefined = config.get<number>('art2ascii.fps');
        if (configFPS != undefined) fps = configFPS;
        
        let local_frames = this._frames;
        const animate = (): NodeJS.Timeout => {
            let currentIndex = 0;
            const interval = setInterval(() => {
                if (this._view && this._view.webview) {
                    this._view.webview.html = local_frames[currentIndex];
                    currentIndex = (currentIndex + 1) % local_frames.length;
                }
            }, 1000/fps);
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

    private getFrames(
        data: string, 
        resolution: number = 100,
        style: string = "",
        border: boolean
    ): string[] {
        const ansi_up = new AnsiUp();
        let fontSize = 450/resolution;
        let styling = `
            font-size: ${fontSize}px;
            line-height: ${fontSize}px;
            display: inline-block;
        `;
        if (border) {
            styling += `
            padding: 5px;
            overflow: hidden;
            border-radius: 3px; 
            box-sizing: border-box;
            background-color: #000000; 
        `  
        }
        
        let frames = data.split('@FRAME@').map(frame => {
            // Convert each frame to HTML
            if ((STYLES.includes(style))) return `<pre style="${styling}">${frame}</pre>`;
            const html = ansi_up.ansi_to_html(frame);
            return `<pre style="${styling}">${html}</pre>`;
        });
        frames.shift();
        frames.pop();
        return frames;
    }

    public async renderFrames(
        filename: string, 
        style: string = "",
        resolution: number=100,
        border: boolean=true,
    ) {
        
        const args: Args = {
            filename: filename,
            width: resolution,
            style: style,
        }
        try {
            const output = await art2ascii(args);
            this._frames = this.getFrames(output, resolution, style, border);
            this._framesChanged = true;
        } catch(err) {
            console.error(err);   
        }
    }
}

export function deactivate() {}
