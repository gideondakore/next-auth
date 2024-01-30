import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider, { CredentialInput } from "next-auth/providers/credentials";
import { DefaultSession, NextAuthOptions, Session} from "next-auth";
import bcrypt from "bcryptjs";
import { User } from "next-auth";
import { GET } from "@/libs/dbQuery";
import { cookies } from "next/headers";
import { MongoDBAdapter} from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongoDBAdapter";
import { Adapter } from "next-auth/adapters";

type CredentialType = Record<string, CredentialInput>;
interface CredentialsProps {
    user: {
        name?: string,
        email?: string,
        id?: string
      },
      message?: string
}


export const authOption: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise) as Adapter,

    providers: [
        GoogleProvider({
            clientId: "585130326071-1k92frderaoor39o1liehcg3ttdqlpjr.apps.googleusercontent.com",
            clientSecret: "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",
            // process.env.CLIENT_ID as string
            // process.env.CLIENT_SECRET as string
        }),

        CredentialsProvider({
            name: "credentials",
            type: "credentials",
            credentials: {} as CredentialType,

            async authorize(credentials, req){
                if(!credentials) return null;
                const {email, password}  = credentials;
                const res = await fetch(`http://localhost:3000/api/user?email=${email}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                
                const user = await res.json();
                if(user && bcrypt.compareSync(password, user.user.password)){
                    return user;
                }
                return null;
            }

        }),
    ],
    callbacks: {
        async signIn({user, account, profile, email, credentials}){
            console.log("=============SIGNIN============");
            console.log("USER",user, "ACCOUNT",account, "PROFILE",profile,"EMAIL",email,"CREDENTIALS",credentials);
          try {
              if(account?.type === "oauth"){
                const data = await GET(user.email);
                if(data.user){
                  if(data.user.account_type === "oauth"){
                      account.accountLinked;
                      return true;
                  }

                  if(!data.user.account_linked && data.user.account_type === "credentials"){
                    console.log("===========LINK============");
                    console.log("USER",user, "ACCOUNT",account, "PROFILE",profile,"EMAIL",email,"CREDENTIALS",credentials);
                    const oneDay = 24 * 60 * 60 * 1000
                    cookies().set('auth.db_data', JSON.stringify(data.user), {httpOnly: true, sameSite: "strict", expires: Date.now() + oneDay});
                    cookies().set('auth.oauth_data.user', JSON.stringify(user), {httpOnly: true, sameSite: "strict", expires: Date.now() + oneDay});
                    cookies().set('auth.oauth_data.account', JSON.stringify(account), {httpOnly: true, sameSite: "strict", expires: Date.now() + oneDay});
                    return `/linkpage/${data.user.id}`
                    // return true;
                  }
                }
              }


              if(account?.provider === "credentials"){
                return true;
              }
              console.log("=========================================")
              return false;
            // return true;

          } catch (error) {
            throw new Error(`Error occur while signing you in, try again later\n${error}`);
          }
        },

        async jwt({token, user, account, profile, trigger}){
            console.log("===============JWT===================");
            console.log(token, user, account, profile, trigger);
            if(account?.type === "oauth"){
                token.accessToken = account.access_token;
                token.provider = account?.provider;
                token.linkAccount = account?.linkAccount;
                token.foundAccount = account?.foundAccount;
            }
            if(account?.type === "credentials"){
                token.user = user;
                token.provider = account?.provider;
                return token;
            }
            return token
        },

        async session({session, token, user}): Promise<Session | DefaultSession>{
            console.log("=================SESSION================");
            console.log(session, token, user);
            if(session.user && token?.provider === "google"){
                session.user.accessToken = token.accessToken as string;
                session.user.provider = token?.provider;
                session.user.linkAccount = token?.linkAccount as boolean;
                session.user.foundAccount = token?.foundAccount as boolean;
                
            }

            if(token?.provider === "credentials"){
              session.user.name = (token.user as CredentialsProps).user.name;
              session.user.email = (token.user as CredentialsProps).user.email;
              session.user.provider = token?.provider;
            }

            if (!session?.user.linkAccount && session?.user.foundAccount) {
                
            }

            return session
        },

        async redirect({url, baseUrl}){
            if(url.startsWith("/")) return `${baseUrl}${url}`
            else if(new URL(url).origin === baseUrl) return url;
            return baseUrl;
        }

    
    },
    
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
    pages: {
        signIn: "/signIn"
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 2,
        updateAge: 60 * 60 * 24,
    }
    
}
