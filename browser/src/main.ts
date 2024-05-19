// import * as gif2ascii from './art2ascii/gif2ascii';
// import * as img2ascii from './art2ascii/img2ascii';
import { Point, KDTree } from "./kd_tree";

interface Args {
  filename: string;
  resize?: number;
  width?: number;
}

// Set default values for the optional arguments
const defaultArgs: Partial<Args> = {
  resize: 1.0,
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
    resize: 0.5,
    width: 200,
  };

  try {
    await main(args);
  } catch (error) {
    console.error("Error:", error);
  }
}

const points: Point[] = [
  [2, 3],
  [5, 4],
  [9, 6],
  [4, 7],
  [8, 1],
  [7, 2],
];
const tree = new KDTree(points, 2);

// Add a new point
tree.addPointPublic([3, 6]);

// Find the nearest neighbor
const nearest = tree.getNearest([2, 4]);
console.log(nearest);

// Find the 3 nearest neighbors
const knn = tree.getKnnPublic([2, 4], 3);
console.log(knn);
