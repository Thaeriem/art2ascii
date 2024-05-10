import time
import os
import imageio
from PIL import Image
import art2ascii.img2ascii as img2ascii


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
        ascii_gif.append(img2ascii.img_driver(frame, greyscale, width))
    return ascii_gif


def print_frames(frames, loops):
    for _ in range(loops):
        for frame in frames:
            # Clear the terminal screen
            os.system("cls" if os.name == "nt" else "clear")

            # Print the frame
            print(frame)

            # Pause for a short duration between frames
            time.sleep(0.08)


def create_gif(frames, filename, args, delay=0.1):
    images = []
    for frame in frames:
        image = img2ascii.create_image_from_ascii(frame, args, "")
        images.append(image)

    if args.export == True:
        filepath = "output.data"
        if args.output != "":
            filepath = args.output + "/" + filepath
        with open(filepath, "w") as file:
            file.write("@")
            for image in images:
                file.write(image)
                file.write("@")
        return

    # Save the images as frames of a GIF
    path = filename.split("/")
    filename = "ascii_" + path[len(path) - 1]
    if args.output != "":
        filename = args.output + "/" + filename
    imageio.mimsave(filename, images, loop=0, duration=delay)


def gif_main(args):
    if args.output != "" or args.export == True:
        args.save = True
    frames = split_gif(args.filename, args.greyscale, args.width)
    if args.save:
        create_gif(frames, args.filename, args)
    else:
        print_frames(frames, args.loops)
