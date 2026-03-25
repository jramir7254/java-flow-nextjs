'use client'



import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { logger } from "@/lib/logger"

export function useAuthUser() {
    const supabase = createClient()
    const [user, setUser] = useState<unknown | null>(null)

    useEffect(() => {
        (async () => {
            const { data } = await supabase.auth.getUser()
            const { data: userProfile } = await supabase.from('user_profiles').select('*').eq('id', data.user?.id).single()
            setUser({ ...userProfile })
        })()
    }, [supabase, user])


    useEffect(() => {
        logger.info('user:', user)
    }, [user])

    return { user }
}