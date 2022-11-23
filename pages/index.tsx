import { useEffect, useState } from "react";
import ArtworkMinter from "../components/ArtworkMinter";
import CardMinter from "../components/CardMinter";
import ConnectButton from "../components/ConnectButton";

export default function Home() {
  const [domLoaded, setDomLoaded] = useState(false);
  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <div>
      <h1>Wizzmas 2022</h1>
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
