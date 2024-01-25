'use client'
import { SessionContextValue, SessionProvider, useSession } from "next-auth/react";

export default function NextAuthProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status }: SessionContextValue = useSession();

    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    )
}