import FAQ, { Question } from './FAQ'

const questions: Question[] = [
  {
    question: 'How many Wizzmas Covers are there?',
    answer: 'The total supply is infinite, until mint period ends.',
  },
  {
    question: 'How much is the mint?',
    answer: 'Every FRWC holder will get a free claim, each after will cost 0.01 ETH to mint.',
  },
  {
    question: 'What can I do with this Wizzmas Cover?',
    answer: 'Minting/Holding a wizzmas cover allows one to send wizzmas holiday cards to others.',
  },
  {
    question: 'How many holidy cards can you send?',
    answer: 'Unlimited sends for wizzmas cards.',
  },
  {
    question: 'Who is this Cult of which you speak? ',
    answer: "The Forgotten Runes Wizards' Cult.",
  },
]

const MintFAQ = () => {
  return <FAQ title="Frequently Asked Questions" questions={questions} />
}

export default MintFAQ
