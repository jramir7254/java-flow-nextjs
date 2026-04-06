import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">404 — Page Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            The page you&apos;re looking for doesn&apos;t exist.
                        </p>
                        <Link
                            href="/"
                            className="mt-4 inline-block text-sm text-primary underline-offset-4 hover:underline"
                        >
                            Go back home
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
