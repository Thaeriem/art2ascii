import sys
import os
from PIL import Image, ImageOps
import art2ascii.kd_tree as kd_tree
import pyautogui
from pkg_resources import resource_string


def hex_to_rgb(hex_color):
    # Convert hex to RGB
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))


def parse_color_file(color_string):
    # parse terminal color file
    color_mapping = {}
    lines = color_string.decode("utf-8").strip().split("\n")
    for line in lines:
        code, color_hex = line.split(": ")
        rgb_values = hex_to_rgb(color_hex)
        color_mapping[rgb_values] = code
    return color_mapping


def ascii_color(color_code, text):
    return f"\033[38;5;{color_code}m{text}\033[0m"


def kd_tree_driver(color_mapping):
    dim = 3

    def dist_sq_func(a, b):
        return (
            ((a[0] - b[0]) * 0.3) ** 2
            + ((a[1] - b[1]) * 0.59) ** 2
            + ((a[2] - b[2]) * 0.11) ** 2
        )

    kdtree = kd_tree.KDTree(list(color_mapping.keys()), dim, dist_sq_func)
    return kdtree


def image_to_ascii_color(color_mapping, kdtree, image, width, image_path):
    if image_path != "":
        img = Image.open(image_path)
    else:
        img = image
    img = img.resize((width, int(width * img.height / img.width) // 2))
    img = img.convert("RGB")
    grey_img = img.convert("L")  # Convert to greyscale

    ascii_chars = "@%#*+=-:. "  # ASCII characters from dark to light
    prev_colors = {}

    ascii_art = ""
    for y in range(img.height):
        for x in range(img.width):
            pixel = img.getpixel((x, y))

            pixel_intensity = 255 - grey_img.getpixel((x, y))
            char = ascii_chars[pixel_intensity * len(ascii_chars) // 256]
            if char != " ":
                if pixel in prev_colors:
                    code = prev_colors[pixel]
                else:
                    code = color_mapping[tuple(kdtree.get_nearest(pixel))[1]]
                    prev_colors[pixel] = code
            else:
                code = 0
            ascii_art += ascii_color(code, char)
        ascii_art += "\n"
    return ascii_art


def init_colors(greyscale):
    if greyscale:
        color_mapping = parse_color_file(resource_string(__name__, "greyscale.txt"))
    else:
        color_mapping = parse_color_file(resource_string(__name__, "colors.txt"))
    return color_mapping


def img_driver(image, greyscale, width):
    color_mapping = init_colors(greyscale)
    kdtree = kd_tree_driver(color_mapping)
    ascii_art_color = image_to_ascii_color(color_mapping, kdtree, image, width, "")
    return ascii_art_color


def ascii_driver(file_path, greyscale, width):
    color_mapping = init_colors(greyscale)
    kdtree = kd_tree_driver(color_mapping)
    ascii_art_color = image_to_ascii_color(color_mapping, kdtree, "", width, file_path)
    return ascii_art_color


def create_image_from_ascii(ascii_text, args, filename=""):

    # managing export for data file
    if args.export == True:
        if filename != "":
            filepath = "output.data"
            if args.output != "":
                filepath = args.output + "/" + filepath
            with open(filepath, "w") as file:
                file.write("@")
                file.write(ascii_text)
                file.write("@")
        return ascii_text

    # managing screenshot functionality
    os.system("cls" if os.name == "nt" else "clear")
    sys.stdout.write(ascii_text)
    sys.stdout.flush()
    image = pyautogui.screenshot()
    image = ImageOps.crop(image, args.border)
    image = image.resize(
        (int(image.width * args.resize), int(image.height * args.resize))
    )
    os.system("cls" if os.name == "nt" else "clear")

    # saving image for images
    if filename != "":
        path = filename.split("/")
        filetype = path[len(path) - 1].split(".")
        filepath = "ascii_" + filetype[0] + ".png"
        if args.output != "":
            filepath = args.output + "/" + filepath
        image.save(filepath)
    return image


def img_main(args):
    if args.output != "" or args.export == True:
        args.save = True
    image = ascii_driver(args.filename, args.greyscale, args.width)
    if args.save:
        create_image_from_ascii(image, args, args.filename)
    else:
        print(image)
