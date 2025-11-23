import { Point, KDTree } from "./kd_tree";
import * as a2a_color from "./a2a_color";
import { Args } from "./main";
import sharp from "sharp";

// work on ASCII and non-ASCII renderer.
const colorText = `{(0, 0, 0): '016', (128, 0, 0): '001', (0, 128, 0): '002', (128, 128, 0): '003', (0, 0, 128): '004', (128, 0, 128): '005', (0, 128, 128): '006', (192, 192, 192): '007', (128, 128, 128): '244', (255, 0, 0): '196', (255, 255, 0): '226', (0, 255, 0): '046', (0, 0, 255): '021', (255, 0, 255): '201', (0, 255, 255): '051', (255, 255, 255): '231', (0, 0, 95): '017', (0, 0, 135): '018', (0, 0, 175): '019', (0, 0, 215): '020', (0, 95, 0): '022', (0, 95, 95): '023', (0, 95, 135): '024', (0, 95, 175): '025', (0, 95, 215): '026', (0, 95, 255): '027', (0, 135, 0): '028', (0, 135, 95): '029', (0, 135, 135): '030', (0, 135, 175): '031', (0, 135, 215): '032', (0, 135, 255): '033', (0, 175, 0): '034', (0, 175, 95): '035', (0, 175, 135): '036', (0, 175, 175): '037', (0, 175, 215): '038', (0, 175, 255): '039', (0, 215, 0): '040', (0, 215, 95): '041', (0, 215, 135): '042', (0, 215, 175): '043', (0, 215, 215): '044', (0, 215, 255): '045', (0, 255, 95): '047', (0, 255, 135): '048', (0, 255, 175): '049', (0, 255, 215): '050', (95, 0, 0): '052', (95, 0, 95): '053', (95, 0, 135): '054', (95, 0, 175): '055', (95, 0, 215): '056', (95, 0, 255): '057', (95, 95, 0): '058', (95, 95, 95): '059', (95, 95, 135): '060', (95, 95, 175): '061', (95, 95, 215): '062', (95, 95, 255): '063', (95, 135, 0): '064', (95, 135, 95): '065', (95, 135, 135): '066', (95, 135, 175): '067', (95, 135, 215): '068', (95, 135, 255): '069', (95, 175, 0): '070', (95, 175, 95): '071', (95, 175, 135): '072', (95, 175, 175): '073', (95, 175, 215): '074', (95, 175, 255): '075', (95, 215, 0): '076', (95, 215, 95): '077', (95, 215, 135): '078', (95, 215, 175): '079', (95, 215, 215): '080', (95, 215, 255): '081', (95, 255, 0): '082', (95, 255, 95): '083', (95, 255, 135): '084', (95, 255, 175): '085', (95, 255, 215): '086', (95, 255, 255): '087', (135, 0, 0): '088', (135, 0, 95): '089', (135, 0, 135): '090', (135, 0, 175): '091', (135, 0, 215): '092', (135, 0, 255): '093', (135, 95, 0): '094', (135, 95, 95): '095', (135, 95, 135): '096', (135, 95, 175): '097', (135, 95, 215): '098', (135, 95, 255): '099', (135, 135, 0): '100', (135, 135, 95): '101', (135, 135, 135): '102', (135, 135, 175): '103', (135, 135, 215): '104', (135, 135, 255): '105', (135, 175, 0): '106', (135, 175, 95): '107', (135, 175, 135): '108', (135, 175, 175): '109', (135, 175, 215): '110', (135, 175, 255): '111', (135, 215, 0): '112', (135, 215, 95): '113', (135, 215, 135): '114', (135, 215, 175): '115', (135, 215, 215): '116', (135, 215, 255): '117', (135, 255, 0): '118', (135, 255, 95): '119', (135, 255, 135): '120', (135, 255, 175): '121', (135, 255, 215): '122', (135, 255, 255): '123', (175, 0, 0): '124', (175, 0, 95): '125', (175, 0, 135): '126', (175, 0, 175): '127', (175, 0, 215): '128', (175, 0, 255): '129', (175, 95, 0): '130', (175, 95, 95): '131', (175, 95, 135): '132', (175, 95, 175): '133', (175, 95, 215): '134', (175, 95, 255): '135', (175, 135, 0): '136', (175, 135, 95): '137', (175, 135, 135): '138', (175, 135, 175): '139', (175, 135, 215): '140', (175, 135, 255): '141', (175, 175, 0): '142', (175, 175, 95): '143', (175, 175, 135): '144', (175, 175, 175): '145', (175, 175, 215): '146', (175, 175, 255): '147', (175, 215, 0): '148', (175, 215, 95): '149', (175, 215, 135): '150', (175, 215, 175): '151', (175, 215, 215): '152', (175, 215, 255): '153', (175, 255, 0): '154', (175, 255, 95): '155', (175, 255, 135): '156', (175, 255, 175): '157', (175, 255, 215): '158', (175, 255, 255): '159', (215, 0, 0): '160', (215, 0, 95): '161', (215, 0, 135): '162', (215, 0, 175): '163', (215, 0, 215): '164', (215, 0, 255): '165', (215, 95, 0): '166', (215, 95, 95): '167', (215, 95, 135): '168', (215, 95, 175): '169', (215, 95, 215): '170', (215, 95, 255): '171', (215, 135, 0): '172', (215, 135, 95): '173', (215, 135, 135): '174', (215, 135, 175): '175', (215, 135, 215): '176', (215, 135, 255): '177', (215, 175, 0): '178', (215, 175, 95): '179', (215, 175, 135): '180', (215, 175, 175): '181', (215, 175, 215): '182', (215, 175, 255): '183', (215, 215, 0): '184', (215, 215, 95): '185', (215, 215, 135): '186', (215, 215, 175): '187', (215, 215, 215): '188', (215, 215, 255): '189', (215, 255, 0): '190', (215, 255, 95): '191', (215, 255, 135): '192', (215, 255, 175): '193', (215, 255, 215): '194', (215, 255, 255): '195', (255, 0, 95): '197', (255, 0, 135): '198', (255, 0, 175): '199', (255, 0, 215): '200', (255, 95, 0): '202', (255, 95, 95): '203', (255, 95, 135): '204', (255, 95, 175): '205', (255, 95, 215): '206', (255, 95, 255): '207', (255, 135, 0): '208', (255, 135, 95): '209', (255, 135, 135): '210', (255, 135, 175): '211', (255, 135, 215): '212', (255, 135, 255): '213', (255, 175, 0): '214', (255, 175, 95): '215', (255, 175, 135): '216', (255, 175, 175): '217', (255, 175, 215): '218', (255, 175, 255): '219', (255, 215, 0): '220', (255, 215, 95): '221', (255, 215, 135): '222', (255, 215, 175): '223', (255, 215, 215): '224', (255, 215, 255): '225', (255, 255, 95): '227', (255, 255, 135): '228', (255, 255, 175): '229', (255, 255, 215): '230', (8, 8, 8): '232', (18, 18, 18): '233', (28, 28, 28): '234', (38, 38, 38): '235', (48, 48, 48): '236', (58, 58, 58): '237', (68, 68, 68): '238', (78, 78, 78): '239', (88, 88, 88): '240', (98, 98, 98): '241', (108, 108, 108): '242', (118, 118, 118): '243', (138, 138, 138): '245', (148, 148, 148): '246', (158, 158, 158): '247', (168, 168, 168): '248', (178, 178, 178): '249', (188, 188, 188): '250', (198, 198, 198): '251', (208, 208, 208): '252', (218, 218, 218): '253', (228, 228, 228): '254', (238, 238, 238): '255'}`;
const greyText = `{(8, 8, 8): '232', (18, 18, 18): '233', (28, 28, 28): '234', (38, 38, 38): '235', (48, 48, 48): '236', (58, 58, 58): '237', (68, 68, 68): '238', (78, 78, 78): '239', (88, 88, 88): '240', (98, 98, 98): '241', (108, 108, 108): '242', (118, 118, 118): '243', (138, 138, 138): '245', (148, 148, 148): '246', (158, 158, 158): '247', (168, 168, 168): '248', (178, 178, 178): '249', (188, 188, 188): '250', (198, 198, 198): '251', (208, 208, 208): '252', (218, 218, 218): '253', (228, 228, 228): '254', (238, 238, 238): '255'}`;
const retroText = `#FFCC99, #CC6666, #669966, #FFFFCC, #996633, #9999FF, #FF9966, #FFCC66, #CC99CC, #666699, #99CCCC, #666633, #FF6666, #663333, #663399, #993333, #CC6633, #CCCC99, #CCCCFF, #CC9966`;
const sunriseText = `#FF6F61, #FF9A8B, #FFB77A, #FFCE7A, #FFD891, #FFE7B2, #FFF5D1, #FFBFA5, #FF9C9F, #FF7F67, #FF6C3F, #FF5722, #FF4C00, #FF3D00, #FF2C00`;
const floralText = `#FBEAE9, #ECBDC1, #D7A1A4, #8D9C80, #C2CBBA`;
const coldText = `#011F4B, #03396C, #005B96, #6497B1, #B3CDE0`;
const sunsetText = `#FEDA84, #FF9B83, #976393, #685489, #43457F`;
const cloudyText = `#C86DD7, #D5A6FD, #C4458C, #AA5E8B, #9B59B6, #D39DFF, #C9A9D4, #B77F8C, #E9D2F1, #B85C8A, #8E2F55, #D7A2E7, #B67D95, #A24D8D, #BF78D2`;
const gameboyText = `#9BBC0F, #8BAC0F, #306230, #0F380F, #0F380F`;
const pastelText = `#CE97FB, #F6A5EB, #FAA99D, #FDDF7E, #67EBFA`;
const midnightText = `#C17EFF, #A569BD, #9B59B6, #7D3C98, #6C3483`;

