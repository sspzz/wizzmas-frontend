import { useState } from "react";
import styled from "styled-components";
import Picker from "../generic/Picker";

type ArtworkTypePickerProps = {
  artworks: number[];
  onArtworkSelected: (artworkType: number) => void;
};
const ArtworkTypePicker = ({
  artworks,
  onArtworkSelected,
}: ArtworkTypePickerProps) => {
  const [selected, setSelected] = useState<number | undefined>(undefined);
  const renderItem = (token: number) => {
    return (
      <div>
        <p>Artwork #{token}</p>
        <ArtworkImage src={`/api/artwork/img/${token}`} />
      </div>
    );
  };

  return (
    <>
    <h3>Select Artwork:</h3>
    <Picker
      items={artworks}
      renderItem={renderItem}
      onSelected={onArtworkSelected}
    />
    </>
  );
};

const ArtworkImage = styled.img`
  max-height: 150px;
`;

export default ArtworkTypePicker;
