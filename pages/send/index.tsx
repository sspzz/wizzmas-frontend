import { useEffect, useState } from "react";
import Header from "../../components/Header";
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
            </>
        );
    }
};

export default Send;