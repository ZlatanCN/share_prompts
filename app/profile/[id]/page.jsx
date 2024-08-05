'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Profile from '@components/Profile';

const UserProfilePage = () => {
  const userId = useParams().id;
  const [prompts, setPrompts] = useState([]);
  const [user, setUser] = useState({
    username: 'User',
    description: 'User Description',
  });

  const fetchUser = async () => {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();

    setUser(data);
  }

  const fetchPrompts = async () => {
    const response = await fetch(`/api/users/${userId}/prompts`);
    const data = await response.json();

    setPrompts(data);
  }

  useEffect(() => {
    try {
      fetchUser();
      fetchPrompts();
    } catch (error) {
      console.log('Error fetching user and prompts:', error);
    }
  }, []);

  return (
    <Profile
      name={`${user.username}`}
      description={'My Description'}
      prompts={prompts}
    />
  );
};

export default UserProfilePage;