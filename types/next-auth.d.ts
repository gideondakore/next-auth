import NextAuth, { DefaultSession } from "next-auth"
// import  from "next-auth"

declare module 'next-auth'{
    interface Session {
        user: {
            accessToken?: string | null
        } & DefaultSession["user"]
    }
}