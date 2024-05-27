# Changelog

All notable changes to this project will be documented in this file.

## [1.1.1] - 2024-05-26
- Completely rewrote renderer in TypeScript, removing Python dependency and moving rendering from terminal to client-side
- Improved efficiency by cutting out file read / writes entirely and only storing gifUri's and loading when neccesary
- Implemented auto-reload feature rather than having to reload entire workspace view.

## [1.0.3] - 2024-05-11

### Added
- vscode support 
- bugfixes to cli and output directory flag for cli

## [1.0.2, 1.0.1, 1.0.0] - 2024-05-11

### Added
- python cli to generate, save, and export data files of images and gifs.