'use client'
import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

interface SessionProviderProps {
    children: ReactNode
}

const NextAuthProvider: React.FC<SessionProviderProps> = ({ children }) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
export default NextAuthProvider