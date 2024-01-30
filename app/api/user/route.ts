import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST (request: NextRequest, response: NextResponse) {
    try {
        const {name, email, password,account_linked, account_type} = await request.json();
        const hashedPassword = bcrypt.hashSync(password, 10);
        await User.create({ name, email, password:hashedPassword, account_linked, account_type});
        return NextResponse.json({message: "user created successfully"}, {status: 200})
    } catch (error) {
        return NextResponse.json({message: `Error: ${error}`}, {status: 500})
    }
}

export async function GET (request: NextRequest, response: NextResponse){
    try {
        const email = request.nextUrl.searchParams.get('email');
        // const {searchParams} = new URL(request.url);
        // const password = searchParams.get("password");

        const user = await User.findOne({email});
        if(user){
            return NextResponse.json({user: user, message: "User found"}, {status: 200});
        }
        return NextResponse.json({user: null, message: "User not found"}, {status: 201})
    } catch (error) {
        return NextResponse.json({error: error, message: "Something went wrong"}, {status: 500});
    }
}

export async function PUT (request: NextRequest, response: NextResponse){
    try {
        const {id, linkAccount:account_linked, accountType:account_type} = await request.json();
        await User.findByIdAndUpdate(id, {account_linked, account_type});
        return NextResponse.json({message:"Account updates successfully"}, {status: 200});
    } catch (error) {
        return NextResponse.json({error: error, message: "Something went wrong"}, {status:500});
    }
}