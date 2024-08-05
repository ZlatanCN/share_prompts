'use client'

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PromptCardList from '@components/PromptCardList';
import { useRouter } from 'next/navigation';

const Feed = () => {
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState([]);
  const timeoutRef = useRef(null);
  const router = useRouter();

  const handleSearchTextChange = (e) => {
    const newSearchText = e.target.value;
    setSearchText(newSearchText);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (newSearchText === '') {
        router.push('/');
        setFilteredPrompts(prompts);
      } else {
        router.push(`/?search-tag=${newSearchText}`);
      }
    }, 300);
  };

  const fetchPrompts = async (text) => {
    const response = await fetch('/api/prompt');
    let data = await response.json();

    setPrompts(data);
    if (text) {
      const regex = new RegExp(text, 'ui');
      data = data.filter(
        prompt => (
          regex.test(prompt.prompt) ||
          regex.test(prompt.tag) ||
          regex.test(prompt.creator.username)
        ),
      );
    }
    setFilteredPrompts(data);
  };

  useEffect(() => {
    const tag = searchParams.get('search-tag');
    console.log('searchParams:', tag);
    fetchPrompts(tag)
    setSearchText(tag);
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <section className={'feed'}>
      <form className={'relative w-full flex-center'}>
        <input
          type={'text'}
          placeholder={'Search for ...'}
          value={searchText}
          onChange={handleSearchTextChange}
          className={'search_input peer'}
        />
      </form>

      <PromptCardList prompts={filteredPrompts}/>
    </section>
  );
};

export default Feed;