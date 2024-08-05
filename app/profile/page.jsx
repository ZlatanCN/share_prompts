'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Profile from '@components/Profile';

const MyProfile = (props) => {
  const {data: session} = useSession();
  const [prompts, setPrompts] = useState([]);

  const fetchPrompts = async () => {
    const response = await fetch(`/api/users/${session?.user.id}/prompts`);
    const data = await response.json();

    setPrompts(data);
  }

  useEffect(() => {
    if (session?.user.id) {
      fetchPrompts()
    }
  }, []);

  return (
    <Profile
      name={'My'}
      description={'My Description'}
      prompts={prompts}
    />
  );
}

export default MyProfile;