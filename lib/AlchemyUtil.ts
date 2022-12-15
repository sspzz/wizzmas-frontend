const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${apiKey}/getNFTs/`

export async function getNFTs(address: string, contracts: string[]): Promise<any> {
  return fetch(`${baseURL}?owner=${address}&contractAddresses[]=${[...contracts]}`, {
    method: 'get',
    redirect: 'follow',
  }).then((res) => res.json())
}
