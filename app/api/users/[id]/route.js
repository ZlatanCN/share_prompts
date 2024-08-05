import { connectToDatabase } from '@utils/database';
import User from '@models/user';

export const GET = async (req, { params }) => {
  try {
    await connectToDatabase();

    const user = await User.findById(params.id);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response('Failed to fetch user', { status: 500 });
  }
}