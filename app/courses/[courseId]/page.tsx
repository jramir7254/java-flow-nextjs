import { ScrollArea } from '@/components/ui/scroll-area'
import { createClient } from '@/lib/supabase/server'
import React from 'react'
import { CourseItem } from './_components/content-item'
import { Separator } from '@/components/ui/separator'

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

    const contentItems = contentRes.data ?? []
    const course = courseRes.data

    type ContentRow = typeof contentItems[number]
    interface TreeNode extends ContentRow { children: TreeNode[] }

    const itemMap: Record<string, TreeNode> = Object.fromEntries(
        contentItems.map(item => [item.id, { ...item, children: [] }])
    );

    const rootContents: TreeNode[] = [];
    contentItems.forEach(item => {
        const node = itemMap[item.id];
        if (item.parent_id && itemMap[item.parent_id]) {
            itemMap[item.parent_id].children.push(node);
        } else {
            rootContents.push(node);
        }
    });

    return (
        <ScrollArea className='h-full max-h-[90vh] p-6'>
            <div className='flex flex-col gap-2 max-w-2xl '>
                {rootContents.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)).map(item => (
                    <CourseItem key={item.id} item={item} />
                ))}
            </div>
        </ScrollArea>
    )
}