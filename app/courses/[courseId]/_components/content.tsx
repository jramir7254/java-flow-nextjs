import React, { useEffect } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ContentItem } from '@/types'
import { getFileContents } from '@/lib/supabase/actions';
import Link from 'next/link';
import { Markdown } from "@/components/ui/markdown";
import { Separator } from "@/components/ui/separator";

export default function Content({ children, content }: { children: React.ReactNode, content: ContentItem }) {
    const [fileText, setFileText] = React.useState('');

    useEffect(() => {
        if (content.type === 'question') return;
        (async () => {
            const data = await getFileContents(content);
            setFileText(data ?? '');
        })();
    }, [content]);

    if (content.type === 'question') {
        return (
            <Link href={`/question/solve/${content.id}`} className="w-full">
                {children}
            </Link>
        )
    }

    return (
        <Sheet >
            <SheetTrigger asChild>
                <div className="w-full cursor-pointer">
                    {children}
                </div>
            </SheetTrigger>
            <SheetContent className='min-w-[80vw] overflow-y-auto pt-6 pl-4 '>
                <SheetHeader>
                    <SheetTitle className="text-3xl font-bold">{content.name}</SheetTitle>
                </SheetHeader>
                <Separator />
                <div className="pl-4 max-w-3xl">
                    <Markdown>{fileText}</Markdown>
                </div>
            </SheetContent>
        </Sheet>
    )
}
