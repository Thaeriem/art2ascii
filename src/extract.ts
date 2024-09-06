import * as https from "https";
import * as fs from "fs";
import * as path from "path";

function downloadImage(url: string, dest: string, cb: (err: Error | null) => void) {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                cb(null);
            });
        } else cb(new Error(`Failed to get image, status code: ${response.statusCode}`));
    }).on('error', (err) => {
        fs.unlink(dest, () => cb(err));
    });
}

// Function to fetch HTML and extract GIF URL
function fetchHTML(url: string, cb: (err: Error | null, html?: string) => void) {
    https.get(url, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
            if (response.statusCode === 200) cb(null, data);
            else cb(new Error(`Failed to fetch HTML, status code: ${response.statusCode}`));
        });
    }).on('error', (err) => {
        console.log("HELLO")
        cb(err);
    });
}

function extractGifUrl(html: string): string | null {
    const gifUrlRegex = /https:\/\/[^\s]+\.gif/g;
    const match = gifUrlRegex.exec(html);
    return match ? match[0] : null;
}

export function downloadGif(pageUrl: string, dest: string, cb: (err: Error | null) => void) {
    const gifDirectLink = pageUrl.match(/https?:\/\/.*\.gif/i);
    if (gifDirectLink) {
        const cleanGifUrl = gifDirectLink[0].split('?')[0];
        return downloadImage(cleanGifUrl, dest, cb);
    }
    fetchHTML(pageUrl, (err, html) => {
        if (err) return cb(err);
        const gifUrl = extractGifUrl(html!);
        if (gifUrl) downloadImage(gifUrl, dest, cb); 
        else cb(new Error('Failed to extract GIF URL.'));
    });
}