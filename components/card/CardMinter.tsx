import { NextPage } from "next";
import styled from "styled-components";
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import DisplayError from "../DisplayError";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import WizzmasCardArtifact from "../../contracts/WizzmasCard.json";
import WizzmasArtworkArtifact from "../../contracts/WizzmasArtwork.json";
import WizzmasArtworkMinterArtifact from "../../contracts/WizzmasArtworkMinter.json";
import { range } from "../lib/ArrayUtil";
import WalletArtworkTypePicker from "./WalletArtworkTypePicker";
import SupportedERC721sPicker, { SelectedERC721 } from "./SupportedERC721sPicker";
import CardMessagePicker from "./CardMessagePicker";
import RecipientAddressInput from "./RecipientAddressInput";
import CardMint from "./CardMint";

// TODO:
// 1. - Get connected wallet Artworks
//         - numTokenTypes from Artworks contract
//         - balanceOf(0...numTokenTypes-1)->tokenOfOwnerByIndex()
//         - image from local store
//    - Select Artwork (token id)
//
// 2. - Get wallet NFTs per supported NFT
//         - supportedContracts from Card contract
//         - supportedContracs.map((c) => c.balanceOf()->c.tokenOfOwnerByIndex())
//         - images from meta with tokenURI()
//    - Select NFT (contract address, token id)
//
// 3. - Get available Messages from Cards contract
//    - Select Message (string)
//
// 4. - Enter recipient (validate address)
//
// 5. Mint!

// ===========================================================================

// ===========================================================================

// ===========================================================================

// ===========================================================================

// ===========================================================================

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
  const [selectedMessage, setSelectedMessage] = useState<number | undefined>(
    undefined
  );
  const [recipient, setRecipient] = useState<string | undefined>(undefined);

  if (!address) {
    return <h3>Connect wallet to mint!</h3>;
  }

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h3>Could not read contract information!</h3>;
  }

  if (mintEnabled) {
    return (
      <Content>
        <h2>WizzmasCard:</h2>

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
          <CardMessagePicker onCardMessageIdSelected={setSelectedMessage} />
        </Content>

        <Content>
          <RecipientAddressInput onRecipientValid={setRecipient} />
        </Content>

        <Content>
          <CardMint
            artworkType={selectedArtwork}
            messageId={selectedMessage}
            nftContract={selectedNFT?.tokenContract}
            nftTokenId={selectedNFT?.tokenId}
            recipient={recipient}
          />
        </Content>
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
