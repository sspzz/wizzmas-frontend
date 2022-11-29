import { useEffect, useState } from "react";
import styled from "styled-components";
import { useContractRead, useContractReads, useProvider } from "wagmi";
import WizzmasCardArtifact from "../../contracts/WizzmasCard.json";
import { BigNumber, Contract } from "ethers";
import { getNFTs } from "../../lib/AlchemyUtil";
import Picker from "../generic/Picker";

export interface SelectedERC721 {
  tokenContract: string;
  tokenId: number;
  imageURL: string;
}

type SupportedERC721sPickerProps = {
  address: string;
  onERC721Selected: (selected: SelectedERC721) => void;
};
const SupportedERC721sPicker = ({
  address,
  onERC721Selected,
}: SupportedERC721sPickerProps) => {
  const {
    data: contracts,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasCardArtifact.abi,
    functionName: "supportedContracts",
  });

  const [ownedNFTs, setOwnedNFTs] = useState<any | undefined>(undefined);
  const [ownedNFTsError, setOwnedNFTsError] = useState<Error | null>(null);
  useEffect(() => {
    if (contracts) {
      getNFTs(
        address,
        contracts.map((c) => c.toString())
      )
        .then((res) => setOwnedNFTs(res.ownedNfts))
        .catch((error) => setOwnedNFTsError(error));
    }
  }, [contracts]);

  const renderItem = (item: any) => {
    return (
      <Item>
        <TokenImage src={item.media[0].gateway} />
        <TokenTextWrapper>
          <TokenText>{item.metadata.name}</TokenText>
        </TokenTextWrapper>
      </Item>
    );
  };

  if (isLoading) {
    return <>Loading supported NFTs...</>;
  }

  if (isError) {
    return <>Could not load supported NFTs...</>;
  }

  if (ownedNFTsError) {
    return <>Could not load wallet NFTs...</>;
  }

  return (
    <div>
      <h3>Select NFT:</h3>
      <TokenGrid>
        {ownedNFTs && (
          <>
            <Picker
              items={ownedNFTs}
              onSelected={(item) =>
                onERC721Selected({
                  tokenContract: item.contract.address,
                  tokenId: BigNumber.from(item.id.tokenId).toNumber(),
                  imageURL: item.media[0].gateway,
                })
              }
              renderItem={renderItem}
            />
            {ownedNFTs.length == 0 && <>You have no tokens.</>}
          </>
        )}
      </TokenGrid>
    </div>
  );
};

const TokenGrid = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: stretch;
  flex-wrap: wrap;
  gap: 1em;
`;

const Item = styled.div`
  width: 150px;
  height: 220px;
`;

const TokenTextWrapper = styled.div`
  padding: 0.2em;
`;
const TokenText = styled.p`
  text-align: center;
  font-size: 0.9em;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  display: block;
  line-height: 1em;
  max-height: 2em; /* number of lines to show  */
`;

const TokenImage = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

export default SupportedERC721sPicker;
