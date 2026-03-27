import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/lib/supabase/server";
import React from "react";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ questionId: string }>;
}) {
  const { questionId } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("question_details")
    .select(
      `
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
    `,
    )
    .eq("id", questionId)
    .single();

  return <ScrollArea>{JSON.stringify(data)}</ScrollArea>;
}
