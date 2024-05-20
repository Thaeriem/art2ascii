import gifFrames from "gif-frames";
import sharp from "sharp";
import { imgDriver } from "./img2ascii.js";
import fs from "fs";

async function splitGif(filename: string, width: number): Promise<string[]> {
  // Extract frames from the GIF
  const frames = await gifFrames({
    url: filename,
    frames: "all",
    outputType: "png",
    cumulative: true,
  });

  const asciiGif: string[] = [];

  // Iterate over each frame in the GIF
  for (const frame of frames) {
    // Get the image data of the current frame as a buffer
    const frameData = frame.getImage().pipe(sharp());

    // Convert the frame to sRGB color space
    const img = frameData.toColourspace("srgb");

    const asciiArt = await imgDriver(img, width);
    asciiGif.push(asciiArt);
  }
  return asciiGif;
}

export async function gifMain(
  filename: string,
  width: number
): Promise<string> {
  const frames = await splitGif(filename, width);
  let retStr = "@FRAME@\n";
  for (const frame of frames) {
    retStr += frame;
    retStr += "@FRAME@\n";
  }
  console.log(retStr);
  return retStr;
}
