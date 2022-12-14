import { useEffect, useState } from "react";
import ArtworkMinter from "../components/artwork/ArtworkMinter";
import CardMinter from "../components/card/CardMinter";
import CardSentViewer from "../components/card/CardSentViewer";
import CardReceivedViewer from "../components/card/CardReceivedViewer";
import ConnectButton from "../components/ConnectButton";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const [domLoaded, setDomLoaded] = useState(false);
  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <div>
      {domLoaded && (
        <>
          <Header />
          <ArtworkMinter />
          <CardSentViewer />
          <CardReceivedViewer />
          <CardMinter />
          <Footer />
        </>
      )}
    </div>
  );
}
