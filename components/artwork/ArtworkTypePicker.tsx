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
  const renderItem = (token: number) => {
    return (
      <Item>
        <p>Artwork #{token}</p>
        <ArtworkImage src={`/api/artwork/img/${token}`} />
      </Item>
    );
  };

  return (
    <>
      <h3>Select Artwork:</h3>
      <Grid>
        <Picker
          items={artworks}
          renderItem={renderItem}
          onSelected={onArtworkSelected}
        />
      </Grid>
    </>
  );
};

const Grid = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: stretch;
  flex-wrap: wrap;
  gap: 1em;
`;

const Item = styled.div`
`;

const ArtworkImage = styled.img`
  max-width: 250px;
  max-height: 250px;
  object-fit: contain;
`;

export default ArtworkTypePicker;
