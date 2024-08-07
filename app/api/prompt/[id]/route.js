import Prompt from '@models/prompt';
import { connectToDatabase } from '@utils/database';

export const GET = async (request, { params }) => {
  try {
    await connectToDatabase();

    const prompt = await Prompt.findById(params.id).populate('creator');
    if (!prompt) return new Response('Prompt Not Found', {
      status: 404,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });

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

export const PATCH = async (request, { params }) => {
  const { prompt, tag } = await request.json();

  try {
    await connectToDatabase();

    // Find the existing prompt by ID
    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt) {
      return new Response('Prompt not found', {
        status: 404,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      });
    }

    // Update the prompt with new data
    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();

    return new Response('Successfully updated the Prompts', {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return new Response('Error Updating Prompt', {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
};

export const DELETE = async (request, { params }) => {
  try {
    await connectToDatabase();

    // Find the prompt by ID and remove it
    const deletedPrompt = await Prompt.findById(params.id);
    await deletedPrompt.deleteOne();

    return new Response('Prompt deleted successfully', {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return new Response('Error deleting prompt', {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
};
