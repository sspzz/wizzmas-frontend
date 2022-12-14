import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

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
                <Footer />
            </>
        );
    }
};

export default Gallery;