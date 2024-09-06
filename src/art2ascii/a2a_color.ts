export type Pixel = [number, number, number];
export type ColorMapping = { [key: string]: string };

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

export function createColorMapping(colorText: string): ColorMapping {
  const colorMapping: ColorMapping = {};
  const cleanedText = colorText.replace(/[\{\[\]\}]/g, '');
  const regex = /\((\d+),\s*(\d+),\s*(\d+)\)|#([0-9A-Fa-f]{6})/g;
  let match: RegExpExecArray | null;
  let index = 0; 
  while ((match = regex.exec(cleanedText)) !== null) {
    let rgb: Pixel;

    if (match[1] !== undefined && match[2] !== undefined && match[3] !== undefined)
      // Match for (r,g,b) format
      rgb = [
        parseInt(match[1]),
        parseInt(match[2]),
        parseInt(match[3]),
      ];
    else if (match[4] !== undefined)
      // Match for hex code format
      rgb = hexToRgb(match[4])
    else continue;

    colorMapping[rgb.toString()] = index.toString();
    index++;
  }
  return colorMapping;
}

export function RgbToString(pixel: Pixel): string {
  return "(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + ")";
}

export function asciiColor(colorCode: number, text: string): string {
  return `\x1b[38;5;${colorCode}m${text}\x1b[0m`;
}