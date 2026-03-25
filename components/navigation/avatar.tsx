"use client"

import React, { useEffect, useState } from 'react'
import { createClient } from "@/lib/supabase/server";
import { Command } from 'lucide-react';

export default function Avatar() {
    const [role, setRole] = useState('')

    useEffect(() => {
        async function yes() {

            const supabase = await createClient()
            const { data, error } = await supabase.auth.getClaims()

            setRole(data?.claims.role || 'No')
        }
    }, [role])






    return (
        <a href="#">
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Command className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Acme Inc</span>
                <span className="truncate text-xs">{role}</span>
            </div>
        </a>
    )
}
