import { getERC721Contract } from '../contracts/ERC721Contract'
import { FRWC_WIZARDS_ADDRESS, FRWC_SOULS_ADDRESS, FRWC_WARRIORS_ADDRESS } from '../constants'

function ipfs(url: string): string {
  return url.startsWith('ipfs://') ? `https://cloudflare-ipfs.com/ipfs/${url.replace('ipfs://', '')}` : url
}

export function fetchRunesWalkCycleFront(contractAddress: string, tokenId: number): string {
  return contractAddress.toLowerCase() == FRWC_WIZARDS_ADDRESS.toLowerCase()
    ? `https://runes-turnarounds.s3.amazonaws.com/${tokenId}/400/turnarounds/wizards-${tokenId}-0-front.png`
    : contractAddress.toLowerCase() == FRWC_SOULS_ADDRESS.toLowerCase()
    ? `https://runes-turnarounds.s3.amazonaws.com/souls/${tokenId}/souls-${tokenId}-0-front.png`
    : `https://runes-turnarounds.s3.amazonaws.com/warriors/${tokenId}/warriors-${tokenId}-0-front.png`
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
