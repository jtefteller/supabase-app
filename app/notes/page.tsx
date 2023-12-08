import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await supabase.from("notes").select("*");
  console.log(data);
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
