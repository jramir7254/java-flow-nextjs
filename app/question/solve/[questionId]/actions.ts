"use server"

import { createClient } from '@/lib/supabase/server'
import { SubmitResult } from './_panes/test-cases-pane'
import JSZip from 'jszip'

const JUDGE0_API_URL = process.env.JUDGE0_API_URL!
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY!
const JUDGE0_HOST = new URL(JUDGE0_API_URL).hostname
const MULTIFILE_LANGUAGE_ID = 89

export interface CodeSubmissionFile {
    fileName: string;
    content: string;
}

async function buildZip(
    files: CodeSubmissionFile[],
    entryFileName: string
): Promise<string> {
    const zip = new JSZip()
    for (const f of files) {
        zip.file(f.fileName, f.content)
    }

    const className = entryFileName.replace(/\.java$/, '')
    zip.file('compile', `javac ${entryFileName}\n`)
    zip.file('run', `java ${className}\n`)

    return zip.generateAsync({ type: 'base64' })
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

        const results: Record<string, SubmitResult> = {};

        for (const tc of testCases) {
            const entryFile = files.find(f => f.fileName === tc.entry_file_name)
                ?? files[0];

            const additionalFiles = await buildZip(files, entryFile.fileName);

            const body = {
                language_id: MULTIFILE_LANGUAGE_ID,
                stdin: tc.input || '',
                additional_files: additionalFiles,
            };

            const res = await fetch(`${JUDGE0_API_URL}/submissions/?wait=true`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': JUDGE0_API_KEY,
                    'X-RapidAPI-Host': JUDGE0_HOST,
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(`Judge0 API error ${res.status}: ${(errorData as any).message || 'Unknown error'}`);
            }

            const data = await res.json();

            const stdout = (data.stdout ?? '').trim();
            const stderr = data.stderr || '';
            const compileOutput = data.compile_output || '';
            const statusId: number = data.status?.id;
            const expected = (tc.expected_output || '').trim();

            const error = [stderr, compileOutput].filter(Boolean).join('\n') || undefined;

            const isAccepted = statusId === 3;
            const passedTests = isAccepted && !error && stdout === expected;

            results[tc.id] = {
                input: tc.input || '',
                result: stdout,
                expectedResult: expected,
                passedTests,
                error,
            };

            if (!passedTests) {
                break;
            }
        }

        return results;

    } catch (err: any) {
        console.error("Submission error details:", err);
        throw new Error(err.message || 'Failed to run your submission');
    }
}
