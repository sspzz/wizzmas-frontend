import ArtworkMinter from "../components/ArtworkMinter";
import CardMinter from "../components/CardMinter";
import ConnectButton from "../components/ConnectButton";

export default function Home() {
  return (
    <div>
      <h1>Wizzmas 2022</h1>
      <ConnectButton />
      <ArtworkMinter />
      <CardMinter />
    </div>
  );
}
