import { BigNumber } from "ethers";
import { NextPage } from "next";
import { useState } from "react";
import { useContractRead } from "wagmi";
import WizzmasArtworkMinterArtifact from "../../contracts/WizzmasArtworkMinter.json";
import { range } from "../lib/ArrayUtil";
import ArtworkTypePicker from "./ArtworkTypePicker";

type AvailableArtworkTypesProps = {
  onArtworkSelected: (artworkType: number) => void;
};
const AvailableArtworkTypesPicker: NextPage<AvailableArtworkTypesProps> = ({
  onArtworkSelected,
}: AvailableArtworkTypesProps) => {
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
    <ArtworkTypePicker
      artworks={range(0, BigNumber.from(numArtworks).toNumber())}
      onArtworkSelected={onArtworkSelected}
    />
  );
};

export default AvailableArtworkTypesPicker;
