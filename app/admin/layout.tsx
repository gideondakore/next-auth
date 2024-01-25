import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextAuthProvider from "@/components/sessionProvider";
import Auth from "@/components/Auth";
import React, { isValidElement } from "react";


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    "title": "Admin Page",
    "description": "HostelBookHub Admin only landing page"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

    let childrenWithAuth = {} as React.ReactNode;
    if (isValidElement(children)) {
        childrenWithAuth = React.cloneElement(children as any, { auth: true });
    }

    return (
        <NextAuthProvider>
            <Auth>
                {childrenWithAuth}
            </Auth>
        </NextAuthProvider>
    )
}

// const childrenWithAuth = async () => {
//     'use server';
//     return React.Children.map(children, (child): any => {
//         if (!child) {
//             return null;
//         }

//         if (isValidElement(child)) {
//             return React.cloneElement(child, {
//                 auth: true
//             })
//         }
//         return child;
//     })
// }
