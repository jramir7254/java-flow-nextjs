'use server'

import { createClient } from './server'
import { redirect } from 'next/navigation'

export async function enrollToCourse(formData: FormData) {
    console.log('AS:FSJIL:')
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getClaims()
    if (error || !data?.claims) {
        redirect('/auth/login')
    }

    const { data: user } = await supabase.auth.getUser()

    const courseCode = formData.get('courseCode')

    console.log('AS:FSJIL:', { courseCode, userID: user.user?.id })


    const { data: course } = await supabase.from('courses').select('*').eq('course_code', courseCode).single()

    const { data: e } = await supabase.from('course_enrollments').select('*').eq('course_id', course?.id).eq('user_id', user.user?.id).single()

    console.log('count', { e })




    if (!course) throw new Error('Course not found')

    if (e) throw new Error('Already enrolled in this course')

    return course
    // Mutate data
    // Revalidate cache
}

