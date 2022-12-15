import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { ethers } from 'ethers'
import { getCardsContract } from '../../../../contracts/WizzmasCardContract'

function getProvider() {
  return new ethers.providers.StaticJsonRpcProvider('http://127.0.0.1:8545', {
    name: 'Anvil',
    chainId: 31337,
  })
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.token == undefined) {
    return res.end(404)
  }

  const token = parseInt(req.query.token as string, 10)
  const provider = getProvider()
  const contract = getCardsContract({ provider: provider })
  const available = (await contract.numTemplates()).gt(token)
  if (!available) {
    return res.status(404).end()
  }

  const imagePath = path.resolve('./data/template', `img/${token}.png`)
  if (!fs.existsSync(imagePath)) {
    return res.end(404)
  }
  const imageBuffer = fs.readFileSync(imagePath)
  return res.end(imageBuffer)
}

export default handler
