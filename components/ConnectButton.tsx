import { ConnectKitButton } from 'connectkit'
import styled from 'styled-components'

const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 16px;
  color: #000;
  background: pur;
  font-size: large;
`

const ConnectButton = () => {
  return (
    <ConnectKitButton />
    // <ConnectKitButton.Custom>
    //   {({ isConnected, show, truncatedAddress, ensName }) => {
    //     return (
    //       <StyledButton onClick={show}>
    //         {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
    //       </StyledButton>
    //     );
    //   }}
    // </ConnectKitButton.Custom>
  )
}

export default ConnectButton
