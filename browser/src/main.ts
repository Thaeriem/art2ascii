// import * as gif2ascii from './art2ascii/gif2ascii';
// import * as img2ascii from './art2ascii/img2ascii';
import { gifMain } from "./gif2ascii.js";

interface Args {
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

export async function main(args: Args) {
  args = validateArgs(args);

  if (!args.filename) {
    throw new Error("Filename is required.");
  }

  if (args.filename.toLowerCase().endsWith(".gif")) {
    // Call your gif2ascii function
    console.log("Processing GIF:", args);
    // await gif2ascii.gifMain(args);
  } else {
    // Call your img2ascii function
    console.log("Processing Image:", args);
    // await img2ascii.imgMain(args);
  }
}

async function exampleUsage() {
  const args: Args = {
    filename: "example.png",
    width: 200,
  };

  try {
    await main(args);
  } catch (error) {
    console.error("Error:", error);
  }
}

gifMain("/Users/thaeriem/Desktop/pedro.gif", 35);
