import math
import sys
from PIL import Image


def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    # Convert hex to RGB
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))


def parse_color_file(file_path):
    color_mapping = {}
    with open(file_path, 'r') as file:
        for line in file:
            code, color_hex = line.strip().split(': ')
            rgb_values = hex_to_rgb(color_hex)
            color_mapping[rgb_values] = code
    return color_mapping


def ascii_color(color_code, text):
    return f"\033[38;5;{color_code}m{text}\033[0m"


def eucl_dist(color1, color2):
    r1, g1, b1 = color1
    r2, g2, b2 = color2
    return ((r2-r1)*0.3) ** 2 + ((g2-g1)*0.59) ** 2 + ((b2-b1)*0.11) ** 2


def closest_color(input_color):
    min_val = math.inf
    if (input_color in color_mapping):
        return color_mapping[input_color]
    if (input_color in prev_colors):
        return prev_colors[input_color]
    for color, code in color_mapping.items():
        dist = eucl_dist(input_color, color)
        if (dist < min_val):
            min_val = dist
            ret_code = code
    prev_colors[input_color] = ret_code
    return ret_code


def image_to_ascii_color(image, image_path="", width=100):
    if (image_path != ""):
        img = Image.open(image_path)
    else:
        img = image
    img = img.resize((width, int(width * img.height / img.width)//2))
    img = img.convert("RGB")
    grey_img = img.convert('L')  # Convert to grayscale

    ascii_chars = '@%#*+=-:. '  # ASCII characters from dark to light

    ascii_art = ''
    for y in range(img.height):
        for x in range(img.width):
            pixel = img.getpixel((x, y))

            pixel_intensity = 255 - grey_img.getpixel((x, y))
            char = ascii_chars[pixel_intensity * len(ascii_chars) // 256]
            if char != ' ':
                code = closest_color(pixel)
            else:
                code = 0
            ascii_art += ascii_color(code, char)
        ascii_art += '\n'

    return ascii_art


def img_driver(image):
    global color_mapping
    color_mapping = parse_color_file("colors.txt")
    global prev_colors
    prev_colors = {}

    ascii_art_color = image_to_ascii_color(image)
    return ascii_art_color


def ascii_driver(file_path):
    global color_mapping
    color_mapping = parse_color_file("colors.txt")
    global prev_colors
    prev_colors = {}

    ascii_art_color = image_to_ascii_color("", file_path)
    print(ascii_art_color)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <image_file_path>")
        sys.exit(1)

    image_file_path = sys.argv[1]
    ascii_driver(image_file_path)
