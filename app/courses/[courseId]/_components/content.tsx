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

export default function Content({ children, content }: { children: React.ReactNode, content: ContentItem }) {
    const [fileText, setFileText] = React.useState('');

    useEffect(() => {
        if (content.type === 'question') return;
        (async () => {
            const data = await getFileContents(content);
            setFileText(data);
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
            <SheetContent className='min-w-[80vw]'>
                <SheetHeader>
                    <SheetTitle>{content.name} {content.order_index}</SheetTitle>
                    <SheetDescription>{content.type}</SheetDescription>
                    <div>
                        {fileText}
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}
