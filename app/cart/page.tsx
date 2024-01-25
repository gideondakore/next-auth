'use client'
import React from 'react'
import { SessionContextValue, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const CartPage = () => {
    const router = useRouter();
    const { data: session, status }: SessionContextValue = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/signIn')
        }
    });

    if (status === "loading" || status !== "authenticated") {
        return `User info ${status}...`
    }

    return "User is logged in"
}

export default CartPage