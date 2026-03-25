import { createClient } from '@/lib/supabase/server'
import React from 'react'

export default async function CoursePage({
    params,
}: {
    params: Promise<{ courseId: string }>
}) {

    const { courseId } = await params

    const supabase = await createClient()


    const { data: contentItems, error: contentError } = await supabase
        .from('content_items')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });



    console.log(courseId)

    const { data, error } = await supabase.from('courses').select('*').eq('id', courseId)

    return (
        <div>
            <pre>

                {JSON.stringify(data, null, 4)}
                {JSON.stringify(contentItems, null, 4)}
            </pre>

        </div>
    )
}
