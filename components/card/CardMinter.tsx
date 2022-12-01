import styled from "styled-components";
import { useAccount, useContractRead } from "wagmi";
import { useState } from "react";
import WizzmasCardArtifact from "../../contracts/artifacts/WizzmasCard.json";
import WalletArtworkTypePicker from "./WalletArtworkTypePicker";
import SupportedERC721sPicker, {
  SelectedERC721,
} from "./SupportedERC721sPicker";
import MessagePicker, { SelectedMessage } from "./MessagePicker";
import RecipientAddressInput from "./RecipientAddressInput";
import { MediumTitle, SmallTitle, VStack } from "../generic/StyledComponents";
import CardMint from "./CardMint";
import TemplatePicker from "./TemplatePicker";

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
  const [selectedTemplate, setSelectedTemplate] = useState<number | undefined>(
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
            <TemplatePicker onTemplateSelected={setSelectedTemplate} />
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

          <CardMint
            artworkType={selectedArtwork}
            templateType={selectedTemplate}
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

export default CardMinter;
