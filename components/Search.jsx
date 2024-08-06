'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Search = () => {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search for:', searchText);

    if (searchText) {
      router.push(`/?search-text=${searchText}`);
    } else {
      router.push('/');
    }
  }

  return (
    <form className={'relative w-full flex-center gap-2.5'} onSubmit={handleSearchSubmit}>
      <input
        type={'text'}
        placeholder={'Search for ...'}
        value={searchText}
        onChange={handleSearchTextChange}
        className={'search_input peer'}
      />
      <button
        type={'submit'}
        className={'search_btn peer'}
      >
        Search
      </button>
    </form>
  );
};

export default Search;