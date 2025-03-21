"use client";

import { User } from "@supabase/supabase-js";

type Props = {
    user: User | null;
}
function AskAIButton( { user }: Props ) {
  console.log(user);
  
    return (
    <div>AskAIButton</div>
  )
}

export default AskAIButton