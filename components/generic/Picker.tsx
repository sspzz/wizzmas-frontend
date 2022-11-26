import { ReactNode, useState } from "react";
import styled from "styled-components";

type PickerProps = {
  itemName: string;
  items: any[];
  renderItem: (item: any) => ReactNode;
  onSelected: (selected: any) => void;
};
const Picker = ({ itemName, items, renderItem, onSelected }: PickerProps) => {
  const [selected, setSelected] = useState<any | undefined>(undefined);

  return (
    <>
      <h2>Select {itemName}:</h2>
      {items.length == 0 && <>No {itemName}s</>}
      {items.map((item) => (
        <div
          onClick={() => {
            setSelected(item);
            onSelected(item);
          }}
        >
          {item === selected && <Selected>{renderItem(item)}</Selected>}
          {item !== selected && <Unselected>{renderItem(item)}</Unselected>}
        </div>
      ))}
    </>
  );
};

const Unselected = styled.div`
  color: yellow;
  cursor: pointer;
  border: dashed;
  border-color: #111;
  :hover {
    border: dashed;
    border-color: yellow;
  }
`;

const Selected = styled.div`
  color: yellow;
  cursor: pointer;
  border: dashed;
  border-color: #ccc;
  :hover {
    border: dashed;
    border-color: yellow;
  }
`;

export default Picker;
