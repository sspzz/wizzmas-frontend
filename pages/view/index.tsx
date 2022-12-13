import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CardSentViewer from "../../components/card/CardSentViewer";
import CardReceivedViewer from "../../components/card/CardReceivedViewer";

const View = () => {
    const [domLoaded, setDomLoaded] = useState(false);
    useEffect(() => {
        setDomLoaded(true);
    }, []);

    if (domLoaded) {
        return (
            <>
                <Header />
                <CardSentViewer />
                <CardReceivedViewer />
                <Footer />
            </>
        );
    }
};

export default View;