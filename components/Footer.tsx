import styled from 'styled-components'
import Image from 'next/image'
import GitHub from '../../public/github-mark.png'

const Footer = () => {
  return (
    <Container>
      <h3>
        Artwork by <a href="https://twitter.com/SHADOWY30">Shadow</a> &<a href="https://twitter.com/Tadmajor"> Tad</a>
      </h3>
      <a href="https://github.com/">GitImage-Link</a>
      <p>Created by ColorMaster Studios.</p>
    </Container>
  )
}

const Container = styled.div`
  bottom: 0px;
  background: #111;
  min-height: 120px;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 100px;
  text-align: center;
  flex: none;
`

export default Footer
