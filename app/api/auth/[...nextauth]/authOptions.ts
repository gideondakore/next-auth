import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider, { CredentialInput } from "next-auth/providers/credentials";
import { NextAuthOptions, Session} from "next-auth";
import bcrypt from "bcryptjs";

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
    providers: [
        GoogleProvider({
            clientId: process.env.CLIENT_ID as string,
            clientSecret: process.env.CLIENT_SECRET as string,
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
          try {
              if(account?.provider === "google" && user){
                const res = await fetch(`http://localhost:3000/api/user?email=${user.email}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();
               
                if(data){
                
                return "found";
                }
                return true;
              }

              if(account?.provider === "credentials" && user ){
                return true;
              }

              return false;

          } catch (error) {
            throw new Error(`Error occur while signing you in, try again later\n${error}`);
          }
        },

        async jwt({token, user, account, profile, trigger}){
            if(account?.type === "oauth"){
                token.accessToken = account.access_token;
                token.provider = account?.provider;
                return token;
            }
            if(account?.type === "credentials"){
                token.user = user;
                token.provider = account?.provider;
                return token;
            }
            return token
        },

        async session({session, token, user}): Promise<Session>{
            if(session.user && token?.provider === "google"){
                session.user.accessToken = token.accessToken as string;
                session.user.provider = token?.provider;
            }

            if(token?.provider === "credentials"){
              session.user.name = (token.user as CredentialsProps).user.name;
              session.user.email = (token.user as CredentialsProps).user.email;
              session.user.provider = token?.provider;
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
    pages: {
        signIn: "/signIn"
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 2,
        updateAge: 60 * 60 * 24,
    }
    
}
