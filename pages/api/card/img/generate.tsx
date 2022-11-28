import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { getERC721Contract } from "../../../../contracts/ERC721Contract";
import { card } from "../../../../lib/ImageUtil";
import { fetchERC721Artwork } from "../../../../lib/TokenArtwork";

function getProvider() {
  return new ethers.providers.StaticJsonRpcProvider("http://127.0.0.1:8545", {
    name: "Anvil",
    chainId: 31337,
  });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const artwork = parseInt(req.query.artwork as string, 10);
  const token = parseInt(req.query.token as string, 10);
  const tokenContract = req.query.contract as string;
  const message = req.query.message as string;

  if (
    token == undefined ||
    artwork == undefined ||
    tokenContract == undefined ||
    message == undefined
  ) {
    return res.status(404).end();
  }
  const contract = getERC721Contract({
    address: tokenContract,
    provider: getProvider(),
  });
  const tokenImageURL = await fetchERC721Artwork(
    tokenContract,
    token,
    getProvider()
  );
  const imageBuffer = await card({
    artwork: artwork,
    senderImageUrl: tokenImageURL,
    message: message,
  });
  if (!imageBuffer) {
    return res.status(404).end();
  }
  res.setHeader("Content-Type", "image/png");
  res.setHeader(
    "Cache-Control",
    `s-maxage=${24 * 6 * 60}, stale-while-revalidate=20`
  );
  return res.end(imageBuffer);
};
