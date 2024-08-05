import { connectToDatabase } from '@utils/database';
import User from '@models/user';

export const GET = async (req, { params }) => {
  try {
    await connectToDatabase();

    const user = await User.findById(params.id);
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    return new Response('Failed to fetch user', {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  }
};