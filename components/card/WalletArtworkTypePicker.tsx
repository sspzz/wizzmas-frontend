import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { useContractRead, useContractReads } from "wagmi";
import { range } from "../../lib/ArrayUtil";
import WizzmasArtworkArtifact from "../../contracts/WizzmasArtwork.json";
import WizzmasArtworkMinterArtifact from "../../contracts/WizzmasArtworkMinter.json";
import ArtworkTypePicker from "../artwork/ArtworkTypePicker";

type TokenBalance = {
  token: number;
  balance: number;
};

type WalletArtworkTypePickerProps = {
  address: string;
  onArtworkSelected: (artworkType: number) => void;
};

const WalletArtworkTypePicker = ({
  address,
  onArtworkSelected,
}: WalletArtworkTypePickerProps) => {
  const {
    data: numArtworks,
    isError: isNumArtworksError,
    isLoading: isNumArtworksLoading,
  } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_ARTWORKMINTER_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasArtworkMinterArtifact.abi,
    functionName: "numArtworkTypes",
  });

  const {
    data: balances,
    isError: isBalancesError,
    isLoading: isBalancesLoading,
  } = useContractReads({
    contracts:
      numArtworks != undefined
        ? range(0, BigNumber.from(numArtworks).toNumber()).map((i) => {
            return {
              addressOrName:
                process.env.NEXT_PUBLIC_ARTWORK_CONTRACT_ADDRESS ?? "",
              contractInterface: WizzmasArtworkArtifact.abi,
              functionName: "balanceOf",
              args: [address, i],
              watch: true,
            };
          })
        : [],
    enabled: numArtworks != undefined,
  });

  const [tokenBalances, setTokenBalances] = useState<
    TokenBalance[] | undefined
  >(undefined);
  useEffect(() => {
    if (balances) {
      setTokenBalances(
        balances
          .map(
            (balance, i): TokenBalance => ({
              token: i,
              balance: balance.toNumber(),
            })
          )
          .filter((tb) => tb.balance > 0)
      );
    }
  }, [balances]);

  if (isNumArtworksLoading || isBalancesLoading) {
    return <>Checking wallet...</>;
  }

  if (isNumArtworksError || isBalancesError) {
    return <>Could not load wallet WizzmasArtworks!</>;
  }

  return (
    <>
      {tokenBalances && (
        <>
          <ArtworkTypePicker
            artworks={tokenBalances
              .filter((tb) => tb.balance > 0)
              .map((tb) => tb.token)}
            onArtworkSelected={onArtworkSelected}
          />
          {tokenBalances.length == 0 && <>You have no tokens.</>}
        </>
      )}
    </>
  );
};

export default WalletArtworkTypePicker;
