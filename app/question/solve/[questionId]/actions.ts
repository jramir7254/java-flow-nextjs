"use server"

import { createClient } from '@/lib/supabase/server'
import { SubmitResult } from './_panes/test-cases-pane'

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

export interface CodeSubmissionFile {
    fileName: string;
    content: string;
}

export async function submitSolution(
    questionId: string,
    files: CodeSubmissionFile[]
): Promise<Record<string, SubmitResult>> {
    const supabase = await createClient();

    try {
        const { data: testCases, error: dbError } = await supabase
            .from('test_cases')
            .select('*')
            .eq('question_id', questionId);

        if (dbError) {
            console.error('Supabase error:', dbError);
            throw new Error(`Database error: ${dbError.message}`);
        }

        if (!testCases || testCases.length === 0) {
            return {};
        }

        const pistonFiles = files.map(f => ({
            name: f.fileName,
            content: f.content
        }));

        const results: Record<string, SubmitResult> = {};
        let allPassedSoFar = true;

        for (const tc of testCases) {
            const payload = {
                language: 'java',
                version: '15.0.2',
                files: pistonFiles,
                stdin: tc.input || '',
                args: []
            };

            const pistonRes = await fetch(PISTON_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!pistonRes.ok) {
                const errorData = await pistonRes.json().catch(() => ({}));
                throw new Error(`Piston API error ${pistonRes.status}: ${errorData.message || 'Unknown error'}`);
            }

            const pistonData = await pistonRes.json();

            const output = pistonData.run?.stdout?.trim() || "";
            const stderr = pistonData.run?.stderr || "";
            const expected = (tc.expected_output || '').trim();

            const passedTests = !stderr && output === expected;

            results[tc.id] = {
                input: tc.input || '',
                result: output,
                expectedResult: expected,
                passedTests: passedTests,
                error: stderr || undefined
            };

            if (!passedTests) {
                allPassedSoFar = false;
                break;
            }
        }

        return results;

    } catch (err: any) {
        console.error("Submission error details:", err);
        throw new Error(err.message || 'Failed to run your submission');
    }
}
