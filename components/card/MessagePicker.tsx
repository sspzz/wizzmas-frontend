import styled from "styled-components";
import { useContractRead } from "wagmi";
import WizzmasCardArtifact from "../../contracts/WizzmasCard.json";
import Picker from "../generic/Picker";

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
      <h3>Select Message:</h3>
      <Grid>
        {messages && (
          <Picker
            items={messages.map((message, i) => i)}
            renderItem={renderItem}
            onSelected={onCardMessageIdSelected}
          />
        )}
      </Grid>
    </>
  );
};

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-content: stretch;
  flex-wrap: wrap;
  gap: 1em;
`;

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
