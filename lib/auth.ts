import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcryptjs from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                nim: { label: "NIM", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.nim || !credentials?.password) {
                    return null
                }
                const user = await prisma.user.findUnique({
                    where: { nim: credentials.nim }
                })
                
                if (!user) {
                    return null
                }

                // Verify the hashed password against the plaintext input
                const isPasswordValid = await bcryptjs.compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    return null
                }

                // Reject login if user is an OFFICER or POI and has already cast their vote
                if ((user.role === "OFFICER" || user.role === "POI") && user.hasVoted) {
                    throw new Error("ALREADY_VOTED");
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        })
    ],
    pages: {
        signIn: '/',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = (user as any).id;
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
            }
            return session
        }
    },
    session: {
        strategy: 'jwt'
    }
}
