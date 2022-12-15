import { NextPage } from "next";
import { useAccount, useContractRead } from "wagmi";
import WizzmasArtworkMinterArtifact from "../../contracts/artifacts/WizzmasArtworkMinter.json";
import ArtworkClaim from "./ArtworkClaim";
import ArtworkMint from "./ArtworkMint";
import CoverViewer from "./CoverViewer";
import { MediumTitle, SmallTitle } from "../generic/StyledComponents";

const ArtworkMinter: NextPage = () => {
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

  if (isMintEnabledError) {
    return <SmallTitle>Could not read contract information!</SmallTitle>;
  }

  if (mintEnabled) {
    return (
      <>
        <MediumTitle>Wizzmas Cover</MediumTitle>
        {isMintEnabledLoading ||
          (isCanClaimLoading && <SmallTitle>Loading...</SmallTitle>)}
        <CoverViewer />
        {!address && <SmallTitle>Connect wallet to mint!</SmallTitle>}
        {canClaim && <ArtworkClaim artworkType={0} />}
        {!canClaim && <ArtworkMint artworkType={0} />}
      </>
    );
  } else {
    return <p>Mint is closed!</p>;
  }
};

export default ArtworkMinter;
