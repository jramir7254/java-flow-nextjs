"use client"

import * as React from "react"
import {
    ChevronRight,

    Home,

    CircleUserRound,
    type LucideIcon,
    CircuitBoard

} from "lucide-react"


import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import { usePathname, } from 'next/navigation';

// import { logger } from "@/lib/logger";
// import { CollapsibleTrigger, CollapsibleContent, Collapsible } from "../ui/collapsible";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import Avatar from "./avatar";

type Link = {
    name: string,
    link?: string,
    icon: LucideIcon,
    requireAuth?: boolean,
    children?: Link[],
}


const links: Link[] = [
    {
        name: "Home",
        icon: Home,
        link: "/",
        requireAuth: false,
    },
    {
        name: "Account",

        icon: CircleUserRound,

        link: "/protected",
        requireAuth: true,
    },
    {
        name: "Courses",

        icon: CircuitBoard,

        link: "/courses",
        requireAuth: true,
    }
]


const matchPath = (pathname: string, link: string | undefined) => {
    if (!link) return false
    return pathname === link
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();

    // const { data } = authClient.useSession();

    const isAuthed = !!true


    // logger.debug("[PATH]", pathname, pathname === '/account/*')


    return (
        <Sidebar variant="inset" {...props} className="">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            {/* <Avatar /> */}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="font-nunito">
                <SidebarGroup >
                    <SidebarGroupContent className="space-y-2">
                        {links.map(link => link.requireAuth && !isAuthed ? null : (
                            // <SidebarGroup key={link.name}>
                            //     <SidebarGroupContent>
                            <SidebarMenu key={link.name}>
                                {link.children ?
                                    <Collapsible key={link.name}>
                                        <SidebarMenuItem>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton tooltip={link.name}>
                                                    {link.icon && <link.icon />}
                                                    <span>{link.name}</span>
                                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {link.children?.map((subItem) => (
                                                        <SidebarMenuSubItem key={subItem.name}>
                                                            <SidebarMenuSubButton asChild isActive={matchPath(pathname, subItem.link)}>
                                                                <Link href={subItem.link || "#"} >
                                                                    <subItem.icon />
                                                                    <span>{subItem.name}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </SidebarMenuItem>
                                    </Collapsible>
                                    :
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={matchPath(pathname, link.link)} >
                                            <Link href={link.link || "#"} >
                                                <link.icon />
                                                <span>{link.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                }
                            </SidebarMenu>

                        ))}
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
            <SidebarFooter>
                {/* <Footer /> */}
            </SidebarFooter>
        </Sidebar>
    )
}