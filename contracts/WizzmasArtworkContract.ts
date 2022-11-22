import { ethers } from "ethers";
import WizzmasArtworkArtifact from "./WizzmasArtwork.json";

export function getArtworksContract({ provider }: { provider: any }) {
  if (!process.env.NEXT_PUBLIC_ARTWORK_CONTRACT_ADDRESS) {
    throw new Error("Specify contract address");
  }
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_ARTWORK_CONTRACT_ADDRESS,
    WizzmasArtworkArtifact.abi,
    provider
  );
}
