import styled from 'styled-components'
import { useState } from 'react'
import DisplayError from '../generic/DisplayError'
import { Button, MediumTitle, Segment, TextInput, VStack } from '../generic/StyledComponents'

type MessagePickerProps = {
  onMessageValid: (message: string | undefined) => void
}

const MessagePicker = ({ onMessageValid }: MessagePickerProps) => {
  const [message, setMessage] = useState('')
  const [validMessage, setValidMessage] = useState(false)
  const [addedMessage, setAddedMessage] = useState<string | undefined>(undefined)
  const [inputError, setInputError] = useState<Error | null>(null)

  function validate(e: any) {
    const message = e.target.value
    setMessage(message)
    setValidMessage(message.length < 64)
  }

  function addMessage() {
    setInputError(validMessage && message.length > 0 ? null : Error('Invalid address'))
    onMessageValid(validMessage ? message : undefined)
    setAddedMessage(validMessage ? message : undefined)
  }

  function clear() {
    setMessage('')
    setAddedMessage(undefined)
    onMessageValid(undefined)
  }

  return (
    <>
      <MediumTitle>Enter message:</MediumTitle>
      <VStack>
        <>
          <Segment>
            {addedMessage != undefined && <AddedMessage>{addedMessage}</AddedMessage>}
            {addedMessage == undefined && (
              <TextInput
                required
                value={message}
                onChange={validate}
                minLength={1}
                maxLength={63}
                placeholder="Have a very Merry Wizzmas!"
              />
            )}
            <Button onClick={addedMessage == undefined ? addMessage : clear} disabled={!validMessage}>
              {addedMessage != undefined && <>Remove Message</>}
              {addedMessage == undefined && <>Add Message</>}
            </Button>
          </Segment>
          <DisplayError error={inputError} />
        </>
      </VStack>
    </>
  )
}

const AddedMessage = styled.div`
  width: 100%;
  padding: 1em;
  color: yellow;
  border: dashed;
  border-color: yellow;
`

export default MessagePicker
