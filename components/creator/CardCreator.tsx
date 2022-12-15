import styled from 'styled-components'
import { useState } from 'react'
import { PrimaryButton, VStack, HStack, SmallTitle } from '../generic/StyledComponents'
import CardPreview from './CardPreview'
import TemplatePicker from './TemplatePicker'
import MessagePicker from './MessagePicker'
import TokenPicker, { SelectedToken } from './TokenPicker'
import RecipientInput from './RecipientInput'
import Mint from './Mint'

const CardCreator = () => {
  const [inputSelection, setInputSelection] = useState<number>(0)
  const [selectedCover, setSelectedCover] = useState<number>(0)
  const [selectedTemplate, setSelectedTemplate] = useState<number | undefined>(undefined)
  const [selectedToken, setSelectedToken] = useState<SelectedToken | undefined>(undefined)
  const [selectedMessage, setSelectedMessage] = useState<string | undefined>(undefined)
  const [recipient, setRecipient] = useState<string | undefined>(undefined)

  return (
    <>
      <Content>
        <Content>
          <VStack>
            {inputSelection == 0 && <TemplatePicker onTemplateSelected={setSelectedTemplate} />}
            {inputSelection == 1 && <TokenPicker onTokenSelected={setSelectedToken} />}
            {inputSelection == 2 && <MessagePicker onMessageValid={setSelectedMessage} />}
            {inputSelection == 3 && <SmallTitle>Ready to Mint!</SmallTitle>}
            <HStack>
              <PrimaryButton disabled={inputSelection == 0} onClick={() => setInputSelection(inputSelection - 1)}>
                Previous
              </PrimaryButton>
              <PrimaryButton disabled={inputSelection == 3} onClick={() => setInputSelection(inputSelection + 1)}>
                Next
              </PrimaryButton>
            </HStack>
          </VStack>
        </Content>
        <Content>
          <CardPreview templateType={selectedTemplate} token={selectedToken} message={selectedMessage} />
        </Content>
        <Content>
          <VStack>
            <RecipientInput onRecipientValid={setRecipient} />
            <Mint
              artworkType={selectedCover}
              templateType={selectedTemplate}
              message={selectedMessage}
              token={selectedToken}
              recipient={recipient}
            />
          </VStack>
        </Content>
      </Content>
    </>
  )
}

const Content = styled.div`
  border-style: dashed;
  border-color: #444;
  padding: 1em;
  margin: 1em;
`

export default CardCreator
