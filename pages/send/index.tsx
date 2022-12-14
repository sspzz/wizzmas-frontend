import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CardMinter from "../../components/card/CardMinter";



const Send = () => {
    const [domLoaded, setDomLoaded] = useState(false);
    useEffect(() => {
        setDomLoaded(true);
    }, []);

    if (domLoaded) {
        return (
            <>
                <Header />
                <CardMinter />
                <Footer />
            </>
        );
    }
};

export default Send;