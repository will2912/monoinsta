import supabase from "@/lib/supabase";
import { auth0 } from "@/lib/auth0";
import { syncUser } from "@/service/user.service";

export async function GET() {
        const session=await auth0.getSession();
        if(!session){
            console.log("no session");
            return new Response(JSON.stringify({error:"Unauthorized"}),{status:401});
        }
        const authUser= session.user;
        const user=await syncUser(authUser);

        return new Response(JSON.stringify(user),{status:200});
}