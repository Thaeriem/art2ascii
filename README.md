# art2ascii

art2ascii is a VS Code extension that allows users to select GIF's and play them in ASCII form directly within the Tree View tab of the workspace. 

There is also a seperate Python CLI for rendering, playing, and saving your images and GIFs in terminal [here](https://github.com/Thaeriem/art2ascii/tree/cli-release)!

<p align="center">
<img src="vsce-extension/assets/ascii_pedro.gif" alt="Pedro" style="width: 30%;">
</p>

## Features

- Converts selected GIF files into ASCII art and plays in Explorer tab of workspace.
- Supports basic GIF animations.
- Apply tint or gradient to image to customize how GIF is rendered.
- Lightweight and easy to use.

## Usage

### Installation / Upload Media
1. Install the art2ascii extension from the Visual Studio Code Marketplace or through the extensions page on VSCode.
2. Open a workspace or create a new one.
3. In the Explorer view, press the Upload Image/Gif button or `art2ascii.upload-art` in Command Palette.
4. Your ASCII GIF will be compiling in the background and when completed it will reload the extension view.

https://github.com/Thaeriem/art2ascii/assets/93838214/65074feb-a767-4402-a13a-00c759f56470

### Adding Tint / Gradient
1. Press the Color Menu button or `art2ascii.color-menu` in Command Palette.
2. Select Tint or Gradient respectively (you can also skip this step by running either `art2ascii.update-tint` or `art2ascii.update-gradient`).
3. Input selected hexadecimal color in the form `#000000` or `000000`, two colors need to be selected for gradient.

https://github.com/Thaeriem/art2ascii/assets/93838214/bd9a01b7-bf5c-4860-99a3-08058bdf7155

https://github.com/Thaeriem/art2ascii/assets/93838214/4d1b58c7-af64-4ee6-bc87-3831fa610026

## Requirements

- Visual Studio Code version 1.74.0 or higher.

## Known Issues

- Some GIF files may be too big to render properly (usually anything under 10MB should be fine)
- There is a possibility that sharp has issues with cross-platform builds. If this is the case and the extension does not run, please open an issue ticket including information about your OS as well as the debug error from Help > Toggle Developer Tools!

## Release Notes

### Version 1.2.1
- Fixed bundling issue with sharp but had to downgrade from 0.33.4 -> 0.32.6, roughly 200 file load improvement
- Updated demo + icon on VS Marketplace

### Version 1.2.0
- Added color menu with tint and gradient options.
- Added opacity option for tints and gradients.
- Refactored how configs are loaded for better performance.
- Fixed bug when closing extension webviewView.

### Version 1.1.1
- Completely rewrote renderer in TypeScript, removing Python dependency and moving rendering from terminal to client-side.
- Improved efficiency by cutting out file read / writes entirely and only storing gifUri's and loading when neccesary.
- Implemented auto-reload feature rather than having to reload entire workspace view.

### Version 1.0.3
- GIF to ASCII conversion.
- Display ASCII animation in the Tree View tab.

## Feedback and Contributions

Feel free to leave feedback! If you encounter any issues or have suggestions for improvement, please [submit an issue](https://github.com/Thaeriem/art2ascii/issues) on GitHub.

## License

This extension is licensed under the [MIT License](https://github.com/Thaeriem/art2ascii/blob/main/LICENSE).