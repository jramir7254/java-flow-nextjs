'use client'



import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { useAuthUser } from "./use-auth-user"

export function useUser() {
    const supabase = createClient()
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getUser()

            setUser(data.user)

        })()
    }, [supabase])

    return { user }
}