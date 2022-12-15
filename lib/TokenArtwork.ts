import { getERC721Contract } from '../contracts/ERC721Contract'

function ipfs(url: string): string {
  return url.startsWith('ipfs://') ? `https://cloudflare-ipfs.com/ipfs/${url.replace('ipfs://', '')}` : url
}

export async function fetchERC721TokenUri(contractAddress: string, tokenId: number, provider: any): Promise<string> {
  const contract = getERC721Contract({
    address: contractAddress,
    provider: provider,
  })
  return contract.tokenURI(tokenId)
}

export async function fetchERC721Artwork(contractAddress: string, tokenId: number, provider: any): Promise<string> {
  return fetchERC721TokenUri(contractAddress, tokenId, provider).then((uri) => fetchArtwork(uri))
}

export async function fetchERC721Meta(contractAddress: string, tokenId: number, provider: any): Promise<string> {
  return fetchERC721TokenUri(contractAddress, tokenId, provider).then((uri) => fetchMeta(uri))
}

export async function fetchMeta(tokenURI: string): Promise<any> {
  return fetch(ipfs(tokenURI)).then((res) => res?.json())
}

export async function fetchArtwork(tokenURI: string): Promise<string> {
  return fetchMeta(tokenURI).then((data: any) => ipfs(data.image))
}
