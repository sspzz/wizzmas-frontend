import { ethers } from "ethers";
import { abi as WizzmasCardAbi } from "./WizzmasCard.json";

export function getCardsContract({ provider }: { provider: any }) {
  if (!process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS) {
    throw new Error("Specify contract address");
  }
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS,
    WizzmasCardAbi,
    provider
  );
}
