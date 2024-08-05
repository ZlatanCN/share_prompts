'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const PromptCard = (props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [copied, setCopied] = useState('');
  const [liked, setLiked] = useState(props.prompt.likes.likedBy.includes(session?.user.id));
  const [likes, setLikes] = useState(props.prompt.likes.count);
  const pathname = usePathname();

  const handleCopy = () => {
    setCopied(props.prompt.prompt);
    navigator.clipboard.writeText(props.prompt.prompt);
    setTimeout(() => setCopied(''), 3000);
  };

  const handleEdit = () => {
    router.push(`/update-prompt?id=${props.prompt._id}`);
  };

  const handleDelete = async () => {
    const hasConfirmed = confirm(
      'Are you sure you want to delete this prompt?');

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${props.prompt._id}`, {
          method: 'DELETE',
        });
        window.location.reload();
      } catch (error) {
        console.log('Error deleting prompt:', error);
      }
    }
  };

  const handleTagClick = () => {
    const tag = props.prompt.tag.replace('#', '');
    router.push(`/?search-tag=${tag}`);
  }

  const handleProfileClick = () => {
    router.push(`/profile/${props.prompt.creator._id}`);
  }

  const handleLike = async () => {
    if (!session) {
      router.push('/api/auth/signin');
      return;
    }

    try {
      const response = await fetch(`/api/prompt/${props.prompt._id}/like`, {
        method: 'PATCH',
        body: JSON.stringify({
          userId: session?.user.id,
          liked: liked,
        }),
      });
      const data = await response.json();
      setLiked((prevState) => !prevState);
      setLikes(data.likes.count);
    } catch (error) {
      console.log('Error liking prompt:', error);
    }
  }

  return (
    <div className={'prompt_card'}>
      <div className={'flex justify-between items-start gap-5'}>
        <div
          onClick={handleProfileClick}
          className={'flex-1 flex justify-start items-center gap-3 cursor-pointer'}
        >
          <Image
            src={props.prompt.creator.image}
            alt={'user_image'}
            width={40}
            height={40}
            className={'rounded-full object-contain'}
          />
          <div className={'flex flex-col'}>
            <h3 className={'font-satoshi font-semibold text-gray-900'}>
              {props.prompt.creator.username}
            </h3>
            <p className={'font-inter text-sm text-gray-500'}>
              {props.prompt.creator.email}
            </p>
          </div>
        </div>

        <div className={'copy_btn'} onClick={handleCopy}>
          <Image
            src={copied === props.prompt.prompt
              ? '/assets/icons/tick.svg'
              : '/assets/icons/copy.svg'}
            alt={'copy'}
            width={12}
            height={12}
          />
        </div>
      </div>

      <p className={'my-4 font-satoshi text-sm text-gray-700'}>
        {props.prompt.prompt}
      </p>
      <div className={'flex justify-between items-start gap-2'}>
        <p
          className={'font-inter text-sm blue_gradient cursor-pointer'}
          onClick={handleTagClick}
        >
          {props.prompt.tag}
        </p>
        <div className={'flex gap-1.5 items-center'}>
          <button className={'copy_btn'} onClick={handleLike}>
            {liked ? ('💕') : ('♡‍')}
          </button>
          <p className={'font-inter text-sm text-gray-500'}>
            {likes}
          </p>
        </div>
      </div>

      {session?.user.id === props.prompt.creator._id && pathname ===
        '/profile' && (
          <div
            className={'mt-5 flex-center gap-4 border-t border-gray-100 pt-3'}>
            <p
              className={'font-inter text-sm green_gradient cursor-pointer'}
              onClick={handleEdit}
            >
              Edit
            </p>
            <p
              className={'font-inter text-sm orange_gradient cursor-pointer'}
              onClick={handleDelete}
            >
              Delete
            </p>
          </div>
        )}
    </div>
  );
};

export default PromptCard;