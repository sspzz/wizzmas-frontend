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
  useEffect(() => {
    if (contracts) {
      console.log(contracts);
      getNFTs(
        address,
        contracts.map((c) => c.toString())
      ).then((res) => setOwnedNFTs(res.ownedNfts));
    }
  }, [contracts]);

  const renderItem = (item: any) => {
    return <TokenImage src={item.media[0].gateway} />;
  };

  if (isLoading) {
    return <>Loading supported NFTs...</>;
  }

  if (isError) {
    return <>Could not load supported NFTs...</>;
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
                  imageURL: item.media[0].gateway
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

const TokenImage = styled.img`
  width: 100px;
  height: 100px;
  border-style: dashed;
  border-color: #444;
`;

export default SupportedERC721sPicker;
