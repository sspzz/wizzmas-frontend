import styled from "styled-components";
import Picker from "../generic/Picker";
import { HStack, SmallTitle } from "../generic/StyledComponents";

type ArtworkTypePickerProps = {
  artworks: number[];
  onArtworkSelected: (artworkType: number) => void;
};
const ArtworkTypePicker = ({
  artworks,
  onArtworkSelected,
}: ArtworkTypePickerProps) => {
  const renderItem = (token: number) => {
    return (
      <Item>
        <Image src={`/api/artwork/img/${token}`} />
        <TextWrapper>
          <Text>Artwork #{token}</Text>
        </TextWrapper>
      </Item>
    );
  };

  return (
    <div>
      <SmallTitle>Select Artwork:</SmallTitle>
      <HStack>
        <Picker
          items={artworks}
          renderItem={renderItem}
          onSelected={onArtworkSelected}
        />
      </HStack>
    </div>
  );
};

const Item = styled.div`
  width: 145px;
  height: 240px;
`;

const TextWrapper = styled.div`
  padding: 0.2em;
`;

const Text = styled.p`
  text-align: center;
  font-size: 0.9em;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  display: block;
  line-height: 1em;
  max-height: 1em; /* number of lines to show  */
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

export default ArtworkTypePicker;