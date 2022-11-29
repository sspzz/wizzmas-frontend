import styled from "styled-components";
import { useContractRead } from "wagmi";
import WizzmasCardArtifact from "../../contracts/WizzmasCard.json";
import Picker from "../generic/Picker";
import { SmallTitle, VStack } from "../generic/StyledComponents";

type MessagePickerProps = {
  onCardMessageIdSelected: (messageId: number) => void;
};

const MessagePicker = ({ onCardMessageIdSelected }: MessagePickerProps) => {
  const {
    data: messages,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasCardArtifact.abi,
    functionName: "availableMessages",
  });

  const renderItem = (index: number) => {
    return (
      <Item>
        <TextWrapper>
          <Text>{messages ? messages[index] : ""}</Text>
        </TextWrapper>
      </Item>
    );
  };

  if (isLoading) {
    return <>Loading messages...</>;
  }

  if (isError) {
    return <>Could not load messages...</>;
  }

  return (
    <>
      <SmallTitle>Select Message:</SmallTitle>
      <VStack>
        {messages && (
          <Picker
            items={messages.map((message, i) => i)}
            renderItem={renderItem}
            onSelected={onCardMessageIdSelected}
          />
        )}
      </VStack>
    </>
  );
};

const Item = styled.div`
`;

const TextWrapper = styled.div`
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
  max-height: 2em; /* number of lines to show  */
`;

export default MessagePicker;
