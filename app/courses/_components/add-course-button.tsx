'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { enrollToCourse, enrollToCourse2 } from '@/lib/supabase/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function AddCourseButton() {
    const router = useRouter();
    const [openAdd, setOpenAdd] = useState(false)
    const [openInfo, setOpenInfo] = useState(false)
    const [course, setCourse] = useState<any>(null)

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        try {
            const result = await enrollToCourse(formData)
            setCourse(result)
            setOpenAdd(false)
            setOpenInfo(true)
        } catch (e: any) {
            toast.error(e?.message)

        }



    }

    return (
        <>
            {/* FIRST DIALOG */}
            <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                <DialogTrigger asChild>
                    <Button size="icon">
                        <Plus />
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <form onSubmit={submit}>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold pb-2">Add a course</DialogTitle>
                            <DialogDescription>
                                Enter the course code below.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-2 pt-2 pb-3">
                            <Input name="courseCode" id="courseCode" placeholder="Course Code" />
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit">Search</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* SECOND DIALOG */}
            <Dialog open={openInfo} onOpenChange={setOpenInfo}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Course Found</DialogTitle>
                        <DialogDescription>
                            Confirm enrollment
                        </DialogDescription>
                    </DialogHeader>

                    {course && (
                        <div>
                            <p>{course.id}</p>
                            <p>{course.name}</p>
                            <p>{course.course_code}</p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button onClick={() => setOpenInfo(false)} variant="outline">
                            Cancel
                        </Button>
                        <Button onClick={async () => {
                            try {
                                await enrollToCourse2(course.id)
                                toast.success('Enrolled')
                                router.refresh()
                            } catch (error: any) {
                                toast.error(String(error))

                            }
                        }}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}