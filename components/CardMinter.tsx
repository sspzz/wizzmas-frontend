import styled from "styled-components";
import { useAccount, useContractRead } from "wagmi";
import WizzmasArtworkMinterArtifact from "../contracts/WizzmasArtworkMinter.json";

// TODO:
// 1. Get connected wallet Artwoks
// 2. Select Artwork (token id)
// 3. Get supported NFTs from Cards contract
// 4. Get wallet NFTs per supported NFT (and get image from meta with tokenURI())
// 5. Select NFT (contract address, token id)
// 6. Get available Messages from Cards contract
// 7. Select Message (string)
// 8. Enter recipient (validate address)
// 9. Mint!

const CardMinter = () => {
  const { address } = useAccount();
  const {
    data: mintEnabled,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS ?? "",
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

  if (mintEnabled) {
    return (
      <Content>
        <h2>WizzmasCard Mint:</h2>
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

export default CardMinter;
