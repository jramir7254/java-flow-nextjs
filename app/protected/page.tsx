import { redirect } from 'next/navigation'
import { ScrollArea } from "@/components/ui/scroll-area";

import { createClient } from '@/lib/supabase/server'

export default async function ProtectedPage() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getClaims()
    if (error || !data?.claims) {
        redirect('/auth/login')
    }

    const { data: user } = await supabase.auth.getUser()

    // const { data: user } = await supabase.from('user_profiles').select('*').eq('id', userData.user?.id)

    return (
        <ScrollArea className="h-full">
            <div className="flex flex-1 font-nunito w-full items-center justify-center gap-2">

                <pre>
                    {JSON.stringify(user, null, 4)}
                </pre>
            </div>
        </ScrollArea>
    )
}
