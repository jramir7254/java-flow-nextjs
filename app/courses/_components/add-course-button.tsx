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
import { enrollToCourse } from '@/lib/supabase/actions'
import { toast } from 'sonner'

export default function AddCourseButton() {
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
        } catch (e) {
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
                            <DialogTitle>Add a course</DialogTitle>
                            <DialogDescription>
                                Enter the course code below.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-2">
                            <Label htmlFor="courseCode">Course Code</Label>
                            <Input name="courseCode" id="courseCode" />
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
                            <p>{course.name}</p>
                            <p>{course.course_code}</p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button onClick={() => setOpenInfo(false)} variant="outline">
                            Cancel
                        </Button>
                        <Button onClick={() => toast.success('Enrolled')}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}