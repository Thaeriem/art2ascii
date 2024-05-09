import { AnsiUp } from "ansi_up";
import express from "express";
import fs from "fs";

const ansi_up = new AnsiUp();

const txt = fs.readFileSync("src/example.txt", "utf-8");

const html = ansi_up.ansi_to_html(txt);
const darkGreyBackgroundStyle = `<style>body { background-color: #333; }</style>`;

// Wrap the HTML content with the dark grey background style
const wrappedHtml = `<pre>${darkGreyBackgroundStyle}${html}</pre>`;
const app = express();

app.get("/", (req: any, res: any) => {
  res.send(wrappedHtml);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
