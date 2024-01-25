'use client'
import React from 'react'
import { signOut, signIn, useSession } from 'next-auth/react'

const HomePage = () => {
  const { data: session, status } = useSession();
  // console.log("============CLIENT SESSION====================: ", session)


  return (
    status === "authenticated" ? (
      <button onClick={() => signOut()} type='button' style={{ cursor: 'pointer' }}>
        Sign out from Google
      </button>
    ) : (
      <button onClick={() => signIn("google", {
        redirect: false,
        callbackUrl: '/dashboard'
      })} type='button' style={{ cursor: 'pointer', display: 'flex', gap: '1rem', borderRadius: '0.5rem', paddingLeft: '0.75rem', alignItems: 'center', boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>
        Sign in with Google
      </button>
    )
  )

}

export default HomePage