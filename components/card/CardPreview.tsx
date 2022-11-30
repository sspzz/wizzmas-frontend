import styled from "styled-components";
import { CardMintProps } from "./CardMint";

const CardPreview = ({
  artworkType,
  message,
  nft,
  recipient,
}: CardMintProps) => {
  function buildURL() {
    var url = "/api/card/img/generate?";
    url += artworkType ? `&artwork=${artworkType}` : "";
    url += message ? `&message=${message.message}` : "";
    url += nft ? `&contract=${nft.tokenContract}` : "";
    url += nft ? `&token=${nft.tokenId}` : "";
    url += recipient ? `&recipient=${recipient}` : "";
    return url;
  }

  return <CardImage src={buildURL()} />;
};

const CardImage = styled.img`
  width: 1080px;
  height: 400px;
`;

export default CardPreview;
