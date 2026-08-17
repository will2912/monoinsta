import supabase from "@/lib/supabase";
export async function syncUser(authUser: any) {

  // 1. check existing user
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("auth0_id", authUser.sub)
    .single();

  // already exists
  if (existingUser) {
    
    return existingUser;
  }

  // 2. create new user
  const { data: newUser, error } = await supabase
    .from("users")
    .insert({
      auth0_id: authUser.sub,
      username: authUser.name,
      avatar_url: authUser.picture,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }
  console.log("new user created:", newUser);
  return newUser;
}

// services/user.service.ts



export async function getUserId(auth0Id: string) {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("auth0_id", auth0Id)
    .single();

  if (error) throw error;

  return data.id;
}