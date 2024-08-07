import { connectToDatabase } from '@utils/database';
import Prompt from '@models/prompt';

export const POST = async (req) => {
  const { userId, prompt, tag } = await req.json();

  try {
    await connectToDatabase();
    const newPrompt = new Prompt({
      creator: userId,
      prompt,
      tag,
      likes: { likedBy: [], count: 0 },
    });
    await newPrompt.save();

    return new Response(JSON.stringify(newPrompt), {
      status: 201,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return new Response('Failed to create a new prompt', {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
};