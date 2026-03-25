import { redirect } from 'next/navigation'

import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/supabase/server'

export default async function ProtectedPage() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getClaims()
    if (error || !data?.claims) {
        redirect('/auth/login')
    }

    const { data: userData } = await supabase.auth.getUser()

    const { data: user } = await supabase.from('user_profiles').select('*').eq('id', userData.user?.id)

    return (
        <div className="flex flex-1 font-nunito w-full items-center justify-center gap-2">
            <p>
                Hello <span>{data.claims.email}</span>
            </p>
            <LogoutButton />
            <pre>
                {JSON.stringify(user, null, 4)}
            </pre>
        </div>
    )
}
