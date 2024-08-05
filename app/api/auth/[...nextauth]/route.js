import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import User from '@models/user';
import { connectToDatabase } from '@utils/database';

const handler = NextAuth({
  providers: [
    /*GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 10000,
      },
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
    }),*/
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      httpOptions: {
        timeout: 10000,
      },
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
    }),
  ],
  callbacks: {
    async session ({ session }) {
      // store the user id from MongoDB to session
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn ({ account, profile, user, credentials }) {
      try {
        await connectToDatabase();
        console.log('Profile: ', profile, 'User: ', user, 'Credentials: ',
          credentials, 'Account: ', account);

        // check if user already exists
        const userExists = await User.findOne({ email: profile.email });

        // if not, create a new document and save user in MongoDB
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.login.replace(' ', ''),
            image: profile.avatar_url,
          });
        }

        return true;
      } catch (error) {
        console.log('Error checking if user exists: ', error.message);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };