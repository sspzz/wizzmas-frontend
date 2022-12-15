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
  padding: 2em;
  transform-style: preserve-3d;
  perspective: 1000px;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 0.5em;
  box-shadow: 0 5px 10px rgba(24, 24, 24, 1), 0 10px 40px rgba(40, 40, 40, 0.8);
  // transition: transform 0.8s;
  // transform: rotateX(2.5deg);
  // -webkit-backface-visibility: hidden;
  // backface-visibility: hidden;
`;

export default CoverViewer;
