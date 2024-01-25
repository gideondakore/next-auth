'use client'
import { useSession } from "next-auth/react";

function Auth({ children }: { children: any }) {
    const { data: session, status } = useSession({
        required: true
    })

    if (status === "loading") {
        return <div>Loading...</div>
    }
    return children;
}
export default Auth