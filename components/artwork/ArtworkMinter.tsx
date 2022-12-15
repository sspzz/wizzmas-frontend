import { NextPage } from 'next'
import { useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import WizzmasArtworkMinterArtifact from '../../contracts/artifacts/WizzmasArtworkMinter.json'
import ArtworkClaim from './ArtworkClaim'
import ArtworkMint from './ArtworkMint'
import CoverViewer from './CoverViewer'
import { MediumTitle, SmallTitle } from '../generic/StyledComponents'

const ArtworkMinter: NextPage = () => {
  const [artworkType, setArtworkType] = useState<number | undefined>(undefined)

  const { address } = useAccount()
  const {
    data: canClaim,
    isError: isCanClaimError,
    isLoading: isCanClaimLoading,
  } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_ARTWORKMINTER_CONTRACT_ADDRESS ?? '',
    contractInterface: WizzmasArtworkMinterArtifact.abi,
    functionName: 'canClaim',
    args: [address],
  })

  const {
    data: mintEnabled,
    isError: isMintEnabledError,
    isLoading: isMintEnabledLoading,
  } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_ARTWORKMINTER_CONTRACT_ADDRESS ?? '',
    contractInterface: WizzmasArtworkMinterArtifact.abi,
    functionName: 'mintEnabled',
  })

  if (mintEnabled) {
    return (
      <>
        <MediumTitle>Wizzmas Cover</MediumTitle>
        <CoverViewer />
        {!mintEnabled && <SmallTitle>Mint is Over!</SmallTitle>}
        {!address && mintEnabled && <SmallTitle>Connect wallet to mint!</SmallTitle>}
        {canClaim && address && mintEnabled && <ArtworkClaim artworkType={0} />}
        {!canClaim && address && mintEnabled && <ArtworkMint artworkType={0} />}
      </>
    )
  } else {
    return <p>Mint is closed!</p>
  }
}

export default ArtworkMinter
