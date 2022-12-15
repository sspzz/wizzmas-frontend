import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { getArtworkMinterContract } from '../../../../contracts/WizzmasArtworkMinterContract'
import { ethers } from 'ethers'

function getProvider() {
  return new ethers.providers.StaticJsonRpcProvider('http://127.0.0.1:8545', {
    name: 'Anvil',
    chainId: 31337,
  })
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = parseInt(req.query.token as string, 10)
  const provider = getProvider()
  const contract = getArtworkMinterContract({ provider: provider })
  const available = (await contract.numArtworkTypes()).gt(token)
  if (!available) {
    return res.status(404).end()
  }
  const imagePath = path.resolve('./data/artwork', `gif/${token}.gif`)
  const imageBuffer = fs.readFileSync(imagePath)
  return res.end(imageBuffer)
}

export default handler