export const STYLES = ["retro", "sunrise", "floral", "cold", "sunset","cloudy", "gameboy","pastel","midnight"]
const stylesMap: { [key: string]: string } = {
  "retro": retroText,
  "sunrise": sunriseText,
  "floral": floralText,
  "cold": coldText,
  "sunset": sunsetText,
  "cloudy": cloudyText,
  "gameboy": gameboyText,
  "pastel": pastelText,
  "midnight": midnightText
}

function kdTreeDriver(colorMapping: a2a_color.ColorMapping): KDTree {
  const dim = 3;

  function distSqFunc(
    a: Point,
    b: Point
  ): number {
    return (
      ((a[0] - b[0]) * 0.3) ** 2 +
      ((a[1] - b[1]) * 0.59) ** 2 +
      ((a[2] - b[2]) * 0.11) ** 2
    );
  }

  const kdtree = new KDTree(
    Object.keys(colorMapping).map((key) => key.split(",").map(Number)),
    dim,
    distSqFunc
  );
  return kdtree;
}

function findKey(colorMapping: a2a_color.ColorMapping , code: string) {
  for (const [key, value] of Object.entries(colorMapping)) {
      if (value === code) return key;
  }
  return null;
}

function asciiRender(
  data: a2a_color.Pixel,
  char: string,
  colorMapping: a2a_color.ColorMapping,
  prevColors: { [key: string]: string },
  kdtree: KDTree 
) {
  let code: string = "0";
  if (char !== " ") {
    const pixelKey = data.toString();
    if (prevColors[pixelKey] !== undefined) {
      code = prevColors[pixelKey];
    } else {
      const nearest = kdtree.getNearest(data);
      if (nearest) {
        code = colorMapping[nearest[1].toString()];
        prevColors[pixelKey] = code;
      }
    }
  }
  return code;
}

