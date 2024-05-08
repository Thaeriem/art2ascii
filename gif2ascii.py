import time
import os
import sys
import imageio
from PIL import Image
from img2ascii import img_driver, create_image_from_ascii


def split_gif(filename, greyscale, width):
    # Open the GIF file
    gif = Image.open(filename)

    ascii_gif = []

    # Iterate over each frame in the GIF
    for frame_number in range(gif.n_frames):
        # Go to the current frame
        gif.seek(frame_number)

        # Copy the current frame
        frame = gif.copy()
        ascii_gif.append(img_driver(frame, greyscale, width))
    return ascii_gif


def print_frames(frames, loops):
    for _ in range(loops):
        for frame in frames:
            # Clear the terminal screen
            os.system("cls" if os.name == "nt" else "clear")

            # Print the frame
            print(frame)

            # Pause for a short duration between frames
            time.sleep(0.065)


def create_gif(frames, filename, resize, border, delay=0.05):
    images = []
    for frame in frames:
        image = create_image_from_ascii(frame, resize, border, "")
        images.append(image)

    # Save the images as frames of a GIF
    path = filename.split("/")
    filename = "ascii_" + path[len(path) - 1]
    imageio.mimsave(filename, images, loop=0, duration=delay)


def gif_main(args):
    frames = split_gif(args.filename, args.greyscale, args.width)
    if args.save:
        create_gif(frames, args.filename, args.resize, args.border)
    else:
        print_frames(frames, args.loops)
