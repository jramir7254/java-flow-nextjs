import { createClient } from '@/lib/supabase/server'
import React from 'react'
import CourseCard from './_components/course-card'


export default async function CoursesPage() {

    const supabase = await createClient()

    const u = supabase.auth.getUser()

    const { data, error } = await supabase.from('courses').select('*')



    return (
        <div className='grid size-full gap-2'>
            {data?.map(c => <CourseCard key={c.id} course={c}></CourseCard>)}
        </div>
    )
}
