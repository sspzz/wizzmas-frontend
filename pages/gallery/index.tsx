import { useEffect, useState } from "react";
import Header from "../../components/Header";

const Gallery = () => {
    const [domLoaded, setDomLoaded] = useState(false);
    useEffect(() => {
        setDomLoaded(true);
    }, []);

    if (domLoaded) {
        return (
            <>
                <Header />
                <p>Gallery Page</p>
            </>
        );
    }
};

export default Gallery;