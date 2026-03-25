
"use client"

import { SidebarTrigger } from "../ui/sidebar"
import { Separator } from "../ui/separator"
import ModeSwitch from "./mode-switch"


export default function Header() {

    return (

        <header className="flex h-16 shrink-0  items-center gap-2">
            <div className="flex items-center lg:gap-2 lg:px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                {/* <NavLink path='/auth/sign-in' text='Sign In' guest /> */}
            </div>
            <div className="lg:ml-auto mr-5 lg:mr-10">
                <ModeSwitch />
            </div>
        </header>
    )
}
