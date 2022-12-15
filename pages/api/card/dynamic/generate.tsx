import { ethers } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCardsContract } from '../../../../contracts/WizzmasCardContract'

function getProvider() {
  return new ethers.providers.StaticJsonRpcProvider('http://127.0.0.1:8545', {
    name: 'Anvil',
    chainId: 31337,
  })
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const artwork = parseInt(req.query.artwork as string, 10)
  const template = parseInt(req.query.template as string, 10)
  const token = parseInt(req.query.token as string, 10)
  const tokenContract = req.query.contract as string
  const message = req.query.message as string

  try {
    const frontUrl = `${process.env.VERCEL_URL ?? 'http://localhost:3000'}/api/artwork/img/${artwork}`

    const backUrl = `${
      process.env.VERCEL_URL ?? 'http://localhost:3000'
    }/api/card/img/generate?token=${token}&contract=${tokenContract}&message=${message}&template=${template}`

    const content = `
        <!DOCTYPE html>
        <html>
        <head>
        <style>
        /* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
        .flip-card {
            background-color: transparent;
            width: 750px;
            height: 590px;
            border: 1px solid #f1f1f1;
            perspective: 1000px; /* Remove this if you don't want the 3D effect */
        }
        
        /* This container is needed to position the front and back side */
        .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            transition: transform 0.8s;
            transform-style: preserve-3d;
        }
        
        /* Do an horizontal flip when you move the mouse over the flip box container */
        .flip-card:hover .flip-card-inner {
            transform: rotateY(180deg);
        }
        
        /* Position the front and back side */
        .flip-card-front, .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            -webkit-backface-visibility: hidden; /* Safari */
            backface-visibility: hidden;
        }
        
        /* Style the front side (fallback if image is missing) */
        .flip-card-front {
            background-color: #bbb;
            color: black;
        }
        
        /* Style the back side */
        .flip-card-back {
            background-color: dodgerblue;
            color: white;
            transform: rotateY(180deg);
        }
        </style>
        <head>
        <body>
        <div class="flip-card">
        <div class="flip-card-inner">
            <div class="flip-card-front">
            <img src="${frontUrl}" alt="Front" style="width:750px;height:590px;object-fit:contain;">
            </div>
            <div class="flip-card-back">
            <img src="${backUrl}" alt="Back" style="width:750px;height:590px;object-fit:contain;">
            </div>
        </div>
        </div>
        </body>
        </html>
    `
    return res.end(content)
  } catch {
    return res.status(404).end()
  }
}

export default handler
