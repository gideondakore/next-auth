'use client'

import { SessionContextValue, signIn, signOut, useSession } from "next-auth/react"
import { useState } from "react"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"


const SignIn = () => {
    const { data: session, status }: SessionContextValue = useSession();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();

    const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault()

        const res = await signIn("credentials", {
            email,
            password,
            callbackUrl: '/',
            redirect: false,
        })

        // const user = res?.ok
        console.log("FROM INSIDE SIGNIN COMPONENTS: ", res);

        // const user = res
        //     .then(response => {
        //         if (response?.ok) {
        //             // redirect("/");
        //             router.push('/')
        //             console.log(response);
        //         }
        //         router.push(`${response?.url}/signIn`);
        //     })
        // .catch(error => { console.error("Error Message", error) });


        // console.log("From User: ",);

    }

    return (
        <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
            <h1>Sign In Form</h1>
            <input type="email" placeholder="Enter email" name="Email" value={email} onChange={({ target }) => setEmail(target?.value)} />
            {" "}
            <input type="password" placeholder="Enter password" name="Password" value={password} onChange={({ target }) => setPassword(target?.value)} />
            {" "}
            <button type="submit">Sign in with credentials</button>
            {
                status === "authenticated"
                    ?
                    <button type="button" onClick={() => signOut()}>Sign out from google</button>
                    :
                    <button type="button" onClick={() => signIn("google", { callbackUrl: "/" })}>Sign in with google</button>

            }
            {/* <button type="button" onClick={() => signIn('google', { callbackUrl: "/" })}> */}

            {/* </button> */}
        </form>
    )
}

export default SignIn