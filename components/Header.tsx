import styled from "styled-components";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import ConnectButton from "./ConnectButton";
import { NextPage } from "next";
import { useRouter} from "next/router";

interface NavLink {
    name: string;
    path: string;
}

const navLinks: NavLink[] = [
    { name: "Covers", path: "/" },
    {
        name: "Send Cards",
        path: "/send",
    },
    {
        name: "My Cards",
        path: "/view",
    },
    {
        name: "Gallery",
        path: "/gallery",
    }
];

const NavItem = ({ item }: { item: NavLink }) => {
    const router = useRouter();

    return (
        <p>
            <a href={item.path}>
                {router.pathname === item.path ? `[ ${item.name} ]` : item.name}
            </a>
        </p>
    );
};

const Header = () => {
    const { chain } = useNetwork();
    const { address } = useAccount();
    const [domLoaded, setDomLoaded] = useState(false);

    useEffect(() => {
        setDomLoaded(true);
    }, []);

    /*const wrongNetwork =
        (address &&
            chain?.id != 5 &&
            process.env.NEXT_PUBLIC_ALCHEMY_NETWORK == "goerli") ||
        (chain?.id != 1 && 
            process.env.NEXT_PUBLIC_ALCHEMY_NETWORK == "mainnet") ||
        (chain?.id != 31337 &&
            process.env.NEXT_PUBLIC_ALCHEMY_NETWORK == "mainnet");*/
    
    const wrongNetwork = false;
        
    if (domLoaded) {
        return (
            <Nav>
                <Title>
                    <a href="/">
                        <h1>Wizz Cards</h1>
                    </a>
                    <Connect>
                        <ConnectButton />
                        {wrongNetwork && (
                            <WrongNetwork>Wallet connected to wrong Network!</WrongNetwork>
                        )}
                    </Connect>
                </Title>
                <Menu>
                    <HSplit>
                        <Buttons>
                            {navLinks.map((l, key) => (
                                <NavItem item={l} key={key} />
                            ))}
                        </Buttons>
                    </HSplit>
                </Menu>
            </Nav>
        );
    }
};

const Nav = styled.nav`
    top: 0px;
    min-height: 100px;
    min-width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 3em;
    flex: none;
`;

const Title = styled.div`
    padding-left: 2em;
    padding-right: 2em;
    display: flex;
    background: #111;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
`

const Connect = styled.div`
  display: flex;
  align-items: end;
  flex-direction: column;
  justify-content: center;
  gap: 0.5em;
`;

const Menu = styled.div`
  background: #111d;
  padding-left: 2em;
  padding-right: 2em;
`;

const HSplit = styled.div`
  display: flex;
  align-items: leading;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5em;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: start;
  flex-wrap: wrap;
  gap: 3em;
  row-gap: 0px;
  font-size: x-large;
  padding: 0.5em;
`;

const WrongNetwork = styled.div`
  color: darkred;
  font-size: small;
`;

export default Header;