import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { getCardsContract } from "../../../../contracts/WizzmasCardContract";
import { card } from "../../../../lib/ImageUtil";
import { fetchERC721Artwork } from "../../../../lib/TokenArtwork";

function getProvider() {
  return new ethers.providers.StaticJsonRpcProvider("http://127.0.0.1:8545", {
    name: "Anvil",
    chainId: 31337,
  });
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = parseInt(req.query.token as string, 10);
  if (token == undefined) {
    return res.status(404).end();
  }

  try {
    const contract = getCardsContract({ provider: getProvider() });
    const mintedCard = await contract.getCard(token);
    const tokenImageURL = await fetchERC721Artwork(
      mintedCard.tokenContract,
      mintedCard.token,
      getProvider()
    );
    const artworkImageURL = `${
      process.env.VERCEL_URL ?? "http://localhost:3000"
    }/api/artwork/img/${mintedCard.artwork}`;

    const imageBuffer = await card({
      artworkImageUrl: artworkImageURL,
      senderImageUrl: tokenImageURL,
      message: mintedCard.message,
    });
    if (!imageBuffer) {
      return res.status(500).end();
    }
    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Cache-Control",
      `s-maxage=${24 * 6 * 60}, stale-while-revalidate=20`
    );
    return res.end(imageBuffer);
  } catch {
    return res.status(404).end();
  }
};
