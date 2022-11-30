import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { getArtworkMinterContract } from "../../../../contracts/WizzmasArtworkMinterContract";
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

  const provider = getProvider();

  var artworkImageURL = undefined;
  if (req.query.artwork !== undefined) {
    const contract = getArtworkMinterContract({ provider: provider });
    const available = (await contract.numArtworkTypes()).gt(artwork);
    if (!available) {
      return res.status(404).end();
    }
    artworkImageURL = `${
      process.env.VERCEL_URL ?? "http://localhost:3000"
    }/api/artwork/img/${artwork}`;
  }

  var tokenImageURL = undefined;
  if (req.query.contract !== undefined && req.query.token !== undefined) {
    tokenImageURL = await fetchERC721Artwork(tokenContract, token, provider);
  }

  const imageBuffer = await card({
    artworkImageUrl: artworkImageURL,
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
