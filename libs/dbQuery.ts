export async function GET(email:string | null | undefined) {
   try {
     const res = await fetch(`http://localhost:3000/api/user?email=${email}`, {
        method: "GET",
        headers: {
            "Content-Type":"applicatio/json"
        }
     })

     return res.json();
   } catch (error) {
      throw new Error("Uh oh, an error was encountered");
   }
}

export async function PUT(id: string, linkAccount: boolean, acccountType: string){
    try {
         const res = await fetch(`http://localhost:3000/api/user`, {
            method: "PUT",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({id, linkAccount, acccountType})
         })
    } catch (error) {
       throw new Error("Uh oh, an error was encountered");
    }
}