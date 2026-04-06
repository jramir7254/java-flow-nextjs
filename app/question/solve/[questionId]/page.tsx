import React from 'react'
import { createClient } from '@/lib/supabase/server'
import SolveWorkspace, { QuestionWithDetails } from './solve-workspace'

import { TelemetryProvider } from '@/providers/telemetry-provider'

export default async function SolvePage({
    params,
}: {
    params: Promise<{ questionId: string }>
}) {
    const { questionId } = await params
    const supabase = await createClient()

    // TODO: error screen if not found
    // ERROR: Verify the student is enrolled before giving them the course
    const { data, error } = await supabase
        .from('question_details')
        .select(`
            id,
            instructions,
            ai_enabled,
            content_item:content_items!inner (
                name,
                course:courses (
                    id,
                    name
                )
            ),
            code_files (
                id,
                file_name,
                initial_content,
                is_editable,
                is_hidden
            ),
            test_cases (
                id,
                input,
                expected_output,
                entry_file_name,
                is_public,
                is_example
            ),
            answers (
                content
            )
        `)
        .eq('id', questionId)
        .single();

    if (error) {
        return <div>Error: {error.message}</div>
    }

    const question = data as unknown as QuestionWithDetails

    return (
        <TelemetryProvider questionId={question.id}>
            <SolveWorkspace questionInfo={question} />
        </TelemetryProvider>
    )
}

