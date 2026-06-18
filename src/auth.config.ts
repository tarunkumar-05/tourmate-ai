import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      
      // If user is already logged in, redirect away from auth pages
      if (isLoggedIn && (nextUrl.pathname === '/auth/login' || nextUrl.pathname === '/auth/register')) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      
      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'TOURIST';
      }
      if (trigger === 'update' && session?.user) {
        token.role = session.user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
