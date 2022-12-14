import styled from "styled-components";

const CoverViewer = () => {
  return (
    <div>
        <Item>
          <Image src={`/api/artwork/gif/0`} />
        </Item>
    </div>
  );
};

const Item = styled.div`
  width: 700px;
  height: 700px;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

export default CoverViewer;
