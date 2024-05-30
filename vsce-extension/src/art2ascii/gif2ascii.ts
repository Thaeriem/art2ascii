import gifFrames from "gif-frames";
import sharp from "sharp";
import { imgDriver } from "./img2ascii";

async function splitGif(filename: string, width: number, gradient: string[] = []): Promise<string[]> {
  const asciiGif: string[] = [];

  // Extract frames from the GIF
  const frames = await gifFrames({
    url: filename,
    frames: "all",
    outputType: "png",
    cumulative: true,
  });

  for (const frame of frames) {
    // Get the image data of the current frame as a buffer
    const frameData = frame.getImage().pipe(sharp({ animated: true }));
    const img = frameData.png({ quality: 100 });

    const asciiArt = await imgDriver(img, width, gradient);
    asciiGif.push(asciiArt);
  }
  return asciiGif;
}

export async function gifMain(
  filename: string,
  width: number,
  gradient: string[] = [],
): Promise<string> {
  const frames = await splitGif(filename, width, gradient);
  let retStr = "@FRAME@\n";
  for (const frame of frames) {
    retStr += frame;
    retStr += "@FRAME@\n";
  }
  return retStr;
}
