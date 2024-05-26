import * as vscode from "vscode";
import { default as AnsiUp } from 'ansi_up';
import { Args, art2ascii } from "./art2ascii/main";
import fs from "fs";

export function activate(context: vscode.ExtensionContext) {
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

            var gifPath: string | undefined = config.get<string>('art2ascii.gifPath');
            if (gifPath == undefined) 
                gifPath = "";
            
            const args: Args = {
                filename: gifPath,
                width: 35
            }
            const output = await art2ascii(args);
            writeOutput(extensionPath + "/output.data", output);
            // vscode.commands.executeCommand('workbench.action.reloadWindow');
        });
    
    context.subscriptions.push(render);

}

async function writeOutput(filepath: string, data: string) {
    const retries = 5;
    const delay = 1000;
    function attemptWrite(attempt: number) {
        fs.writeFile(filepath, data, (err) => {
          if (err) {
            if ((err.code === 'EBUSY' || err.code === 'EACCES') && attempt < retries) {
              console.error(`File is locked or access is denied. Retrying... (Attempt ${attempt + 1})`);
              setTimeout(() => attemptWrite(attempt + 1), delay);
            } else {
              console.error('Error writing file:', err);
            }
          } else {
            console.log('File written successfully');
          }
        });
      }

      attemptWrite(0);
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
        const watcher = 
            vscode.workspace.createFileSystemWatcher(
                new vscode.RelativePattern(this._extensionUri, 'output.data'));
        watcher.onDidChange(uri => { console.log("FILE UPDATED"); });
        let frames = await this.getFrames("output.data");

        const animate = (): NodeJS.Timeout => {
            let currentIndex = 0;
            const interval = setInterval(() => {
                this._view!.webview.html = frames[currentIndex];
                // Move to next frame
                currentIndex = (currentIndex + 1) % frames.length;
            }, 83);
            return interval;
        }
        let interval = animate();
        setInterval(async () => {
            watcher.onDidChange(async (uri) => {
                frames = await this.getFrames("output.data");
                clearInterval(interval);
                this.clearHTML();
                interval = animate();
            });
        }, 1000);
    }
    private async clearHTML() {
        this._view!.webview.html = ``;
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
            return contentString;
        } catch (error) {
            console.error(`Error reading file ${filename}: ${error}`);
            return '';
        }
    }
}

export function deactivate() {}
