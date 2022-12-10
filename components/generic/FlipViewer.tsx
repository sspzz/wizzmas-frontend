import { ReactNode, useState } from "react";
import styled from "styled-components";

type FlipViewerProps = {
    items: any[];
    renderItem: (item: any) => ReactNode;
    //onFlipped: (flipped: any) => void;
};
const FlipViewer = ({ items, renderItem}: FlipViewerProps) => {
    //const [flipped, setFlipped] = useState<any | undefined>(undefined);

    return (
        <>
            {items.map((item) => (
                <div
                    /*onClick={() => {
                        setFlipped(item);
                        onFlipped(item);
                    }}*/
                >
                    <Front>{renderItem(item)}</Front>
                </div>
            ))}
        </>
    );
};

const Front = styled.div`
  color: #aaa;
  cursor: pointer;
  border: dashed;
  border-color: #222;
`;

const Back = styled.div`
  color: yellow;
  cursor: pointer;
  border: dashed;
  border-color: yellow;
  :hover {
    border: dashed;
    border-color: yellow;
  }
`;

export default FlipViewer;