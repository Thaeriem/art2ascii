import { imgMain } from "./img2ascii";
import { gifMain } from "./gif2ascii";

export interface Args {
  filename: string;
  width: number;
  tint?: string;
}

// Set default values for the optional arguments
const defaultArgs: Partial<Args> = {
  width: 35,
  tint: "",
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
    return await gifMain(args.filename, args.width, args.tint);
  } else {
    return await imgMain(args.filename, args.width, args.tint);
  }
}