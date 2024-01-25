import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider, { CredentialInput } from "next-auth/providers/credentials";
import { NextAuthOptions} from "next-auth";
import { Session } from "next-auth";
import { Console } from "console";

type CredentialType = Record<string, CredentialInput>;


export const authOption: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: "585130326071-1k92frderaoor39o1liehcg3ttdqlpjr.apps.googleusercontent.com",
            clientSecret: "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",
        }),

        CredentialsProvider({
            name: "credentials",
            type: "credentials",
            credentials: {} as CredentialType,

            async authorize(credentials, req){
                // console.log("REQUEST FROM AUTHORIZE: ",req);
                if(!credentials) return null;
                const {email, password}  = credentials;
                const res = await fetch(`http://localhost:3000/api/user?email=${email}&password=${password}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                
                const user = await res.json();
                console.log("===============AUTHORIZE===============");
                console.log("Authorize User", user);
                if(user){
                    return user;
                }
                return null;
            }

        }),
    ],
    callbacks: {
        async signIn({user, account, profile, email, credentials}){
            // console.log("============SIGNIN============");
            // console.log(user, account, profile, email, credentials)
            // console.log("User SignIn", user);
          try {
              if(account?.provider === "google"){
                return true;
              }else{
                  return true;
              }
          } catch (error) {
             return false;
          }
        },

        async jwt({token, user, account, profile, trigger}){
            // console.log("============JWT============");
            // console.log("TOKENJwt",token, "USERJwt", user, "ACCOUNTJwt", account, "PROFILEJwt",profile, "TRIGGERJwt", trigger)
            // console.log("Jwt User", user);
            if(account){
                token.accessToken = account.access_token
            }
    
            return token
        },

        async session({session, token, user}): Promise<Session>{
            // console.log("============SESSION============")
            // console.log("SESSION",session, "TOKEN",token, "USER", user);
            // console.log("Session USER", session.user, user);
            if(session.user){
                session.user.accessToken = token.accessToken as string;
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
        maxAge: 60 * 60 * 24,
        updateAge: 60 * 60,
    }
    
}