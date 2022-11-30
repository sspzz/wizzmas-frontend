import styled from "styled-components";
import { useAccount, useContractRead } from "wagmi";
import { useState } from "react";
import WizzmasCardArtifact from "../../contracts/WizzmasCard.json";
import WalletArtworkTypePicker from "./WalletArtworkTypePicker";
import SupportedERC721sPicker, {
  SelectedERC721,
} from "./SupportedERC721sPicker";
import MessagePicker, { SelectedMessage } from "./MessagePicker";
import RecipientAddressInput from "./RecipientAddressInput";
import CardMint, { CardMintProps } from "./CardMint";
import { MediumTitle, SmallTitle, VStack } from "../generic/StyledComponents";
import CardPreview from "./CardPreview";

const CardMinter = () => {
  const { address } = useAccount();
  const {
    data: mintEnabled,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasCardArtifact.abi,
    functionName: "mintEnabled",
  });

  const [selectedArtwork, setSelecteArtwork] = useState<number | undefined>(
    undefined
  );
  const [selectedNFT, setSelectedNFT] = useState<SelectedERC721 | undefined>(
    undefined
  );
  const [selectedMessage, setSelectedMessage] = useState<
    SelectedMessage | undefined
  >(undefined);
  const [recipient, setRecipient] = useState<string | undefined>(undefined);

  if (!address) {
    return <SmallTitle>Connect wallet to mint!</SmallTitle>;
  }

  if (isLoading) {
    return <SmallTitle>Loading...</SmallTitle>;
  }

  if (isError) {
    return <SmallTitle>Could not read contract information!</SmallTitle>;
  }

  if (mintEnabled) {
    return (
      <Content>
        <VStack>
          <MediumTitle>Wizzmas Cards</MediumTitle>

          <Content>
            <WalletArtworkTypePicker
              address={address}
              onArtworkSelected={setSelecteArtwork}
            />
          </Content>

          <Content>
            <SupportedERC721sPicker
              address={address}
              onERC721Selected={setSelectedNFT}
            />
          </Content>

          <Content>
            <MessagePicker onCardMessageIdSelected={setSelectedMessage} />
          </Content>

          <Content>
            <RecipientAddressInput onRecipientValid={setRecipient} />
          </Content>

          <CardPreviewWrapper>
            <CardPreview
              artworkType={selectedArtwork}
              message={selectedMessage}
              nft={selectedNFT}
              recipient={recipient}
            />
          </CardPreviewWrapper>
          <CardMint
            artworkType={selectedArtwork}
            message={selectedMessage}
            nft={selectedNFT}
            recipient={recipient}
          />
        </VStack>
      </Content>
    );
  } else {
    return <p>Mint is closed!</p>;
  }
};

const Content = styled.div`
  border-style: dashed;
  border-color: #444;
  padding: 1em;
  margin: 1em;
`;

const CardPreviewWrapper = styled.div`
  background: gray;
`;

export default CardMinter;
