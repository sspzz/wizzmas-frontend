import { BigNumber } from "ethers";
import { NextPage } from "next";
import { createContext, useContext, useState } from "react";
import styled from "styled-components";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import WizzmasArtworkMinterArtifact from "../contracts/WizzmasArtworkMinter.json";
import DisplayError from "./DisplayError";
import { range } from "./lib/ArrayUtil";

type ArtworkTypePickerProps = {
  onArtworkSelected: (artworkType: number) => void;
};
const ArtworkTypePicker = ({ onArtworkSelected }: ArtworkTypePickerProps) => {
  const [artworkType, setArtworkType] = useState<number>(0);

  const {
    data: numArtworks,
    isError: isNumArtworksError,
    isLoading: isNumArtworksLoading,
  } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_ARTWORKMINTER_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasArtworkMinterArtifact.abi,
    functionName: "numArtworkTypes",
  });

  if (isNumArtworksLoading) {
    return <></>;
  }

  if (isNumArtworksError) {
    return <>Could not load WizzmasArtwork types!</>;
  }

  return (
    <Content>
      <h2>Select Artwork:</h2>
      <div>
        <select
          onChange={(e) => {
            const val = parseInt(e.target.value);
            onArtworkSelected(val);
            setArtworkType(val);
          }}
        >
          {range(0, BigNumber.from(numArtworks).toNumber()).map((i) => (
            <option key={i} value={i}>
              {" "}
              Artwork #{i}
            </option>
          ))}
        </select>
      </div>
    </Content>
  );
};

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
    <Content>
      <button disabled={!write || isLoading} onClick={() => write!()}>
        {isLoading ? "Minting..." : "Mint now"}
      </button>
      {(prepareError || error) && (
        <DisplayError error={prepareError || error} />
      )}
      {isSuccess && <h3>Congrats, you minted a WizzmasArtwork!</h3>}
    </Content>
  );
};

const ArtworkClaim: NextPage<ArtworkMintProps> = ({
  artworkType,
}: ArtworkMintProps) => {
  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName: process.env.NEXT_PUBLIC_ARTWORKMINTER_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasArtworkMinterArtifact.abi,
    functionName: "claim",
    args: [artworkType],
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

  if (isSuccess) {
    return <h3>Congrats, you claimed a free WizzmasArtwork!</h3>;
  }

  return (
    <Content>
      <button disabled={!write || isLoading} onClick={() => write!()}>
        {isLoading ? "Claiming..." : "Claim now"}
      </button>
      {(prepareError || error) && (
        <DisplayError error={prepareError || error} />
      )}
    </Content>
  );
};

const ArtworkMinter: NextPage = () => {
  const [artworkType, setArtworkType] = useState<number>(0);

  const { address } = useAccount();
  const {
    data: canClaim,
    isError: isCanClaimError,
    isLoading: isCanClaimLoading,
  } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_ARTWORKMINTER_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasArtworkMinterArtifact.abi,
    functionName: "canClaim",
    args: [address],
  });

  const {
    data: mintEnabled,
    isError: isMintEnabledError,
    isLoading: isMintEnabledLoading,
  } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_ARTWORKMINTER_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasArtworkMinterArtifact.abi,
    functionName: "mintEnabled",
  });

  if (!address) {
    return <h3>Connect wallet to mint!</h3>;
  }

  if (isMintEnabledLoading || isCanClaimLoading) {
    return <h2>Loading...</h2>;
  }

  if (isMintEnabledError) {
    return <h3>Could not read contract information!</h3>;
  }

  if (mintEnabled) {
    return (
      <Content>
        <h2>WizzmasArtwork:</h2>
        <ArtworkTypePicker
          onArtworkSelected={(artworkType) => {
            setArtworkType(artworkType);
          }}
        />
        {canClaim && <ArtworkClaim artworkType={artworkType} />}
        {!canClaim && <ArtworkMint artworkType={artworkType} />}
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

export default ArtworkMinter;
