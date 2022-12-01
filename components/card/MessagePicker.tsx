import styled from "styled-components";
import { useContractRead } from "wagmi";
import WizzmasCardArtifact from "../../contracts/artifacts/WizzmasCard.json";
import Picker from "../generic/Picker";
import { SmallTitle, VStack } from "../generic/StyledComponents";

export type SelectedMessage = {
  messageId: number;
  message: string;
}

type MessagePickerProps = {
  onCardMessageIdSelected: (message: SelectedMessage) => void;
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

  const renderItem = (message: SelectedMessage) => {
    return (
      <Item>
        <TextWrapper>
          <Text>{message.message}</Text>
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
            items={messages.map((message, i) => ({messageId: i, message: message}))}
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
