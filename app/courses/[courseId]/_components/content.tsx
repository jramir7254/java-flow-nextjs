import React, { useEffect, useRef } from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ContentItem } from '@/types'
import { getFileContents } from '@/lib/supabase/actions';

export default function Content({ children, content }: { children: React.ReactNode, content: ContentItem }) {
    const [fileText, setFileText] = React.useState('');

    useEffect(() => {
        (async () => {
            const data = await getFileContents(content);
            setFileText(data);
        })();
    }, [content]);


    return (
        <Sheet >
            <SheetTrigger asChild>
                <div className="flex items-center gap-2 w-full">
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
