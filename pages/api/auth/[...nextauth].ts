import NextAuth, { AuthOptions } from 'next-auth'
import Credential from 'next-auth/providers/credentials'
import prismadb from '@/lib/prismadb'
import { compare } from 'bcrypt'

import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

import { PrismaAdapter } from '@next-auth/prisma-adapter'

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    Credential({
      id: 'credentials',
      name: 'Credentials',

      credentials: {
        email: {
          label: "Email",
          type: "text",
        },

        password: {
          label: "Password",
          type: "password"
        }
      }, 
      async authorize(credentials){
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password is required");
        }

        const user = await prismadb.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("Email or Password is incorrect");
        }

        const isCorrectPassword = await compare(
          credentials.password, 
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Password is incorrect");
        }

        return user;
        
      }

    })
  ],

  pages: {
    signIn : '/auth',
  },
  
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prismadb),
  session: {
    strategy: 'jwt',

  },

  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
}

export default NextAuth(authOptions)

