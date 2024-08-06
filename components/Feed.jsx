'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import PromptCardList from '@components/PromptCardList';
import Search from '@components/Search';
import Profile from '@components/Profile';
import PromptCard from '@components/PromptCard';

const Feed = () => {
  const params = useSearchParams();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/prompt');
      if (!response.ok) {
        throw new Error('Failed to fetch prompts');
      }
      const data = await response.json();
      setPrompts(data);
      console.log('Prompts:', data);
    } catch (error) {
      setError(error.message);
      console.error('Failed to fetch prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const filteredPrompts = useMemo(() => {
    console.log('params:', params.get('search-text'));
    if (params.has('search-text')) {
      const text = params.get('search-text').toLowerCase();
      return prompts.filter(
        (prompt) =>
          prompt.tag.toLowerCase().includes(text) ||
          prompt.prompt.toLowerCase().includes(text) ||
          prompt.creator.username.toLowerCase().includes(text),
      );
    }
    console.log('filteredPrompts:', prompts);
    return prompts;
  }, [params, prompts]);

  if (loading) {
    return (
      <section className="feed flex flex-col items-center justify-center">
        <div
          className="w-16 h-16 border-4 border-orange-500 border-t-transparent border-solid rounded-full animate-spin"/>
        <p className="mt-4 text-lg font-semibold text-gray-800">Loading
          prompts...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={'feed'}>
        <p>Failed to load prompts</p>
      </section>
    );
  }

  return (
    <section className={'feed'}>
      <Search/>
      <PromptCardList prompts={filteredPrompts}/>
    </section>
  );
};

export default Feed;