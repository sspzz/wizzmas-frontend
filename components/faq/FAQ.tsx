import styled from 'styled-components'

const Faq = styled.ul`
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1em;
`

const FaqItem = styled.li`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.2em;
`

const Question = styled.div`
  color: gray;
  font-family: 'Alagard';
`

const Answer = styled.div`
  color: white;
  font-family: 'Alagard';
`

export type FrequentlyAsked = {
  faq: Question[]
}

export type Question = {
  question: string
  answer: string
}

const FAQ = ({ title, questions }: { title: string; questions: Question[] }) => {
  return (
    <Faq>
      <h2>{title}</h2>
      {questions.map((q: Question) => {
        return (
          <FaqItem key={q.question}>
            <Question>Q: {q.question}</Question>
            <Answer>A: {q.answer}</Answer>
          </FaqItem>
        )
      })}
    </Faq>
  )
}

export default FAQ
