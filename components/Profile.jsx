import PromptCard from '@components/PromptCard';

const Profile = (props) => {
  return (
    <section className={'w-full'}>
      <h1 className={'head_text text-left'}>
        <span className={'blue_gradient'}>{props.name} Profile</span>
      </h1>
      <p className={'desc text-left'}>{props.description}</p>

      <div className={'mt-10 prompt_layout'}>
        {props.prompts.map((prompt) => (
          <PromptCard
            key={prompt._id}
            prompt={prompt}
          />
        ))}
      </div>
    </section>
  )
}

export default Profile;