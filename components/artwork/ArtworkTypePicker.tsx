import { useState } from "react";
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
      <>
        Artwork #{token}
        <img src={`/api/artwork/img/${token}`} />
      </>
    );
  };

  return (
    <Picker
      itemName="Artwork"
      items={artworks}
      renderItem={renderItem}
      onSelected={onArtworkSelected}
    />
  );
};

export default ArtworkTypePicker;