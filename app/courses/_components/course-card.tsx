"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import React from "react";
import { useRouter } from "next/navigation";
import { Course } from "@/types";



export default function CourseCard({ course }: { course: Course }) {


    const router = useRouter();

    const handleClick = () => {
        router.push(`/courses/${course.id}`);
    };


    return (
        <Card className="relative w-full aspect-square max-h-fit! max-w-sm pt-0 ">
            <Image
                width={0}
                height={0}
                src="/travis.jpg"
                alt="Event cover"
                className="relative z-20  w-full object-cover brightness-60 grayscale dark:brightness-40"
            />
            <CardHeader>
                <CardAction>
                    <Badge variant="secondary">Featured</Badge>
                </CardAction>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button className="w-full" onClick={handleClick}>
                    View Course
                </Button>
            </CardFooter>
        </Card>
    );
}
