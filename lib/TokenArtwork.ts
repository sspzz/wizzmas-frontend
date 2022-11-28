import { getERC721Contract } from "../contracts/ERC721Contract";

function ipfs(url: string): string {
  return url.startsWith("ipfs://")
    ? `https://cloudflare-ipfs.com/ipfs/${url.replace("ipfs://", "")}`
    : url;
}

export async function fetchERC721Artwork(
  contractAddress: string,
  tokenId: number,
  provider: any
): Promise<string> {
  const contract = getERC721Contract({
    address: contractAddress,
    provider: provider,
  });
  const uri = await contract.tokenURI(tokenId);
  return fetchArtwork(uri);
}

export async function fetchArtwork(tokenURI: string): Promise<string> {
  return fetch(ipfs(tokenURI))
    .then((res) => res?.json())
    .then((data: any) => ipfs(data.image))
}
