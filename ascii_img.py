import sys
import os
from PIL import Image, ImageOps
from kd_tree import KDTree
import pyautogui


def hex_to_rgb(hex_color):
    # Convert hex to RGB
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))


def parse_color_file(file_path):
    # parse terminal color file
    color_mapping = {}
    with open(file_path, "r") as file:
        for line in file:
            code, color_hex = line.strip().split(": ")
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

    kd_tree = KDTree(list(color_mapping.keys()), dim, dist_sq_func)
    return kd_tree


def image_to_ascii_color(color_mapping, kd_tree, image, image_path="", width=100):
    if image_path != "":
        img = Image.open(image_path)
    else:
        img = image
    img = img.resize((width, int(width * img.height / img.width) // 2))
    img = img.convert("RGB")
    grey_img = img.convert("L")  # Convert to grayscale

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
                    code = color_mapping[tuple(kd_tree.get_nearest(pixel))[1]]
                    prev_colors[pixel] = code
            else:
                code = 0
            ascii_art += ascii_color(code, char)
        ascii_art += "\n"

    return ascii_art


def init_colors():
    color_mapping = parse_color_file("colors.txt")
    return color_mapping


def img_driver(image):
    color_mapping = init_colors()
    kd_tree = kd_tree_driver(color_mapping)
    ascii_art_color = image_to_ascii_color(color_mapping, kd_tree, image)
    return ascii_art_color


def ascii_driver(file_path):
    color_mapping = init_colors()
    kd_tree = kd_tree_driver(color_mapping)
    ascii_art_color = image_to_ascii_color(color_mapping, kd_tree, "", file_path)
    return ascii_art_color


def create_image_from_ascii(ascii_text, path="", resize=1, border=(1600, 70, 0, 400)):

    os.system("cls" if os.name == "nt" else "clear")
    sys.stdout.write(ascii_text)
    sys.stdout.flush()
    screenshot = pyautogui.screenshot()
    screenshot.save("temp.png")
    image = Image.open("temp.png")
    image = ImageOps.crop(image, border)
    image = image.resize((int(image.width * resize), int(image.height * resize)))
    os.system("cls" if os.name == "nt" else "clear")
    os.remove("temp.png")
    if path != "":
        image.save(path)
    return image


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <image_file_path> <output_path>")
        sys.exit(1)

    image_file_path = "content/" + sys.argv[1]
    output_path = "output/"
    image = ascii_driver(image_file_path)
    if len(sys.argv) == 3:
        create_image_from_ascii(image, output_path + sys.argv[2])
    else:
        print(image)
