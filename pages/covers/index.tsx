import { useEffect, useState } from "react";
import Header from "../../components/Header";
import ArtworkMinter from "../../components/artwork/ArtworkMinter";

const Covers = () => {
    const [domLoaded, setDomLoaded] = useState(false);
    useEffect(() => {
        setDomLoaded(true);
    }, []);

    if (domLoaded) {
        return (
            <>
                <Header />
                <ArtworkMinter />
            </>
        );
    }
};

export default Covers;