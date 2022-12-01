import styled from "styled-components";
import { useContractRead } from "wagmi";
import WizzmasCardArtifact from "../../contracts/artifacts/WizzmasCard.json";
import { range } from "../../lib/ArrayUtil";
import Picker from "../generic/Picker";
import { HStack, SmallTitle } from "../generic/StyledComponents";

type TemplatePickerProps = {
  onTemplateSelected: (template: number) => void;
};

const TemplatePicker = ({ onTemplateSelected }: TemplatePickerProps) => {
  const {
    data: numTemplates,
    isError,
    isLoading,
  } = useContractRead({
    addressOrName: process.env.NEXT_PUBLIC_CARD_CONTRACT_ADDRESS ?? "",
    contractInterface: WizzmasCardArtifact.abi,
    functionName: "numTemplates",
  });

  const renderItem = (template: number) => {
    return (
      <Item>
        <Wrapper>
          <Image src={`/api/template/img/${template}.png`} />
          <Text>Template #{template}</Text>
        </Wrapper>
      </Item>
    );
  };

  if (isLoading) {
    return <>Loading templates...</>;
  }

  if (isError) {
    return <>Could not load templates...</>;
  }

  return (
    <div>
      {numTemplates && (
        <>
          <SmallTitle>Select Template:</SmallTitle>
          <HStack>
            <Picker
              items={range(0, numTemplates.toNumber())}
              renderItem={renderItem}
              onSelected={onTemplateSelected}
            />
          </HStack>
        </>
      )}
    </div>
  );
};

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

export default TemplatePicker;
