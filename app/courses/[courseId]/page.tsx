import { ScrollArea } from '@/components/ui/scroll-area'
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

    const { data, error } = await supabase.from('courses').select('*').eq('id', courseId).single()


    const rootItems = (contentItems ?? [])
        .filter((item) => item.parent_id === null)
        .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))


    return (
        <ScrollArea className='h-full max-h-[90vh]'>
            <h1>{data?.name}</h1>
            <p>{data?.course_code}</p>
            <p>{data?.id}</p>
            <div className='flex flex-col gap-3'>


                {rootItems.map(i =>
                    <div className='bg-accent' key={i?.id}>
                        <h3>{i?.name}</h3>
                    </div>)}
            </div>
            <pre>
                {JSON.stringify(contentItems, null, 4)}
            </pre>

        </ScrollArea>
    )
}
