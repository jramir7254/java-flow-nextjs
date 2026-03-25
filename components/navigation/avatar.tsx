"use client"

import React, { useEffect, useState } from 'react'
import { createClient } from "@/lib/supabase/client";
import { Command } from 'lucide-react';
import { SidebarMenuButton } from '../ui/sidebar';
import { useAuthUser } from '@/hooks/use-auth-user';
import RoleBadge from '../role-badge';


export default function Avatar() {
    const { user } = useAuthUser()



    return (
        <SidebarMenuButton size="lg" asChild>

            <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user ? user?.email : 'Guest'}</span>
                    <RoleBadge role={user?.role} />
                </div>
            </a>
        </SidebarMenuButton>

    )
}
