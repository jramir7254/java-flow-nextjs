'use server'

import { ContentItem } from '@/types'
import { createClient } from './server'
import { redirect } from 'next/navigation'

export async function enrollToCourse(formData: FormData) {
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


    if (!course) throw new Error('Course not found')
    if (e) throw new Error('Already enrolled in this course')

    return course
}

export async function enrollToCourse2(courseId: string) {
    console.log('in 2')

    const supabase = await createClient()

    const { data, error } = await supabase.auth.getClaims()
    if (error || !data?.claims) {
        redirect('/auth/login')
    }

    const { data: user } = await supabase.auth.getUser()

    const { error: insertError } = await supabase.from('course_enrollments').insert({ course_id: courseId, user_id: user?.user?.id, status: 'active' })

    if (insertError) throw new Error('An error occured trying to enroll')

    console.error({ insertError })

    // JXX6MY
    //

}




export async function getFileContents(item: ContentItem) {

    const supabase = await createClient()

    const { data, error } = await supabase.auth.getClaims()
    if (error || !data?.claims) {
        redirect('/auth/login')
    }

    if (item.type === 'file') {
        const { data, error } = await supabase.from('md_file_details').select('*').eq('id', item.id).single()
        return data.markdown_content
    }

    if (item.type === 'question') {
        //    const { data, error } = await supabase.from('md_file_details').select('*').eq('id', item.id).single()
        return ""
    }




}


