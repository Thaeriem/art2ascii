import time
import os
import sys
from PIL import Image
from ascii_img import img_driver


def split_gif(gif_path):
    # Open the GIF file
    start_time = time.time()
    gif = Image.open(gif_path)

    ascii_gif = []

    # Iterate over each frame in the GIF
    for frame_number in range(gif.n_frames):
        # Go to the current frame
        gif.seek(frame_number)

        # Copy the current frame
        frame = gif.copy()
        ascii_gif.append(img_driver(frame))
    end_time = time.time()
    print(f"Execution time: {end_time - start_time} seconds")
    return ascii_gif


def print_frames(frames, num_iterations=10):
    for _ in range(num_iterations):
        for frame in frames:
            # Clear the terminal screen
            os.system('cls' if os.name == 'nt' else 'clear')

            # Print the frame
            print(frame)

            # Pause for a short duration between frames
            time.sleep(0.065)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <gif_file_path>")
        sys.exit(1)

    gif_file_path = sys.argv[1]
    frames = split_gif(gif_file_path)
    # print_frames(frames)
