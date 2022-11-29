import { ethers } from "ethers";
import { useState } from "react";
import styled from "styled-components";
import DisplayError from "../generic/DisplayError";
import { Button, Segment, TextInput, VStack } from "../generic/StyledComponents";

type RecipientAddressInputProps = {
  onRecipientValid: (recipient: string | undefined) => void;
};
const RecipientAddressInput = ({
  onRecipientValid,
}: RecipientAddressInputProps) => {
  const [address, setAddress] = useState("");
  const [validAddress, setValidAddress] = useState(false);
  const [inputError, setInputError] = useState<Error | null>(null);

  function validate(e: any) {
    const addr = e.target.value;
    setAddress(addr);
    setValidAddress(ethers.utils.isAddress(addr));
  }

  function addAddress() {
    setInputError(
      validAddress && address.length > 0 ? null : Error("Invalid address")
    );
    onRecipientValid(
      validAddress ? ethers.utils.getAddress(address) : undefined
    );
  }

  return (
    <>
      <h2>Enter recipient:</h2>
      <VStack>
        <Segment>
          <TextInput
            required
            value={address}
            onChange={validate}
            minLength={42}
            maxLength={42}
            placeholder="Enter address..."
          />
          <Button onClick={addAddress} disabled={!validAddress}>
            Add recipient
          </Button>
        </Segment>
        <DisplayError error={inputError} />
      </VStack>
    </>
  );
};


export default RecipientAddressInput;
