import { ethers } from "ethers";
import { NextPage } from "next";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import DisplayError from "../DisplayError";
import WizzmasCardArtifact from "../../contracts/WizzmasCard.json";

export type CardMintProps = {
  nftContract: string | undefined;
  nftTokenId: number | undefined;
  artworkType: number | undefined;
  messageId: number | undefined;
  recipient: string | undefined;
};

const CardMint: NextPage<CardMintProps> = ({
  nftContract,
  nftTokenId,
  artworkType,
  messageId,
  recipient,
}: CardMintProps) => {
  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName: process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasCardArtifact.abi,
    functionName: "mint",
    args: [
      nftContract ? ethers.utils.getAddress(nftContract) : undefined,
      nftTokenId,
      artworkType,
      messageId,
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
      {nftContract != undefined && <div>Selected contract: {nftContract}</div>}
      {nftTokenId != undefined && <div>Selected token: {nftTokenId}</div>}
      {artworkType != undefined && <div>Selected artwork: {artworkType}</div>}
      {messageId != undefined && <div>Selected message: {messageId}</div>}
      {recipient != undefined && <div>Selected recipient: {recipient}</div>}

      <button disabled={!write || isLoading} onClick={() => write!()}>
        {isLoading ? "Minting..." : "Mint now"}
      </button>
      {(prepareError || error) && (
        <DisplayError error={prepareError || error} />
      )}
      {isSuccess && <h3>Congrats, you sent a WizzmasCard to {recipient}!</h3>}
    </>
  );
};

export default CardMint;
