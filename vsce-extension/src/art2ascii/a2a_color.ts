export type Pixel = [number, number, number];
export type ColorMapping = { [key: string]: string };

// courtesy of https://stackoverflow.com/questions/3080421/javascript-color-gradient
function getGradientColor (startColor: string, endColor: string, percent: number): string {
    // strip the leading # if it's there
    startColor = startColor.replace(/^\s*#|\s*$/g, '');
    endColor = endColor.replace(/^\s*#|\s*$/g, '');
  
    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (startColor.length === 3) {
      startColor = startColor.replace(/(.)/g, '$1$1');
    }
  
    if (endColor.length === 3) {
      endColor = endColor.replace(/(.)/g, '$1$1');
    }
  
    // get colors
    const startRed = parseInt(startColor.substring(0, 2), 16),
      startGreen = parseInt(startColor.substring(2, 4), 16),
      startBlue = parseInt(startColor.substring(4, 6), 16);
  
    const endRed = parseInt(endColor.substring(0, 2), 16),
      endGreen = parseInt(endColor.substring(2, 4), 16),
      endBlue = parseInt(endColor.substring(4, 6), 16);
  
    // calculate new color
    let diffRed = endRed - startRed;
    let diffGreen = endGreen - startGreen;
    let diffBlue = endBlue - startBlue;
  
    diffRed = ((diffRed * percent) + startRed);
    diffGreen = ((diffGreen * percent) + startGreen);
    diffBlue = ((diffBlue * percent) + startBlue);
  
    let diffRedStr = diffRed.toString(16).split('.')[0];
    let diffGreenStr = diffGreen.toString(16).split('.')[0];
    let diffBlueStr = diffBlue.toString(16).split('.')[0];
  
    // ensure 2 digits by color
    if (diffRedStr.length === 1) diffRedStr = '0' + diffRedStr;
    if (diffGreenStr.length === 1) diffGreenStr = '0' + diffGreenStr;
    if (diffBlueStr.length === 1) diffBlueStr = '0' + diffBlueStr;
  
    return '#' + diffRedStr + diffGreenStr + diffBlueStr;
}
  
export function GradientDriver (startColor: string, endColor: string): string[] {
  let ret = [];
  for (let i = 0.1; i < 1.0; i+= 0.1) {
    ret.push(getGradientColor(startColor, endColor, i));
  }
  return ret;
}

export function parseColorFile(colorText: string): ColorMapping {
  const colorMapping: ColorMapping = {};
  const regex = /\((\d+), (\d+), (\d+)\): '(\d+)'/g;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(colorText)) !== null) {
    const rgb: Pixel = [
      parseInt(match[1]),
      parseInt(match[2]),
      parseInt(match[3]),
    ];
    const code: string = match[4];
    colorMapping[rgb.toString()] = code;
  }
  return colorMapping;
}

export function hexToRgb(hex: string): Pixel {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^\s*#|\s*$/g, '');

  // Parse the r, g, b values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  return [r, g, b];
}

export function mixRgb(color1: Pixel, color2: Pixel, opacity: number): Pixel {
  const mixChannel = (channel1: number, channel2: number): number => {
    return Math.round((channel1 + (opacity)*channel2)/(1+opacity));
  };

  const red = mixChannel(color1[0], color2[0]);
  const green = mixChannel(color1[1], color2[1]);
  const blue = mixChannel(color1[2], color2[2]);

  return [red, green, blue];
}

export function RgbToString(pixel: Pixel): string {
  return "(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + ")";
}

export function asciiColor(colorCode: number, text: string): string {
  return `\x1b[38;5;${colorCode}m${text}\x1b[0m`;
}