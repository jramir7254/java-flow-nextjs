import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
    console.log(params);
    // 1. Auth Check
    const { session, user } = await locals.safeGetSession();

    if (!session || !user) {
        throw redirect(303, '/auth/login');
    }

    const { questionId } = params;

    // 2. Define Queries

    // Query A: Static Question Data (Details, Files, Tests, Metadata)
    const questionQuery = locals.supabase
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
                is_public,
                is_example
            )
        `)
        .eq('id', questionId)
        .single();

    // TODO: Save progress

    // 2. Execute
    const [questionResult] = await Promise.all([
        questionQuery,
    ]);

    // 4. Handle Errors
    if (questionResult.error || !questionResult.data) {
        console.error('Error fetching question:', questionResult.error);
        // Redirect to course overview or dashboard if question is invalid
        throw redirect(303, '/dashboard/student');
    }

    // 5. Data Transformation
    const question = questionResult.data;

    // Security: Filter out hidden test cases before sending to client
    const publicTestCases = question.test_cases.filter(tc => tc.is_public);

    return {
        session,
        user,
        question: {
            ...question,
            test_cases: publicTestCases
        },
        // TODO: Add Progress
        // If they have a previous submission, use that. Otherwise use initial_content.
        activeFiles: null
    };

}) satisfies PageServerLoad;