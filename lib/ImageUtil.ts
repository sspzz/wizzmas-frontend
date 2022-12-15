import path from 'path'
import sharp from 'sharp'
import https from 'https'
import http from 'http'

async function urlToBuffer(url: string): Promise<Buffer> {
  const getter = url.startsWith('https') ? https : http
  return new Promise((resolve, reject) => {
    const data: Uint8Array[] = []
    getter.get(url, (res) => {
      res
        .on('data', (chunk: Uint8Array) => {
          data.push(chunk)
        })
        .on('end', () => {
          resolve(Buffer.concat(data))
        })
        .on('error', (err) => {
          reject(err)
        })
    })
  })
}

export type CardParams = {
  templatePath: string | undefined
  senderImageUrl: string | undefined
  message: string | undefined
  width?: number
  height?: number
}
export async function card({ templatePath, senderImageUrl, message, width = 750, height = 590 }: CardParams) {
  try {
    const overlays: any[] = []

    // Background
    const background = await sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    }).png()

    // Artwork
    var artwork = undefined
    if (templatePath) {
      artwork = await sharp(templatePath).resize(width, height).png().toBuffer()

      overlays.push({
        input: artwork,
        top: 0,
        left: 0,
      })
    }

    // Sender NFT
    var senderImage = undefined
    const senderImageSize = { width: height * 0.25, height: height * 0.25 }
    if (senderImageUrl) {
      senderImage = await sharp(await urlToBuffer(senderImageUrl))
        .resize(Math.floor(senderImageSize.width), Math.floor(senderImageSize.height), {
          kernel: sharp.kernel.nearest,
          fit: 'contain',
          position: 'right top',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer()

      overlays.push({
        input: senderImage,
        left: Math.floor(senderImageSize.height * 0.9),
        top: Math.floor(senderImageSize.height * 2.9),
      })
    }

    // Message
    var textOverlay = undefined
    const textHeight = height / 4.5
    const textWidth = width / 1.85
    const textPadding = {
      top: Math.floor(textHeight * 3.5),
      left: Math.floor(width - textWidth * 1.1),
    }
    if (message) {
      const text = {
        text: {
          text: message,
          width: textWidth,
          height: textHeight,
          align: 'center',
          font: 'Alagard',
          fontfile: path.resolve('./fonts', 'alagard/alagard.ttf'),
          rgba: true,
        },
      }
      textOverlay = await sharp(text).png().toBuffer()

      overlays.push({
        input: textOverlay,
        top: textPadding.top,
        left: textPadding.left,
      })
    }

    // Compose
    return background
      .composite(overlays)
      .toBuffer()
      .then((data: any) => sharp(data).png().toBuffer())
  } catch (error) {
    console.log(error)
  }
}
