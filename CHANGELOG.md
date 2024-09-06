# Changelog

All notable changes to this project will be documented in this file.

### [1.3.0] - 2024-09-05
- Replaced tint/gradient system for styles
- Added 10 default styles
- Refactor for fps, resolution, and border fields
- Added border for light mode accessibility 
- Added ability to paste links from GIPHY, Tenor, Imgur, etc. to import locally

### [1.2.1] - 2024-08-15
- Fixed bundling issue with sharp but had to downgrade from 0.33.4 -> 0.32.6, roughly 200 file load improvement
- Updated demo + icon on VS Marketplace

## [1.2.0] - 2024-06-04
- Added color menu with tint and gradient options.
- Added opacity option for tints and gradients.
- Refactored how configs are loaded for better performance.
- Fixed bug when closing extension webviewView.

## [1.1.1] - 2024-05-26
- Completely rewrote renderer in TypeScript, removing Python dependency and moving rendering from terminal to client-side
- Improved efficiency by cutting out file read / writes entirely and only storing gifUri's and loading when neccesary
- Implemented auto-reload feature rather than having to reload entire workspace view.

## [1.0.3] - 2024-05-11
- vscode support 
- bugfixes to cli and output directory flag for cli
- GIF to ASCII conversion.
- Display ASCII animation in the Tree View tab.

## [1.0.2, 1.0.1, 1.0.0] - 2024-05-11
- python cli to generate, save, and export data files of images and gifs.