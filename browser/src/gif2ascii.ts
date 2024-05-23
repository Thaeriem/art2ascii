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
  let index = 0;
  let bind_index = 0;
  for (const frame of frames) {
    // Get the image data of the current frame as a buffer
    // const frameData = frame.getImage().pipe(sharp({ animated: true }));
    const frameBuffer = await frame
      .getImage()
      .pipe(fs.createWriteStream(`frame-${index}.png`));
    // Convert the frame to sRGB color space

    frameBuffer.on("finish", async () => {
    });

    // const img = frameData.toColourspace("srgb");

    // const asciiArt = await imgDriver(img, width);
    // asciiGif.push(asciiArt);
    index += 1;
  }


  return asciiGif;
}

async function process(frames: any) {
  let index = 0;
  let bind_index = 0;
  for (const frame of frames) {
    // Get the image data of the current frame as a buffer
    // const frameData = frame.getImage().pipe(sharp({ animated: true }));
    const frameBuffer = await frame
      .getImage()
      .pipe(fs.createWriteStream(`frame-${index}.png`));
    // Convert the frame to sRGB color space

    frameBuffer.on("finish", async () => {
      bind_index += 1;
    });

    // const img = frameData.toColourspace("srgb");

    // const asciiArt = await imgDriver(img, width);
    // asciiGif.push(asciiArt);
    index += 1;
  }
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
