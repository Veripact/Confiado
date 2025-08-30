import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Page Not Found</CardTitle>
          <CardDescription>The debt agreement you're looking for doesn't exist or has expired.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/auth/signin">Go to Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
