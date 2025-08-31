"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

interface ProfileNotificationProps {
  missingInfo: string[]
}

export function ProfileNotification({ missingInfo }: ProfileNotificationProps) {
  if (missingInfo.length === 0) {
    return null
  }

  const missingText = missingInfo.join(', ')

  return (
    <Alert className="border-orange-500 bg-orange-50 text-orange-900 border-2 mb-6">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-orange-800">
          Please update your profile with the missing information: <strong>{missingText}</strong>
        </span>
        <Button asChild variant="outline" size="sm" className="ml-4 border-orange-600 text-orange-700 hover:bg-orange-100 hover:border-orange-700">
          <Link href="/profile">
            Update Profile
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}
