'use client';

import Form from '@components/Form';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const CreatePrompt = () => {
  const [submit, setSubmit] = useState(false);
  const [post, setPost] = useState({
    prompt: '',
    tag: '',
  });

  const { data: session } = useSession();
  const router = useRouter();

  const createPrompt = async (e) => {
    e.preventDefault();
    setSubmit(true);

    try {
      const response = await fetch('/api/prompt/new', {
        method: 'POST',
        body: JSON.stringify({
          userId: session?.user.id,
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        await router.push('/');
      }
    } catch (error) {
      console.error('An unexpected error happened:', error);
    } finally {
      setSubmit(false);
      setPost({ prompt: '', tag: '' });
    }
  };

  return (
    <Form
      type={'Create'}
      post={post}
      setPost={setPost}
      submit={submit}
      handleSubmit={createPrompt}
    />
  );
};

export default CreatePrompt;