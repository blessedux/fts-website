import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { users } from "@/lib/db"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Use the mock data from db.ts instead of a real database
        if (credentials?.email && credentials?.password === "password") {
          const user = users.find((user) => user.email === credentials.email)
          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }

        // Demo login for testing (you can remove this in production)
        if (credentials?.email === "usuario@ejemplo.com" && credentials?.password === "password") {
          return {
            id: "1",
            name: "Usuario Demo",
            email: "usuario@ejemplo.com",
            role: "student",
          }
        }

        // Admin login for testing
        if (credentials?.email === "admin@eneagrama.com" && credentials?.password === "admin") {
          return {
            id: "3",
            name: "Admin",
            email: "admin@eneagrama.com",
            role: "admin",
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
})

export { handler as GET, handler as POST }
