import styled from 'styled-components'

const ErrorView = styled.div`
  color: darkred;
  font-size: small;
`

export type Props = {
  error: Error | null
}

const DisplayError = ({ error }: Props) => {
  function errorMessage() {
    // @ts-ignore
    switch (error.code) {
      case 'ACTION_REJECTED':
        return 'You rejected the transaction!'
      case 'INSUFFICIENT_FUNDS':
        return 'You do not have enough ETH!'
      case 'UNPREDICTABLE_GAS_LIMIT':
        // @ts-ignore
        return error.reason ?? error.code ?? ''
      // TODO: Add errors
      default:
        // @ts-ignore
        return error.code ?? error?.reason
    }
  }
  return <>{error && <ErrorView>{errorMessage()}</ErrorView>}</>
}

export default DisplayError
