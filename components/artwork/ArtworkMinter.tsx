import { NextPage } from "next";
import { useState } from "react";
import styled from "styled-components";
import { useAccount, useContractRead } from "wagmi";
import WizzmasArtworkMinterArtifact from "../../contracts/artifacts/WizzmasArtworkMinter.json";
import ArtworkTypePicker from "./AvailableArtworkTypesPicker";
import ArtworkClaim from "./ArtworkClaim";
import ArtworkMint from "./ArtworkMint";
import AvailableArtworkTypesPicker from "./AvailableArtworkTypesPicker";
import {
  MediumTitle,
  Segment,
  SmallTitle,
  VStack,
} from "../generic/StyledComponents";

const ArtworkMinter: NextPage = () => {
  const [artworkType, setArtworkType] = useState<number | undefined>(undefined);

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
    return <SmallTitle>Connect wallet to mint!</SmallTitle>;
  }

  if (isMintEnabledLoading || isCanClaimLoading) {
    return <SmallTitle>Loading...</SmallTitle>;
  }

  if (isMintEnabledError) {
    return <SmallTitle>Could not read contract information!</SmallTitle>;
  }

  if (mintEnabled) {
    return (
      <Content>
        <VStack>
          <MediumTitle>Wizzmas Artwork</MediumTitle>
          <Content>
            <AvailableArtworkTypesPicker onArtworkSelected={setArtworkType} />
          </Content>
          {canClaim && <ArtworkClaim artworkType={artworkType} />}
          {/* {!canClaim && <ArtworkMint artworkType={artworkType} />} */}
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

export default ArtworkMinter;