function checkStyle(style: string) {
  if (STYLES.includes(style))
    return style
  return ""
}

async function imageToAsciiColor(
  colorMapping: a2a_color.ColorMapping,
  kdtree: KDTree,
  image: sharp.Sharp,
  width: number,
  style: string = ""
): Promise<string> {
  let img = image;
  const metadata = await img.metadata();
  const aspectRatio = metadata.height! / metadata.width!;
  img = img.resize({
    width: width,
    height: Math.floor((width * aspectRatio) / 2),
    fit: sharp.fit.fill,
    withoutEnlargement: true,
  });
  const buffer = await img.toBuffer();
  const { data, info } = await sharp(buffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const greyImg = await sharp(buffer)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const asciiChars = "@%#*+=-:. "; // ASCII characters from dark to light
  const prevColors: { [key: string]: string } = {};
  let asciiArt = "";

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * 3;
      const pixel: a2a_color.Pixel = [data[idx], data[idx + 1], data[idx + 2]];

      const greyIdx = y * info.width + x;
      const pixelIntensity = 255 - greyImg.data[greyIdx];

      const char =
        asciiChars[Math.floor((pixelIntensity * asciiChars.length) / 256)];
      if (checkStyle(style)) {
        const code = asciiRender(pixel, char, colorMapping, prevColors, kdtree);
        asciiArt += `<span style="color:rgb(${findKey(colorMapping,code)})">${char}</span>`
        continue;
      }
      const code = asciiRender(pixel, char, colorMapping, prevColors, kdtree);
      const val = parseInt(code)
      asciiArt += a2a_color.asciiColor(val, char);
    }
    asciiArt += "\n";
  }
  return asciiArt;
}

export async function imgDriver(
  image: sharp.Sharp,
  width: number,
  style: string = ""
): Promise<string> {
  let colorMapping: a2a_color.ColorMapping;
  if (style == "greyscale") 
    colorMapping = a2a_color.parseColorFile(greyText);
  else if (STYLES.includes(style)) 
    colorMapping = a2a_color.createColorMapping(stylesMap[style]);
  else colorMapping = a2a_color.parseColorFile(colorText);

  const kdtree = kdTreeDriver(colorMapping);
  const asciiArtColor = await imageToAsciiColor(
    colorMapping,
    kdtree,
    image,
    width,
    style
  );
  return asciiArtColor;
}

export async function imgMain(
  args: Args,
): Promise<string> {
  const img = sharp(args.filename);
  return "@FRAME@" + await imgDriver(img, args.width, args.style) + "@FRAME@";
}
