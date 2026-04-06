import { createClient } from '@/lib/supabase/server'
import React from 'react'
import CourseCard from './_components/course-card'
import AddCourseButton from './_components/add-course-button'
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function CoursesPage() {
    const supabase = await createClient()

    const { data: userData } = await supabase.auth.getUser()

    const { user } = userData

    console.log({ user })

    const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
            *,
            
            courses(*)
        `)
        .eq('user_id', user?.id)


    console.log({ data })


    return (
        <ScrollArea className="h-full">
            <div className='px-4 py-2'>
                <header className='flex'>
                    <div className='ml-auto'>
                        <AddCourseButton />
                    </div>
                </header>

                <div className='size-full  flex flex-wrap  gap-4 '>
                    {data?.map(c => <CourseCard key={c.course_id} course={c?.courses}></CourseCard>)}
                </div>
            </div>
        </ScrollArea>
    )
}
