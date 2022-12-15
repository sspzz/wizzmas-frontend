import { NextPage } from 'next'
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import WizzmasArtworkMinterArtifact from '../../contracts/artifacts/WizzmasArtworkMinter.json'
import DisplayError from '../generic/DisplayError'
import { PrimaryButton, SmallTitle } from '../generic/StyledComponents'

export type ArtworkMintProps = {
  artworkType: number | undefined
}
const ArtworkMint: NextPage<ArtworkMintProps> = ({ artworkType }: ArtworkMintProps) => {
  const {
    data: mintPrice,
    isError: isPriceError,
    isLoading: isPriceLoading,
  } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_ARTWORKMINTER_CONTRACT_ADDRESS ?? '',
    contractInterface: WizzmasArtworkMinterArtifact.abi,
    functionName: 'mintPrice',
  })

  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName: process.env.NEXT_PUBLIC_ARTWORKMINTER_CONTRACT_ADDRESS ?? '',
    contractInterface: WizzmasArtworkMinterArtifact.abi,
    functionName: 'mint',
    args: [artworkType],
    overrides: { value: mintPrice },
  })
  const { data, error, write } = useContractWrite(config)
  const {
    data: txData,
    isLoading,
    isSuccess,
  } = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
  })

  if (isPriceLoading) {
    return <></>
  }

  return (
    <>
      <PrimaryButton disabled={!write || isLoading} onClick={() => write!()}>
        {isLoading ? 'Minting...' : 'Mint now'}
      </PrimaryButton>
      {(prepareError || error) && <DisplayError error={prepareError || error} />}
      {isSuccess && <SmallTitle>Congrats, you minted a WizzmasArtwork!</SmallTitle>}
    </>
  )
}

export default ArtworkMint
