import { imgMain } from "./img2ascii.js";
import { gifMain } from "./gif2ascii.js";

export interface Args {
  filename: string;
  width?: number;
}

// Set default values for the optional arguments
const defaultArgs: Partial<Args> = {
  width: 35,
};

// Function to validate and merge default values
function validateArgs(args: Args): Args {
  return { ...defaultArgs, ...args };
}

export async function art2ascii(args: Args) {
  args = validateArgs(args);

  if (!args.filename) {
    throw new Error("Filename is required.");
  }

  if (args.filename.toLowerCase().endsWith(".gif")) {
    return await gifMain(args.filename, args.width);
  } else {
    return await imgMain(args.filename, args.width);
  }
}