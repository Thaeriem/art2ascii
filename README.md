# art2ascii

## Overview

art2ascii is a Visual Studio Code extension that allows users to select a GIF and play it in ASCII form directly within the Tree View tab of the workspace. 

<p align="center">
<img src="assets/ascii_pedro.gif" alt="Pedro">
</p>

## Features

- Converts selected GIF files into ASCII art.
- Plays the ASCII art animation in the Tree View tab of the workspace.
- Supports basic GIF animations.
- Lightweight and easy to use.

## Usage

1. Install the art2ascii extension from the Visual Studio Code Marketplace.
2. Install the art2ascii cli with: `pip install git+https://github.com/Thaeriem/art2ascii.git@1.0.3`
3. Open a workspace or create a new one.
4. In the Explorer view, press the Upload Image/Gif button or `art2ascii.upload-art` in Command Palette.
5. Your ASCII GIF will be compiling in the background and when completed it will reload the page.

<video controls>
  <source src="assets/techdemo.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Requirements

- Visual Studio Code version 1.74.0 or higher.

## Known Issues

- Auto-reload is something that will be worked on in the future but at the moment has been difficult to implement properly (and is therefore not included in this version)
- `art2ascii.terminal` sometimes does not write to the ASCII GIF file properly and forces users to re-compile (very annoying and will be trying to work on a fix)

## Release Notes

### Version 1.0.3

Initial release of art2ascii:
- GIF to ASCII conversion.
- Display ASCII animation in the Tree View tab.

## Feedback and Contributions

We welcome feedback and contributions from the community. If you encounter any issues or have suggestions for improvement, please [submit an issue](https://github.com/Thaeriem/art2ascii/issues) on GitHub.

## License

This extension is licensed under the [MIT License](LICENSE).