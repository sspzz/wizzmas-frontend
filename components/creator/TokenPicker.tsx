import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAccount, useContractRead } from 'wagmi'
import { SUPPORTED_TOKENS } from '../../constants'
import { getNFTs } from '../../lib/AlchemyUtil'
import Picker from '../generic/Picker'
import { fetchRunesWalkCycleFront } from '../../lib/TokenArtwork'

export interface SelectedToken {
  tokenContract: string
  tokenId: number
}

type SelectedTokenProps = {
  onTokenSelected: (selected: SelectedToken) => void
}
const TokenPicker = ({ onTokenSelected }: SelectedTokenProps) => {
  const supportedTokens = SUPPORTED_TOKENS
  const { address } = useAccount()

  const [ownedTokens, setOwnedTokens] = useState<any | undefined>(undefined)
  const [ownedTokensError, setOwnedTokensError] = useState<Error | null>(null)

  if (!address) {
    return <p>Connect wallet to mint!</p>
  }

  useEffect(() => {
    getNFTs(
      address,
      supportedTokens.map((c) => c.toString())
    )
      .then((res) => setOwnedTokens(res.ownedNfts))
      .catch((error) => setOwnedTokensError(error))
  }, [supportedTokens])

  const renderItem = (item: any) => {
    let id = BigNumber.from(item.id.tokenId).toNumber()
    let imgUrl = fetchRunesWalkCycleFront(item.contract.address, id)
    return (
      <Item>
        <TokenImageWrapper>
          <TokenImage src={imgUrl} />
        </TokenImageWrapper>
        <TokenTextWrapper>
          <TokenText>{item.metadata.name}</TokenText>
        </TokenTextWrapper>
      </Item>
    )
  }

  if (ownedTokensError) {
    return <p>Could not load wallet NFTS....</p>
  }

  return (
    <TokenBox>
      <HStackScroll>
        {ownedTokens && (
          <>
            <Picker
              items={ownedTokens}
              onSelected={(item) =>
                onTokenSelected({
                  tokenContract: item.contract.address,
                  tokenId: BigNumber.from(item.id.tokenId).toNumber(),
                })
              }
              renderItem={renderItem}
            />
            {ownedTokens.length == 0 && <>You have no tokens.</>}
          </>
        )}
      </HStackScroll>
    </TokenBox>
  )
}

export const TokenBox = styled.div`
  width: 760px;
  height: 600px;
  overflow: scroll;
`

export const HStackScroll = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: stretch;
  flex-wrap: wrap;
  gap: 1em;
`

const Item = styled.div`
  width: 150px;
  height: 220px;
`

const TokenTextWrapper = styled.div`
  padding: 0.2em;
`

const TokenImageWrapper = styled.div`
  background-color: #c5a565;
`

const TokenText = styled.p`
  text-align: center;
  font-size: 0.9em;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  display: block;
  line-height: 1em;
  max-height: 2em; /* number of lines to show  */
`

const TokenImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`

export default TokenPicker
