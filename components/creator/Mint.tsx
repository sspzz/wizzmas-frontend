import { ethers } from 'ethers'
import { NextPage } from 'next'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import WizzmasCardArtifact from '../../contracts/artifacts/WizzmasCard.json'
import { PrimaryButton, SmallTitle } from '../generic/StyledComponents'
import DisplayError from '../generic/DisplayError'
import { SelectedToken } from './TokenPicker'

export type MintProps = {
  artworkType: number | undefined
  templateType: number | undefined
  message: string | undefined
  token: SelectedToken | undefined
  recipient: string | undefined
}

const Mint: NextPage<MintProps> = ({ artworkType, templateType, message, token, recipient }: MintProps) => {
  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName: process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS ?? '',
    contractInterface: WizzmasCardArtifact.abi,
    functionName: 'mint',
    args: [
      token?.tokenContract ? ethers.utils.getAddress(token.tokenContract) : undefined,
      token?.tokenId,
      artworkType,
      templateType,
      message,
      recipient ? ethers.utils.getAddress(recipient) : undefined,
    ],
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

  return (
    <>
      <PrimaryButton disabled={!write || isLoading} onClick={() => write!()}>
        {isLoading ? 'Minting...' : 'Mint now'}
      </PrimaryButton>
      {(prepareError || error) && <DisplayError error={prepareError || error} />}
      {isSuccess && <SmallTitle>Congrats, you sent a WizzmasCard to {recipient}!</SmallTitle>}
    </>
  )
}

export default Mint
