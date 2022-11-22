import { ethers } from "ethers";
import { abi as WizzmasArtworkMinterAbi } from "./WizzmasArtworkMinter.json";

export function getArtworkMinterContract({ provider }: { provider: any }) {
  if (!process.env.NEXT_PUBLIC_ARTWORKMINTER_CONTRACT_ADDRESS) {
    throw new Error("Specify contract address");
  }
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_ARTWORKMINTER_CONTRACT_ADDRESS,
    WizzmasArtworkMinterAbi,
    provider
  );
}
