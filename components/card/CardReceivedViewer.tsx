import styled from "styled-components";
import { useAccount, useContractRead } from "wagmi";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import WizzmasCardArtifact from "../../contracts/artifacts/WizzmasCard.json";
import { range } from "../../lib/ArrayUtil";
import FlipViewer from "../generic/FlipViewer";
import { MediumTitle, SmallTitle, VStack, HStack } from "../generic/StyledComponents";

const CardReceivedViewer = () => {
    const { address } = useAccount();
    const {
        data: recipientIds,
        isError,
        isLoading,
    } = useContractRead({
        addressOrName: process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS ?? "",
        contractInterface: WizzmasCardArtifact.abi,
        functionName: "getRecipientCardIds",
        args: [address],
    });

    const [receivedCards, setReceivedCards] = useState<any | undefined>(undefined);
    useEffect(() => {
        if (recipientIds) {

        }
    });

    const renderItem = (item: any) => {
        return (
            <Item>
                <Wrapper>
                    <Image src={`/api/card/img/${item}.png`} />
                    <Text>Card #{item}</Text>
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

    if (recipientIds != undefined && recipientIds.length > 0) {
        return (
            <Content>
                <VStack>
                    <MediumTitle>Received Cards</MediumTitle>
                    <HStack>
                        <FlipViewer
                            items={range(0, recipientIds.length)}
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
                    <MediumTitle>Received Cards</MediumTitle>
                    <p>No received cards!</p>
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
  width: 250px;
  height: 240px;
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

export default CardReceivedViewer;