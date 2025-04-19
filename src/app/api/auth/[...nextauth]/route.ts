import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        login: { label: "Phone/Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          throw new Error('Please provide all required fields');
        }

        await connectDB();

        // Check if login is phone or email
        const isPhone = /^\d+$/.test(credentials.login);
        const query = isPhone 
          ? { phone: credentials.login }
          : { email: credentials.login };

        const user = await User.findOne(query);

        if (!user) {
          throw new Error('No user found with these credentials');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          membershipStatus: user.membershipStatus,
          memberId: user.memberId,
          referralId: user.referralId,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.membershipStatus = user.membershipStatus;
        token.memberId = user.memberId;
        token.referralId = user.referralId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.phone = token.phone;
        session.user.membershipStatus = token.membershipStatus;
        session.user.memberId = token.memberId;
        session.user.referralId = token.referralId;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 