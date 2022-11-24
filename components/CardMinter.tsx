import { NextPage } from "next";
import styled from "styled-components";
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import DisplayError from "./DisplayError";
import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import WizzmasCardArtifact from "../contracts/WizzmasCard.json";
import WizzmasArtworkArtifact from "../contracts/WizzmasArtwork.json";
import WizzmasArtworkMinterArtifact from "../contracts/WizzmasArtworkMinter.json";
import { range } from "./lib/ArrayUtil";

// TODO:
// 1. - Get connected wallet Artworks
//         - numTokenTypes from Artworks contract
//         - balanceOf(0...numTokenTypes-1)->tokenOfOwnerByIndex()
//         - image from local store
//    - Select Artwork (token id)
//
// 2. - Get wallet NFTs per supported NFT
//         - supportedContracts from Card contract
//         - supportedContracs.map((c) => c.balanceOf()->c.tokenOfOwnerByIndex())
//         - images from meta with tokenURI()
//    - Select NFT (contract address, token id)
//
// 3. - Get available Messages from Cards contract
//    - Select Message (string)
//
// 4. - Enter recipient (validate address)
//
// 5. Mint!

// ===========================================================================

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
              watch: true
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
        <Content>
          <h2>Select Artwork:</h2>
          {tokenBalances.length == 0 && <>You have no artworks</>}
          {tokenBalances.map((tb) => (
            <div
              key={tb.token}
              onClick={() => {
                if (tb.balance > 0) onArtworkSelected(tb.token);
              }}
            >
              Artwork #{tb.token}
              <img src={`/api/artwork/img/${tb.token}`} />
            </div>
          ))}
        </Content>
      )}
    </>
  );
};

// ===========================================================================

interface ERC721ImageProps {
  tokenContract: string;
  tokenId: number;
}

const ERC721Image: NextPage<ERC721ImageProps> = ({
  tokenContract,
  tokenId,
}: ERC721ImageProps) => {
  const abi = JSON.parse(`
  [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]`);

  const {
    data: tokenURI,
    isError: isTokenURIError,
    isLoading: istokenURILoading,
    error: tokenURIError,
  } = useContractRead({
    addressOrName: tokenContract,
    contractInterface: abi,
    functionName: "tokenURI",
    args: [tokenId],
  });

  const [imageURL, setImageURL] = useState<string | undefined>(undefined);
  const [isLoadingImageURL, setIsLoadingImageURL] = useState(false);
  const [isLoadingImageURLError, setIsLoadingImageURLError] =
    useState<Error | null>(null);

  function ipfs(url: string): string {
    return url.startsWith("ipfs://")
      ? `https://cloudflare-ipfs.com/ipfs/${url.replace("ipfs://", "")}`
      : url;
  }

  useEffect(() => {
    if (tokenURI) {
      const uri = tokenURI!.toString();
      setIsLoadingImageURL(true);
      fetch(ipfs(uri))
        .then((res) => res?.json())
        .then((data: any) => setImageURL(ipfs(data.image)))
        .then(() => setIsLoadingImageURL(false))
        .catch((e) => {
          setIsLoadingImageURL(false);
          setIsLoadingImageURLError(e);
        });
    }
  }, [tokenURI]);

  if (istokenURILoading || isLoadingImageURL) {
    return <>Loading..</>;
  }

  if (isTokenURIError || isLoadingImageURLError) {
    return <DisplayError error={tokenURIError || isLoadingImageURLError} />;
  }

  if (imageURL) {
    return <TokenImage src={imageURL} />;
  } else {
    return <>Missing image</>;
  }
};

interface SelectedERC721 {
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
    return <Content>Could not load NFTs types for {contractAddress}!</Content>;
  }

  return (
    <Content>
      <h3>{contractAddress}:</h3>
      {allTokens.length == 0 && <>You have no tokens.</>}
      <TokenGrid>
        {allTokens.map((token, i) => (
          <div
            onClick={() => {
              onERC721Selected(token);
            }}
          >
            <ERC721Image
              tokenContract={token.tokenContract}
              tokenId={token.tokenId}
            />
          </div>
        ))}
      </TokenGrid>
    </Content>
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
    return <Content>Loading supported NFTs...</Content>;
  }

  if (isError) {
    return <>Could not load supported NFTs...</>;
  }

  return (
    <Content>
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
    </Content>
  );
};

// ===========================================================================

type CardMessagePickerProps = {
  onCardMessageIdSelected: (messageId: number) => void;
};
const CardMessagePicker = ({
  onCardMessageIdSelected,
}: CardMessagePickerProps) => {
  const {
    data: messages,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasCardArtifact.abi,
    functionName: "availableMessages",
  });

  return (
    <Content>
      <h2>Select Message:</h2>
      {messages &&
        messages.map((message, i) => (
          <div
            onClick={() => {
              onCardMessageIdSelected(i);
            }}
          >
            {message}
          </div>
        ))}
    </Content>
  );
};

// ===========================================================================

export type CardMintProps = {
  nftContract: string | undefined;
  nftTokenId: number | undefined;
  artworkType: number | undefined;
  messageId: number | undefined;
  recipient: string | undefined;
};

const CardMint: NextPage<CardMintProps> = ({
  nftContract,
  nftTokenId,
  artworkType,
  messageId,
  recipient,
}: CardMintProps) => {
  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName: process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasCardArtifact.abi,
    functionName: "mint",
    args: [nftContract, nftTokenId, artworkType, messageId, recipient],
  });
  const { data, error, write } = useContractWrite(config);
  const {
    data: txData,
    isLoading,
    isSuccess,
  } = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
  });

  return (
    <Content>
      {nftContract && <div>Selected NFT contract: {nftContract}</div>}
      {nftTokenId && <div>Selected NFT token: {nftTokenId}</div>}
      {artworkType && <div>Selected artwork id: {artworkType}</div>}
      {messageId && <div>Selected message id: {messageId}</div>}
      {recipient && <div>Selected recipient: {recipient}</div>}

      <button disabled={!write || isLoading} onClick={() => write!()}>
        {isLoading ? "Minting..." : "Mint now"}
      </button>
      {(prepareError || error) && (
        <DisplayError error={prepareError || error} />
      )}
      {isSuccess && <h3>Congrats, you sent a WizzmasCard to {recipient}!</h3>}
    </Content>
  );
};

// ===========================================================================

const CardMinter = () => {
  const { address } = useAccount();
  const {
    data: mintEnabled,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasCardArtifact.abi,
    functionName: "mintEnabled",
  });

  const [selectedArtwork, setSelecteArtwork] = useState<number | undefined>(
    undefined
  );
  const [selectedNFT, setSelectedNFT] = useState<SelectedERC721 | undefined>(
    undefined
  );
  const [selectedMessage, setSelectedMessage] = useState<number | undefined>(
    undefined
  );
  const [recipient, setRecipient] = useState<string | undefined>(undefined);

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

        <WalletArtworkTypePicker
          address={address}
          onArtworkSelected={(artwork) => {
            setSelecteArtwork(artwork);
          }}
        />

        <SupportedERC721sPicker
          address={address}
          onERC721Selected={(erc721) => {
            setSelectedNFT(erc721);
          }}
        />

        <CardMessagePicker
          onCardMessageIdSelected={(m) => {
            setSelectedMessage(m);
          }}
        />

        <CardMint
          artworkType={selectedArtwork}
          messageId={selectedMessage}
          nftContract={selectedNFT?.tokenContract}
          nftTokenId={selectedNFT?.tokenId}
          recipient={recipient}
        />
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

export default CardMinter;
