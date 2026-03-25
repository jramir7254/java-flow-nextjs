import React from 'react'

import { Badge } from "@/components/ui/badge"
import { BadgeCheck, Circle } from "lucide-react"

const colorMap = {
    red: 'oklch(50.5% 0.213 27.518)',
    purple: 'oklch(54.1% 0.281 293.009)',
    yellow: 'oklch(90.5% 0.182 98.111)',
    orange: 'oklch(75% 0.183 55.934)',
    cyan: 'oklch(78.9% 0.154 211.53)',
    green: 'oklch(69.6% 0.17 162.48)',
    blue: 'oklch(62.3% 0.214 259.815)',
    white: 'oklch(87% 0 0)'
}


export default function RoleBadge({ role }: { role: string | undefined }) {
    return (
        <Badge variant="secondary">
            <Circle stroke='none' fill={colorMap.blue} data-icon="inline-start" />
            {role ? role : "guest"}
        </Badge>

    )
}


