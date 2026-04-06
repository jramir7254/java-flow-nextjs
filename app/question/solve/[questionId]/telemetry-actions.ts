"use server"

import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/supabase'
import { headers } from 'next/headers'

type EventType = Database['public']['Enums']['event_type_enum']

const DISABLE_TELEMETRY = process.env.DISABLE_TELEMETRY === 'true';

export async function initTelemetrySession(questionId: string) {
    if (DISABLE_TELEMETRY) return { success: true, sessionId: 'dev-session-disabled' }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || 'Unknown'

    const { data, error } = await supabase
        .from('telemetry_sessions')
        .insert({
            user_id: user.id,
            question_id: questionId,
            user_agent: userAgent,
            started_at: new Date().toISOString()
        })
        .select('id')
        .single()

    if (error) {
        console.error('Error init telemetry:', error)
        return { success: false, error: error.message }
    }

    return { success: true, sessionId: data.id }
}

export async function updateTelemetrySession(
    sessionId: string,
    finalCode: string,
    isPassed?: boolean,
    counts?: {
        ai_prompt_count: number,
        copy_count: number,
        cut_count: number,
        paste_count: number,
        submission_attempts: number
    },
    total_time_ms?: number
) {
    if (DISABLE_TELEMETRY) return { success: true }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const { error } = await supabase
        .from('telemetry_sessions')
        .update({
            final_code: finalCode,
            is_passed: isPassed,
            ended_at: new Date().toISOString(),
            total_time_ms,
            ...(counts || {})
        })
        .eq('id', sessionId)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating telemetry:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}

export async function flushTelemetryEvents(sessionId: string, events: any[]) {
    if (DISABLE_TELEMETRY) return { success: true }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    if (!events || events.length === 0) return { success: true }

    const records = events.map(e => ({
        session_id: sessionId,
        event_type: e.event_type as EventType,
        payload: e.payload,
        created_at: e.created_at
    }))

    const { error } = await supabase
        .from('telemetry_events')
        .insert(records)

    if (error) {
        console.error('Error flushing telemetry:', error)
        return { success: false, error: error.message }
    }

    return { success: true }
}
