import time
import os
import sys
import imageio
from PIL import Image
from ascii_img import img_driver, create_image_from_ascii


def split_gif(gif_path):
    # Open the GIF file
    gif = Image.open(gif_path)

    ascii_gif = []

    # Iterate over each frame in the GIF
    for frame_number in range(gif.n_frames):
        # Go to the current frame
        gif.seek(frame_number)

        # Copy the current frame
        frame = gif.copy()
        ascii_gif.append(img_driver(frame))
    return ascii_gif


def print_frames(frames, num_iterations=5):
    for _ in range(num_iterations):
        for frame in frames:
            # Clear the terminal screen
            os.system("cls" if os.name == "nt" else "clear")

            # Print the frame
            print(frame)

            # Pause for a short duration between frames
            time.sleep(0.065)


def create_gif(frames, gif_path, delay=0.05):
    images = []
    for frame in frames:
        image = create_image_from_ascii(frame, resize=2, border=(1600, 70, 0, 400))
        images.append(image)

    # Save the images as frames of a GIF
    imageio.mimsave(gif_path, images, loop=0, duration=delay)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <gif_file_path> <output_path>")
        sys.exit(1)

    gif_file_path = "content/" + sys.argv[1]
    output_path = "output/"
    frames = split_gif(gif_file_path)
    if len(sys.argv) == 3:
        create_gif(frames, output_path + sys.argv[2])
    else:
        print_frames(frames)
