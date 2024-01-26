'use client'
import { SessionContextValue, signIn, signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const SignIn = () => {
    const { data: session, status }: SessionContextValue = useSession();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();

    const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault()
        // console.log("SESSION", session);
        const res = await signIn("credentials", {
            email,
            password,
            callbackUrl: '/',
            redirect: false,
        })

        if (res?.ok) {
            console.log('User object from signin response:', res);
        } else {
            console.error('Authentication error:', res?.error);
        }

    }

    useEffect(() => {
        console.log('User object from session effect:', session, " STATUS: ", status);
    })

    return (
        <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <h1>Sign In Form</h1>
            <input type="email" placeholder="Enter email" name="Email" value={email} onChange={({ target }) => setEmail(target?.value)} />
            {" "}
            <input type="password" placeholder="Enter password" name="Password" value={password} onChange={({ target }) => setPassword(target?.value)} />
            {" "}

            {
                session?.user.provider === "credentials"
                    ?
                    (status === "authenticated"
                        ?
                        <button type="button" onClick={() => signOut()}>Sign out from credentials</button>
                        :
                        <button type="submit">Sign in with credentials</button>
                    )
                    :
                    <button type="submit">Sign in with credentials</button>
            }
            {
                session?.user.provider === "google"
                    ?
                    (status === "authenticated"
                        ?
                        <button type="button" onClick={() => signOut()}>Sign out from google</button>
                        :
                        <button type="button" onClick={() => signIn("google", { callbackUrl: "/", redirect: false })}>Sign in with google</button>
                    )
                    :
                    <button type="button" onClick={() => signIn("google", { callbackUrl: "/", redirect: false })}>Sign in with google</button>
            }
        </form>
    )
}

export default SignIn