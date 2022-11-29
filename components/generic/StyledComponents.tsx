import styled from "styled-components";

export const VStack = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-content: stretch;
  flex-wrap: wrap;
  gap: 1em;
`;

export const HStack = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-content: stretch;
  flex-wrap: wrap;
  gap: 1em;
`;

export const Segment = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-content: stretch;
  flex-wrap: no-wrap;
  gap: 1em;
`;

export const PrimaryButton = styled.button`
  font-family: Alagard;
  cursor: pointer;
  font-size: x-large;
  padding: 0.5em;
  flex-grow: 1;
  color: black;
  background-color: yellow;
  :hover {
    background-color: orange;
  }
  :active {
    background-color: red;
  }
  :disabled {
    background-color: gray;
  }
`;

export const Button = styled.button`
  font-family: Alagard;
  cursor: pointer;
  font-size: large;
  padding: 0.5em;
  flex-grow: 1;
  color: black;
  background-color: yellow;
  :hover {
    background-color: orange;
  }
  :active {
    background-color: red;
  }
  :disabled {
    background-color: gray;
  }
`;

export const TextInput = styled.input`
  font-family: Alagard;
  width: 100%;
  padding: 1em;
  background: #00000000;
  border: dashed;
  border-color: #222;
`;
