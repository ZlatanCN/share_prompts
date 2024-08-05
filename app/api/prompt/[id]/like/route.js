import { connectToDatabase } from '@utils/database';
import Prompt from '@models/prompt';

export const PATCH = async (req, { params }) => {
  const { userId, liked } = await req.json();
  // console.log('Liked:', liked);

  try {
    await connectToDatabase();

    const prompt = await Prompt.findById(params.id);
    // console.log('Prompt:', prompt);

    if (!prompt) {
      return new Response('Prompt Not Found', {
        status: 404,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    // console.log(prompt.likes.likedBy.toString());
    if (!liked) {
      if (!prompt.likes.likedBy.includes(userId)) {
        prompt.likes.likedBy.push(userId);
        prompt.likes.count += 1;
      }
    } else {
      if (prompt.likes.likedBy.includes(userId)) {
        prompt.likes.likedBy = prompt.likes.likedBy.filter(
          (id) => id.toString() !== userId.toString(),
        );
        prompt.likes.count -= 1;
      }
    }

    await prompt.save();

    return new Response(JSON.stringify(prompt), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
};