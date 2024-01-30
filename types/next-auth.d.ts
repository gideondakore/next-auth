import NextAuth, { DefaultSession } from "next-auth"
// import  from "next-auth"

declare module 'next-auth'{
    interface Session {
        user: {
            accessToken?: string | null,
            provider?: string | null,
            linkAccount?: boolean | null,
            foundAccount?: boolean | null,
        } & DefaultSession["user"]
    }
}
