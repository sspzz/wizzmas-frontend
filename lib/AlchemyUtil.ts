const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${apiKey}/getNFTs/`

export async function fetchNFTs(address: string, contracts: string[], pageKey: string = ''): Promise<any> {
  return fetch(`${baseURL}?owner=${address}&contractAddresses[]=${[...contracts]}&pageKey=${pageKey}`, {
    method: 'get',
    redirect: 'follow',
  }).then((res) => res.json())
}

export async function getNFTs(address: string, contracts: string[]): Promise<any> {
  let result = await fetchNFTs(address, contracts)

  // paginate if key present
  //todo: pretty sure it's pulling extra nfts and adding it to the array, might need to double check this and fix
  let nextResult = result
  while (result.ownedNfts.length < result.totalCount) {
    nextResult = await fetchNFTs(address, contracts, result.pageKey)
    result.ownedNfts = result.ownedNfts.concat(nextResult.ownedNfts)
  }

  return result
}
