import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { getArtworksContract } from "../../../../contracts/WizzmasArtworkContract";
import { ethers } from "ethers";

function getProvider() {
  return new ethers.providers.StaticJsonRpcProvider("http://localhost:8545", {
    name: "Anvil",
    chainId: 31337,
  });
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = parseInt(req.query.token as string, 10);
  const provider = getProvider();
  const contract = getArtworksContract({ provider: provider });
  const minted = (await contract.tokenSupply(token)).gt(0);
  if (!minted) {
    return res.status(404).end();
  }
  const imagePath = path.resolve("../data", `img/${token}.png`);
  const imageBuffer = fs.readFileSync(imagePath);
  return res.end(imageBuffer);
};

export default handler;
