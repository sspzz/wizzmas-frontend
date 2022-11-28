import { NextPage } from "next";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useContractRead, useContractReads, useProvider } from "wagmi";
import DisplayError from "../generic/DisplayError";
import { range } from "../../lib/ArrayUtil";
import WizzmasCardArtifact from "../../contracts/WizzmasCard.json";
import { fetchArtwork, fetchERC721Artwork } from "../../lib/TokenArtwork";

interface ERC721ImageProps {
  tokenContract: string;
  tokenId: number;
}

const ERC721Image: NextPage<ERC721ImageProps> = ({
  tokenContract,
  tokenId,
}: ERC721ImageProps) => {
  const provider = useProvider();
  const [imageURL, setImageURL] = useState<string | undefined>(undefined);
  const [isLoadingImageURL, setIsLoadingImageURL] = useState(false);
  const [isLoadingImageURLError, setIsLoadingImageURLError] =
    useState<Error | null>(null);

  useEffect(() => {
    setIsLoadingImageURL(true);
    fetchERC721Artwork(tokenContract, tokenId, provider)
      .then((url: string) => setImageURL(url))
      .then(() => setIsLoadingImageURL(false))
      .catch((e) => {
        setIsLoadingImageURL(false);
        setIsLoadingImageURLError(e);
      });
  }, []);

  if (isLoadingImageURL) {
    return <>Loading..</>;
  }

  if (isLoadingImageURLError) {
    return <DisplayError error={isLoadingImageURLError} />;
  }

  if (imageURL) {
    return <TokenImage src={imageURL} />;
  } else {
    return <>Missing image</>;
  }
};

export interface SelectedERC721 {
  tokenContract: string;
  tokenId: number;
}

type WalletERC721PickerProps = {
  address: string;
  contractAddress: string;
  onERC721Selected: (selected: SelectedERC721) => void;
};

const WalletERC721TypePicker = ({
  address,
  contractAddress,
  onERC721Selected,
}: WalletERC721PickerProps) => {
  const [selected, setSelected] = useState<SelectedERC721 | undefined>(
    undefined
  );

  const abi = JSON.parse(`
    [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ]
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "index",
            "type": "uint256"
          }
        ],
        "name": "tokenOfOwnerByIndex",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]`);

  const {
    data: balance,
    isError: isBalanceError,
    isLoading: isBalanceLoading,
  } = useContractRead({
    addressOrName: contractAddress,
    contractInterface: abi,
    functionName: "balanceOf",
    args: [address],
    enabled: address != undefined,
  });

  const {
    data: tokens,
    isError: isTokensError,
    isLoading: isTokensLoading,
  } = useContractReads({
    contracts:
      balance != undefined
        ? range(0, balance.toNumber()).map((i) => {
            return {
              addressOrName: contractAddress,
              contractInterface: abi,
              functionName: "tokenOfOwnerByIndex",
              args: [address, i],
            };
          })
        : [],
    enabled: balance != undefined,
  });

  const [allTokens, setAllTokens] = useState<SelectedERC721[]>([]);
  useEffect(() => {
    setAllTokens(
      tokens?.map((r, i) => {
        return {
          tokenContract: contractAddress,
          tokenId: r.toNumber(),
        };
      }) ?? []
    );
  }, [tokens]);

  if (isBalanceLoading || isTokensLoading) {
    return <></>;
  }

  if (isTokensError || isBalanceError) {
    return <>Could not load NFTs types for {contractAddress}!</>;
  }

  return (
    <>
      <h3>{contractAddress}:</h3>
      {allTokens.length == 0 && <>You have no tokens.</>}
      <TokenGrid>
        {allTokens.map((token, i) => (
          <Clickable
            onClick={() => {
              onERC721Selected(token);
            }}
          >
            <ERC721Image
              tokenContract={token.tokenContract}
              tokenId={token.tokenId}
            />
          </Clickable>
        ))}
      </TokenGrid>
    </>
  );
};

type SupportedERC721sPickerProps = {
  address: string;
  onERC721Selected: (selected: SelectedERC721) => void;
};
const SupportedERC721sPicker = ({
  address,
  onERC721Selected,
}: SupportedERC721sPickerProps) => {
  const {
    data: contracts,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasCardArtifact.abi,
    functionName: "supportedContracts",
  });

  if (isLoading) {
    return <>Loading supported NFTs...</>;
  }

  if (isError) {
    return <>Could not load supported NFTs...</>;
  }

  return (
    <>
      <h2>Select NFT:</h2>
      {contracts &&
        contracts.map((c, i) => (
          <WalletERC721TypePicker
            key={i}
            address={address}
            contractAddress={c}
            onERC721Selected={onERC721Selected}
          />
        ))}
    </>
  );
};

const TokenGrid = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: stretch;
  flex-wrap: wrap;
  gap: 1em;
`;

const TokenImage = styled.img`
  width: 100px;
  height: 100px;
  border-style: dashed;
  border-color: #444;
`;

const Clickable = styled.div`
  color: yellow;
  cursor: pointer;
  border: dashed;
  border-color: #111;
  :hover {
    border: dashed;
    border-color: yellow;
  }
`;

export default SupportedERC721sPicker;
