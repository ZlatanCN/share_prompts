import Form from '@components/Form';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const EditPromptComponent = () => {
  const [submit, setSubmit] = useState(false);
  const [post, setPost] = useState({
    prompt: '',
    tag: '',
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get('id');

  useEffect(() => {
    const fetchPrompt = async () => {
      const response = await fetch(`/api/prompt/${promptId}`);
      const data = await response.json();

      setPost({
        prompt: data.prompt,
        tag: data.tag,
      });
    };

    if (promptId) {
      fetchPrompt();
    } else {
      return alert('Prompt not found');
    }
  }, [promptId]);

  const updatePrompt = async (e) => {
    e.preventDefault();
    setSubmit(true);

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        setSubmit(false);
        router.push('/profile');
      }
    } catch (error) {
      console.log('An unexpected error happened:', error);
    } finally {
      setSubmit(false);
    }
  }

  return (
    <Form
      type={'Edit'}
      post={post}
      setPost={setPost}
      submit={submit}
      handleSubmit={updatePrompt}
    />
  );
};

export default EditPromptComponent;