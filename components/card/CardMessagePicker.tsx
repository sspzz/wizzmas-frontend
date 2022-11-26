import styled from "styled-components";
import { useContractRead } from "wagmi";
import WizzmasCardArtifact from "../../contracts/WizzmasCard.json";
import Picker from "../generic/Picker";

type CardMessagePickerProps = {
  onCardMessageIdSelected: (messageId: number) => void;
};

const CardMessagePicker = ({
  onCardMessageIdSelected,
}: CardMessagePickerProps) => {
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
    return <>{messages ? messages[index] : ""}</>;
  };

  return (
    <>
      {messages && (
        <Picker
          itemName="Message"
          items={messages.map((message, i) => i)}
          renderItem={renderItem}
          onSelected={onCardMessageIdSelected}
        />
      )}
    </>
  );
};

export default CardMessagePicker;
