import { ethers } from "ethers";
import { NextPage } from "next";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import DisplayError from "../generic/DisplayError";
import WizzmasCardArtifact from "../../contracts/WizzmasCard.json";
import { PrimaryButton, SmallTitle } from "../generic/StyledComponents";
import { SelectedERC721 } from "./SupportedERC721sPicker";
import { SelectedMessage } from "./MessagePicker";
import CardPreview from "./CardPreview";

export type CardMintProps = {
  nft: SelectedERC721 | undefined;
  artworkType: number | undefined;
  message: SelectedMessage | undefined;
  recipient: string | undefined;
};

const CardMint: NextPage<CardMintProps> = ({
  nft,
  artworkType,
  message,
  recipient,
}: CardMintProps) => {
  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName: process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasCardArtifact.abi,
    functionName: "mint",
    args: [
      nft?.tokenContract
        ? ethers.utils.getAddress(nft.tokenContract)
        : undefined,
      nft?.tokenId,
      artworkType,
      message?.messageId,
      recipient ? ethers.utils.getAddress(recipient) : undefined,
    ],
  });
  const { data, error, write } = useContractWrite(config);
  const {
    data: txData,
    isLoading,
    isSuccess,
  } = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
  });

  return (
    <>
      <div>Selected contract: {nft?.tokenContract}</div>
      <div>Selected token: {nft?.tokenId}</div>
      <div>Selected artwork: {artworkType}</div>
      <div>Selected message: {message?.message}</div>
      <div>Selected recipient: {recipient}</div>

      <CardPreview
        artworkType={artworkType}
        message={message}
        nft={nft}
        recipient={recipient}
      />

      <PrimaryButton disabled={!write || isLoading} onClick={() => write!()}>
        {isLoading ? "Minting..." : "Mint now"}
      </PrimaryButton>
      {(prepareError || error) && (
        <DisplayError error={prepareError || error} />
      )}
      {isSuccess && (
        <SmallTitle>
          Congrats, you sent a WizzmasCard to {recipient}!
        </SmallTitle>
      )}
    </>
  );
};

export default CardMint;
