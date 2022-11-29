import { useEffect, useState } from "react";
import ArtworkMinter from "../components/artwork/ArtworkMinter";
import CardMinter from "../components/card/CardMinter";
import ConnectButton from "../components/ConnectButton";
import { LargeTitle } from "../components/generic/StyledComponents";

export default function Home() {
  const [domLoaded, setDomLoaded] = useState(false);
  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <div>
      <LargeTitle>Wizzmas 2022</LargeTitle>
      {domLoaded && (
        <>
          <ConnectButton />
          <ArtworkMinter />
          <CardMinter />
        </>
      )}
    </div>
  );
}
