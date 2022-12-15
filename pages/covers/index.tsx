import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ArtworkMinter from '../../components/artwork/ArtworkMinter'
import MintFAQ from '../../components/faq/MintFAQ'

const Covers = () => {
  const [domLoaded, setDomLoaded] = useState(false)
  useEffect(() => {
    setDomLoaded(true)
  }, [])

  if (domLoaded) {
    return (
      <>
        <Header />

        <Content>
          <FillSection>
            <ArtworkMinter />
          </FillSection>
          <Section>
            <MintFAQ />
          </Section>
        </Content>

        <Footer />
      </>
    )
  }
}

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 3em;
  margin-bottom: 2em;
`

export const FillSection = styled.div`
  background: #111;
  width: 100%;
  padding: 2em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 1em;
`

export const Section = styled.div`
  background: #111;
  padding: 2em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 1em;
  max-width: 800px;
`

export const Wrapper = styled.div`
  max-width: 500px;
`

export default Covers
