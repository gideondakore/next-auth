// 'use client'
import React from 'react'
// import { useState } from 'react'
import { cookies } from 'next/headers'

const Linkpage = ({ params }: { params: { id: string } }) => {
    // const [accept, setAccept] = useState<boolean>(false);
    const { id } = params;
    console.log("Params id: ", id);
    const cookiesStore = cookies();
    const userEmail = cookiesStore.get('auth.userEmail');
    console.log("From userEmail", userEmail);
    return (
        <div>
            <h1>Linking account</h1>
            <div>
                <pre>
                    Link your account so that you can use
                    google to login next time you visit
                    the site
                </pre>
                <button type="button">Accept</button>
                <button type="button">Decline</button>
            </div>
        </div>
    )
}

export default Linkpage