import styled from "styled-components";
import { useContractRead } from "wagmi";
import WizzmasCardArtifact from "../../contracts/artifacts/WizzmasCard.json";
import Picker from "../generic/Picker";


export type SelectedMessage = {
    messageId: number;
    message: string;
}

type MessagePickerProps = {
    onMessageSelected: (message: SelectedMessage) => void;
};

const MessagePicker = ({ onMessageSelected }: MessagePickerProps) => {
    const {
        data: messages,
        isError,
        isLoading,
      } = useContractRead({
        addressOrName: process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS ?? "",
        contractInterface: WizzmasCardArtifact.abi,
        functionName: "availableMessages",
    });

    if (isLoading) {
        return <>Loading messages...</>;
    }
    
    if (isError) {
        return <>Could not load messages...</>;
    }

    const renderItem = (message: SelectedMessage) => {
        return (
            <Item>
                <TextWrapper>
                    <Text>{message.message}</Text>
                </TextWrapper>
            </Item>
        );
    };

    
    return (
        <div>
            {messages && (
                <>
                    <h3>Select Message: </h3>
                    <MessageStack>
                        <Picker
                            items={messages.map((message, i) => ({messageId: i, message: message}))}
                            renderItem={renderItem}
                            onSelected={onMessageSelected}
                        />
                    </MessageStack>
                </>
            )}
        </div>
    );
};

const MessageStack = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
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