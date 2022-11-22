import { useAccount, useContractRead } from "wagmi";
import WizzmasArtworkMinterArtifact from "../contracts/WizzmasArtworkMinter.json";

const CardMinter = () => {
  const { address } = useAccount();
  const { data, isError, isLoading } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasArtworkMinterArtifact.abi,
    functionName: "mintEnabled"
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
    return <p>Card mint enabled</p>;
  } else {
    return <p>Card mint disabled</p>;
  }
};

export default CardMinter;
