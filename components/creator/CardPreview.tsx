import { NextPage } from 'next'
import styled from 'styled-components'
import { SelectedToken } from './TokenPicker'

export type CardPreviewProps = {
  templateType: number | undefined
  token: SelectedToken | undefined
  message: string | undefined
}

const CardPreview: NextPage<CardPreviewProps> = ({ templateType, token, message }: CardPreviewProps) => {
  function buildURL() {
    var url = '/api/card/img/generate?'
    url += templateType != undefined ? `&template=${templateType}` : ''
    url += message != undefined ? `&message=${message}` : ''
    url += token ? `&contract=${token.tokenContract}` : ''
    url += token ? `&token=${token.tokenId}` : ''
    return url
  }

  return <CardImage src={buildURL()} />
}

const CardImage = styled.img`
  width: 760px;
  height: 600px;
  background: #333;
`

export default CardPreview
