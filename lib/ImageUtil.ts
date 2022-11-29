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
  artworkImageUrl: string | undefined;
  senderImageUrl: string | undefined;
  message: string | undefined;
  width?: number;
  height?: number;
};
export async function card({
  artworkImageUrl,
  senderImageUrl,
  message,
  width = 1080,
  height = 432,
}: CardParams) {
  try {
    const overlays: any[] = [];

    // Background
    const background = await sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    }).png();

    // Artwork
    var artwork = undefined;
    if (artworkImageUrl) {
      artwork = await sharp(await urlToBuffer(artworkImageUrl))
      .resize(width, height)
        .png()
        .toBuffer();
    }

    // Sender NFT
    var senderImage = undefined;
    const senderImageSize = { width: height * 0.8, height: height * 0.8 };
    if (senderImageUrl) {
      senderImage = await sharp(await urlToBuffer(senderImageUrl))
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
    }

    // Message
    var textOverlay = undefined;
    const textHeight = height / 2;
    const textWidth = width / 2;
    const textPadding = {
      top: height * (5 / 24),
      left: width * (29 / 60),
    };
    if (message) {
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
      textOverlay = await sharp(text).png().toBuffer();
    }

    // Compose
    if (artwork) {
      overlays.push({
        input: artwork,
        top: 0,
        left: 0,
      });
    }
    if (senderImage) {
      overlays.push({
        input: senderImage,
        top: Math.floor((height - senderImageSize.height) / 2),
        left: Math.floor((height - senderImageSize.height) / 2),
      });
    }
    if (textOverlay) {
      overlays.push({
        input: textOverlay,
        top: textPadding.top,
        left: textPadding.left,
      });
    }
    return background
      .composite(overlays)
      .toBuffer()
      .then((data: any) => sharp(data).png().toBuffer());
  } catch (error) {
    console.log(error);
  }
}
