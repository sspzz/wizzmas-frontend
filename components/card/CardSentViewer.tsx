import styled from "styled-components";
import { useAccount, useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import WizzmasCardArtifact from "../../contracts/artifacts/WizzmasCard.json";
import { range } from "../../lib/ArrayUtil";
import FlipViewer from "../generic/FlipViewer";
import { MediumTitle, SmallTitle, VStack, HStack } from "../generic/StyledComponents";

const CardSentViewer = () => {
    const { address } = useAccount();
    const {
        data: senderIds,
        isError,
        isLoading,
    } = useContractRead({
        addressOrName: process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS ?? "",
        contractInterface: WizzmasCardArtifact.abi,
        functionName: "getSenderCardIds",
        args: [address],
    });

    const renderItem = (item: any) => {
        const dynamicUrl = `${
            process.env.VERCEL_URL ?? "http://localhost:3000"
        }/api/card/dynamic/${item}`;
        const [card, loadCard] = useState<any | undefined>(undefined);
        
        useEffect( () => {
            async function fetchCard() {
                try {
                    const response = await fetch(dynamicUrl);
                    const content = await response.text();
                    loadCard(content);

                } catch (err) {
                    console.log(err);
                }
            }
            fetchCard();
        }, []);

        return (
            <Item>
                <Wrapper>
                    <Card dangerouslySetInnerHTML={{ __html: card}} />
                </Wrapper>
            </Item>
        );
    };

    if (!address) {
        return <SmallTitle>Connect wallet to view sent cards!</SmallTitle>;
    }

    if (isLoading) {
        return <SmallTitle>Loading...</SmallTitle>;
    }

    if (isError) {
        return <SmallTitle>Could not read contract information!</SmallTitle>;
    }

    if (senderIds != undefined && senderIds.length > 0) {
        return (
            <Content>
                <VStack>
                    <MediumTitle>Sent Cards</MediumTitle>
                    <HStack>
                        <FlipViewer
                            items={range(0, senderIds.length)}
                            renderItem={renderItem}
                        />
                    </HStack>
                </VStack>
            </Content>
        );
    } else {
        return (
            <Content>
                <VStack>
                    <MediumTitle>Sent Cards</MediumTitle>
                    <p>No sent cards!</p>
                </VStack>
            </Content>
        )
    }

};

const Content = styled.div`
  border-style: dashed;
  border-color: #444;
  padding: 1em;
  margin: 1em;
`;

const Item = styled.div`
  width: 300px;
  height: 300px;
`;

const Wrapper = styled.div`
  padding: 0.2em;
`;

const Text = styled.p`
  text-align: center;
  font-size: 0.9em;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  display: block;
  line-height: 1em;
  max-height: 1em; /* number of lines to show  */
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const Card = styled.div`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;


export default CardSentViewer;