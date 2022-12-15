import { ethers } from 'ethers'
import { useState } from 'react'
import styled from 'styled-components'
import DisplayError from '../generic/DisplayError'
import { Button, MediumTitle, Segment, TextInput, VStack } from '../generic/StyledComponents'

type RecipientInputProps = {
  onRecipientValid: (recipient: string | undefined) => void
}
const RecipientInput = ({ onRecipientValid }: RecipientInputProps) => {
  const [address, setAddress] = useState('')
  const [validAddress, setValidAddress] = useState(false)
  const [addedAddress, setAddedAddress] = useState<string | undefined>(undefined)
  const [inputError, setInputError] = useState<Error | null>(null)

  function validate(e: any) {
    const addr = e.target.value
    setAddress(addr)
    setValidAddress(ethers.utils.isAddress(addr))
  }

  function addAddress() {
    setInputError(validAddress && address.length > 0 ? null : Error('Invalid address'))
    onRecipientValid(validAddress ? ethers.utils.getAddress(address) : undefined)
    setAddedAddress(validAddress ? address : undefined)
  }

  function clear() {
    setAddress('')
    setAddedAddress(undefined)
    onRecipientValid(undefined)
  }

  return (
    <>
      <MediumTitle>Enter recipient:</MediumTitle>
      <VStack>
        <>
          <Segment>
            {addedAddress != undefined && <AddedAddress>{addedAddress}</AddedAddress>}
            {addedAddress == undefined && (
              <TextInput
                required
                value={address}
                onChange={validate}
                minLength={42}
                maxLength={42}
                placeholder="Enter address..."
              />
            )}
            <Button onClick={addedAddress == undefined ? addAddress : clear} disabled={!validAddress}>
              {addedAddress != undefined && <>Remove Recipient</>}
              {addedAddress == undefined && <>Add Recipient</>}
            </Button>
          </Segment>
          <DisplayError error={inputError} />
        </>
      </VStack>
    </>
  )
}

const AddedAddress = styled.div`
  width: 100%;
  padding: 1em;
  color: yellow;
  border: dashed;
  border-color: yellow;
`

export default RecipientInput
