import * as argparse from 'argparse';
// import * as sys from 'sys';
// import * as gif2ascii from './art2ascii/gif2ascii';
// import * as img2ascii from './art2ascii/img2ascii';

function parseTuple(inputStr: string): [number, number, number, number] {
    try {
        const values = inputStr.replace(/[()]/g, '').split(',');
        if (values.length !== 4) {
            throw new Error('Tuple must contain exactly four comma-separated values.');
        }

        const mappedInt = values.map(value => parseInt(value, 10));
        if (mappedInt.some(isNaN)) {
            throw new Error();
        }
        return [mappedInt[0], mappedInt[1], mappedInt[2], mappedInt[3]];
    } catch (e) {
        throw new argparse.ArgumentParser().error('Tuple values must be integers.');
    }
}

function parseArguments() {
    const parser = new argparse.ArgumentParser({
        description: 'Command line options for converting images/GIFs into ASCII art.'
    });
    
    parser.add_argument('-f', '--filename', { type: 'string', help: 'Image/GIF filename' });
    parser.add_argument('-g', '--greyscale', { action: 'storeTrue', default: false, help: 'Enable greyscale (default: false)' });
    parser.add_argument('-r', '--resize', { type: 'float', default: 1.0, help: 'Resize factor (default: 1.0)' });
    parser.add_argument('-w', '--width', { type: 'int', default: 100, help: 'Width (default: 100)' });
    parser.add_argument('-s', '--save', { action: 'storeTrue', default: false, help: 'Save file (default: false)' });
    parser.add_argument('-o', '--output', { type: 'string', default: '', help: 'Output Directory' });
    parser.add_argument('-e', '--export', { action: 'storeTrue', default: false, help: 'Export data file' });
    parser.add_argument('-l', '--loops', { type: 'int', default: 10, help: 'Number of times to loop (default: 10)' });
    parser.add_argument('-b', '--border', { type: parseTuple, default: [1600, 70, 0, 400], help: 'Border input (format: "left,top,right,bottom")' });

    return parser.parseArgs();
}

async function main() {
    const args = parseArguments();

    if (!args.filename) {
        console.error('Error: Please provide a filename using the -f option.');
        return;
    }
    console.log("HELLO");

    // if (args.filename.toLowerCase().endsWith('.gif')) {
    //     await gif2ascii.gifMain(args);
    // } else {
    //     await img2ascii.imgMain(args);
    // }
}

if (require.main === module) {
    main();
}
