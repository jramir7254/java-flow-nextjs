import { ScrollArea } from '@/components/ui/scroll-area'
import { createClient } from '@/lib/supabase/server'
import React from 'react'
import { CourseItem } from './_components/content-item'

export default async function CoursePage({
    params,
}: {
    params: Promise<{ courseId: string }>
}) {
    const { courseId } = await params
    const supabase = await createClient()

    // Fetch Content and Course data
    const [contentRes, courseRes] = await Promise.all([
        supabase.from('content_items').select('*').eq('course_id', courseId).order('order_index', { ascending: true }),
        supabase.from('courses').select('*').eq('id', courseId).single()
    ])

    const contentItems = contentRes.data
    const course = courseRes.data

    // Build the Tree Structure
    const itemMap = Object.fromEntries(
        contentItems?.map(item => [item.id, { ...item, children: [] }]) || []
    );

    const rootContents = [];
    contentItems?.forEach(item => {
        const node = itemMap[item.id];
        if (item.parent_id && itemMap[item.parent_id]) {
            itemMap[item.parent_id].children.push(node);
        } else {
            rootContents.push(node);
        }
    });

    return (
        <ScrollArea className='h-full max-h-[90vh] p-6'>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{course?.name}</h1>
                <p className="text-muted-foreground">{course?.course_code}</p>
            </div>

            <div className='flex flex-col gap-2 max-w-2xl '>
                {rootContents?.sort((a, b) => a?.order_index < b?.order_index)?.map(item => (
                    <CourseItem key={item.id} item={item} />
                ))}
            </div>
        </ScrollArea>
    )
}