import styled from "styled-components";
import { CardMintProps } from "./CardMint";

const CardPreview = ({
  artworkType,
  templateType,
  message,
  nft,
  recipient,
}: CardMintProps) => {
  function buildURL() {
    var url = "/api/card/img/generate?";
    url += artworkType != undefined ? `&artwork=${artworkType}` : "";
    url += templateType != undefined ? `&template=${templateType}` : "";
    url += message ? `&message=${message.message}` : "";
    url += nft ? `&contract=${nft.tokenContract}` : "";
    url += nft ? `&token=${nft.tokenId}` : "";
    url += recipient ? `&recipient=${recipient}` : "";
    return url;
  }

  return <CardImage src={buildURL()} />;
};

const CardImage = styled.img`
  width: 760px;
  height: 600px;
  background: #333;
`;

export default CardPreview;
