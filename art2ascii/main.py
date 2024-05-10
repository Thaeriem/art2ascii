import argparse
import sys
import art2ascii.gif2ascii as gif2ascii
import art2ascii.img2ascii as img2ascii


def parse_tuple(input_str):
    try:
        values = input_str.replace("(", "").replace(")", "")
        values = values.split(",")
        if len(values) != 4:
            raise argparse.ArgumentTypeError(
                "Tuple must contain exactly four comma-separated values."
            )

        mapped_int = map(int, values)
        return tuple(mapped_int)
    except ValueError as e:
        raise argparse.ArgumentTypeError("Tuple values must be integers.") from e


def parse_arguments():
    parser = argparse.ArgumentParser(
        description="Command line options for converting images/GIFs into ASCII art."
    )
    parser.add_argument("-f", "--filename", type=str, help="Image/GIF filename")
    parser.add_argument(
        "-g",
        "--greyscale",
        action="store_true",
        default=False,
        help="Enable greyscale (default: false)",
    )
    parser.add_argument(
        "-r", "--resize", type=float, default=1.0, help="Resize factor (default: 1.0)"
    )
    parser.add_argument(
        "-w", "--width", type=int, default=100, help="Width (default: 100)"
    )
    parser.add_argument(
        "-s",
        "--save",
        action="store_true",
        default=False,
        help="Save file (default: false)",
    )
    parser.add_argument(
        "-l",
        "--loops",
        type=int,
        default=10,
        help="Number of times to loop (default: 10)",
    )
    parser.add_argument(
        "-b",
        "--border",
        type=parse_tuple,
        default=(1600, 70, 0, 400),
        help='Border input (format: "left,top,right,bottom")',
    )
    return parser.parse_args()


def main():
    args = parse_arguments()
    if args.filename == None:
        print("Error: Please provide a filename using the -f option.", file=sys.stderr)
        return
    if args.filename.lower().endswith(".gif"):
        gif2ascii.gif_main(args)
    else:
        img2ascii.img_main(args)


if __name__ == "__main__":
    main()
