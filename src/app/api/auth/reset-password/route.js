


export async function POST(req)
{
    try{
        const query = await req.json();
        const email = query.email;
        if (!email) return Response.json({message: "Email is required"}, {status: 400});

    } catch (err)
    {
        return Response.json({message: "Error While handling the request"}, {status: 500})
    }
}