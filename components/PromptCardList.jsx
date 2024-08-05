import PromptCard from '@components/PromptCard';

const PromptCardList = (props) => {
  return (
    <div className={'mt-16 prompt_layout'}>
      {props.prompts.map((prompt) => (
        <PromptCard
          key={prompt._id}
          prompt={prompt}
        />
      ))}
    </div>
  )
}

export default PromptCardList;