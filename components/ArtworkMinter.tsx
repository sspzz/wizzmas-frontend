import { useAccount, useContractRead } from "wagmi";
import WizzmasArtworkMinterArtifact from "../contracts/WizzmasArtworkMinter.json";

const ArtworkMinter = () => {
  const { address } = useAccount();
  const { data, isError, isLoading } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_ARTWORKMINTER_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasArtworkMinterArtifact.abi,
    functionName: "mintEnabled",
  });

  if (!address) {
    return <h3>Connect wallet to mint!</h3>;
  }

  if (isLoading) {
    return <h2>Loading...</h2>;
  } 
  
  if (isError) {
    return <h3>Could not read contract information!</h3>;
  }

  if (data) {
    return <p>Artwork mint enabled</p>;
  } else {
    return <p>Artwork mint disabled</p>;
  }
};

export default ArtworkMinter;
