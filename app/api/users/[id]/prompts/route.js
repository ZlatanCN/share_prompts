import { connectToDatabase } from '@utils/database';
import Prompt from '@models/prompt';

export const GET = async (req, { params }) => {
  try {
    await connectToDatabase();

    // console.log('params', params);
    const prompts = await Prompt.find({ creator: params.id }).
      populate('creator');
    // console.log('prompts', prompts);
    return new Response(JSON.stringify(prompts), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return new Response('Failed to fetch all prompts', {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }

};