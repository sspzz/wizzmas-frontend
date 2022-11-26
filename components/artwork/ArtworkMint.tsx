import { NextPage } from "next";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import WizzmasArtworkMinterArtifact from "../../contracts/WizzmasArtworkMinter.json";
import DisplayError from "../generic/DisplayError";

export type ArtworkMintProps = {
  artworkType: number;
};
const ArtworkMint: NextPage<ArtworkMintProps> = ({
  artworkType,
}: ArtworkMintProps) => {
  const {
    data: tokenFrozen,
    isError: isTokenFrozenError,
    isLoading: isTokenFrozenLoading,
  } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_ARTWORKMINTER_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasArtworkMinterArtifact.abi,
    functionName: "tokenFrozen",
    args: [artworkType],
  });

  const {
    data: mintPrice,
    isError: isPriceError,
    isLoading: isPriceLoading,
  } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_ARTWORKMINTER_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasArtworkMinterArtifact.abi,
    functionName: "mintPrice",
  });

  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName: process.env.NEXT_PUBLIC_ARTWORKMINTER_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasArtworkMinterArtifact.abi,
    functionName: "mint",
    args: [artworkType],
    overrides: { value: mintPrice },
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

  if (isPriceLoading || isTokenFrozenLoading) {
    return <></>;
  }

  return (
    <>
      <button disabled={!write || isLoading} onClick={() => write!()}>
        {isLoading ? "Minting..." : "Mint now"}
      </button>
      {(prepareError || error) && (
        <DisplayError error={prepareError || error} />
      )}
      {isSuccess && <h3>Congrats, you minted a WizzmasArtwork!</h3>}
    </>
  );
};

export default ArtworkMint;