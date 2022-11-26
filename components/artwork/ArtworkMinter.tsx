import { NextPage } from "next";
import { useState } from "react";
import styled from "styled-components";
import { useAccount, useContractRead } from "wagmi";
import WizzmasArtworkMinterArtifact from "../../contracts/WizzmasArtworkMinter.json";
import ArtworkTypePicker from "./AvailableArtworkTypesPicker";
import ArtworkClaim from "./ArtworkClaim";
import ArtworkMint from "./ArtworkMint";
import AvailableArtworkTypesPicker from "./AvailableArtworkTypesPicker";

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
        <AvailableArtworkTypesPicker onArtworkSelected={setArtworkType} />
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
