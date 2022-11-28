import path from "path";
import sharp from "sharp";
import https from "https";
import http from "http";

async function urlToBuffer(url: string): Promise<Buffer> {
  const getter = url.startsWith("https") ? https : http;
  return new Promise((resolve, reject) => {
    const data: Uint8Array[] = [];
    getter.get(url, (res) => {
      res
        .on("data", (chunk: Uint8Array) => {
          data.push(chunk);
        })
        .on("end", () => {
          resolve(Buffer.concat(data));
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  });
}

export type CardParams = {
  artwork: number;
  senderImageUrl: string;
  message: string;
  width?: number;
  height?: number;
};
export async function card({
  artwork,
  senderImageUrl,
  message,
  width = 1080,
  height = 432,
}: CardParams) {
  try {
    const textHeight = height / 2;
    const textWidth = width / 2;
    const textPadding = {
      top: height * (5 / 24),
      left: width * (29 / 60),
    };
    const text = {
      text: {
        text: message,
        width: textWidth,
        height: textHeight,
        align: "center",
        font: "Alagard",
        fontfile: path.resolve("./fonts", "alagard/alagard.ttf"),
        rgba: true,
      },
    };
    let textOverlay = await sharp(text).png().toBuffer();

    const background = await sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 66, g: 66, b: 66, alpha: 1 },
      },
    }).png();

    const senderImageSize = { width: height * 0.8, height: height * 0.8 };
    const senderImage = await sharp(await urlToBuffer(senderImageUrl))
      .resize(
        Math.floor(senderImageSize.width),
        Math.floor(senderImageSize.height),
        {
          kernel: sharp.kernel.nearest,
          fit: "contain",
          position: "right top",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        }
      )
      .png()
      .toBuffer();

    return background
      .composite([
        {
          input: senderImage,
          top: Math.floor((height - senderImageSize.height) / 2),
          left: Math.floor((height - senderImageSize.height) / 2),
        },
        {
          input: textOverlay,
          top: textPadding.top,
          left: textPadding.left,
        },
      ])
      .toBuffer()
      .then((data: any) => sharp(data).png().toBuffer());
  } catch (error) {
    console.log(error);
  }
}
