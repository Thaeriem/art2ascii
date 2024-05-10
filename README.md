# art2ascii

A command-line tool to convert images and GIFs into ASCII art.
- Displays in terminal with 256 colors 
- Optimized nearest color algortihm with [k-d trees][1]
- Can be downloaded as image (support for GIFs is currently macOS only)[^1]

<p align="center">
<img src="docs/output/ascii_pedro.gif" alt="Popcat" width="500">
</p>

## Getting Started


### Prerequisites


* [python][2]
* [pip][3]
  ```sh
  python3 -m ensurepip
  # or
  brew install pip
  ```

### Installation

Run the following command:
```sh
pip install git+https://github.com/Thaeriem/art2ascii.git@1.0.3
```


<!-- USAGE EXAMPLES -->
## Usage
```sh
art2ascii ver: 1.0.3
~ GitHub: https://github.com/Thaeriem/art2ascii
~ Issues: https://github.com/Thaeriem/art2ascii/issues
~ Author: Thaeriem

usage: art2ascii [-h] [-f FILENAME] [-g] [-r RESIZE] [-w WIDTH] [-s] [-o OUTPUT] [-e] [-l LOOPS]
                 [-b BORDER]

Command line options for converting images/GIFs into ASCII art.

optional arguments:
  -h, --help            show this help message and exit
  -f FILENAME, --filename FILENAME
                        Image/GIF filename
  -g, --greyscale       Enable greyscale (default: false)
  -r RESIZE, --resize RESIZE
                        Resize factor (default: 1.0)
  -w WIDTH, --width WIDTH
                        Width (default: 100)
  -s, --save            Save file (default: false)
  -o OUTPUT, --output OUTPUT
                        Output Directory
  -e, --export          Export data file
  -l LOOPS, --loops LOOPS
                        Number of times to loop (default: 10)
  -b BORDER, --border BORDER
                        Border input (format: "left,top,right,bottom")
```
```sh
art2ascii -f docs/images/starrynight.jpeg
```
<p align="center">
<img src="docs/output/ascii_starrynight.png" alt="Starrynight" width="800">
</p>

```sh
art2ascii -f docs/images/monalisa.jpeg
art2ascii -f docs/images/monalisa.jpeg -w 40
```
<div style="display: flex; justify-content: center; margin-bottom: 20px;">
    <img src="docs/output/ascii_monalisa.png" alt="Monalisa" style="width: 400px; margin-right: 10px;">
    <img src="docs/output/ascii_monalisa_mini.png" alt="Monalisa" style="width: 325px;">
</div>

```sh
art2ascii -f docs/images/homer.gif
```

<p align="center">
<img src="docs/output/ascii_homer.gif" alt="Homer" width="600">
</p>

```sh
art2ascii -f docs/images/popcat.gif 
```

<p align="center">
<img src="docs/output/ascii_popcat.gif" alt="Homer" width="600">
</p>


## Built With

* [Pillow](https://pillow.readthedocs.io/en/stable/) - Python Imaging Library
* [imageio](https://imageio.readthedocs.io/en/stable/) - For Creating GIFs
* [pyautogui](https://pyautogui.readthedocs.io/en/latest/) - For taking screenshots of terminal

[^1]: Automated GIFs are finicky and rely on the --border parameter to get right, it may be easier to just screen record the terminal output for some users

[1]: https://en.wikipedia.org/wiki/K-d_tree "Wikipedia: K-d trees"
[2]: https://www.python.org/downloads/ "Python download"
[3]: https://pip.pypa.io/en/stable/installation/ "Pip install"
