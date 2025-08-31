"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit2, Save, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { useToast } from "@/hooks/use-toast"
import { getUserProfile, upsertUserProfile, UserProfile } from "@/lib/profile"

export default function ProfilePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, userInfo } = useAuthGuard()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_e164: '',
    ens_label: '',
    currency: 'USD'
  })
  const [loadTimeout, setLoadTimeout] = useState<NodeJS.Timeout | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  // Load user profile from database - moved to top to fix hook order
  useEffect(() => {
    console.log('Profile page - Auth state:', {
      isAuthenticated,
      userInfo: userInfo ? { email: userInfo.email, name: userInfo.name } : 'undefined',
      hasEmail: !!userInfo?.email,
      isLoading
    })

    // Clear any existing timeout
    if (loadTimeout) {
      clearTimeout(loadTimeout)
      setLoadTimeout(null)
    }

    const loadProfile = async () => {
      if (userInfo?.email) {
        console.log('Loading profile for user:', userInfo.email)
        setProfileLoading(true)

        // Set a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
          console.log('Profile loading timeout reached')
          setProfileLoading(false)
          toast({
            title: "Loading Timeout",
            description: "Profile loading is taking longer than expected. Please try refreshing the page.",
            variant: "destructive"
          })
        }, 10000) // 10 second timeout

        setLoadTimeout(timeout)

        try {
          const userProfile = await getUserProfile(userInfo.email)
          if (userProfile) {
            console.log('Found existing profile:', userProfile)
            setProfile(userProfile)
            setFormData({
              name: userProfile.name || '',
              email: userProfile.email || '',
              phone_e164: userProfile.phone_e164 || '',
              ens_label: userProfile.ens_label || '',
              currency: userProfile.currency || 'USD'
            })
          } else {
            console.log('No existing profile found - showing setup form')
            // Show empty form for user to fill out
            setProfile(null)
            setFormData({
              name: userInfo?.name || '',
              email: userInfo?.email || '',
              phone_e164: '',
              ens_label: '',
              currency: 'USD'
            })
          }

          // Clear timeout on success
          clearTimeout(timeout)
          setLoadTimeout(null)
        } catch (error) {
          console.error('Error loading profile:', error)
          toast({
            title: "Error",
            description: "Failed to load profile information.",
            variant: "destructive"
          })
          // Clear timeout on error
          clearTimeout(timeout)
          setLoadTimeout(null)
        } finally {
          setProfileLoading(false)
        }
      } else {
        console.log('No user email available:', userInfo)
        setProfileLoading(false)
      }
    }

    if (isAuthenticated && userInfo && !isLoading) {
      loadProfile()
    } else if (!isLoading && !isAuthenticated) {
      console.log('User not connected, redirecting to signin')
      // Add a small delay before redirecting to give Web3Auth more time
      setTimeout(() => {
        if (!isAuthenticated) {
          router.replace("/auth/signin")
        }
      }, 1000)
    } else if (!isLoading && isAuthenticated && !userInfo) {
      console.log('User connected but no userInfo available')
      setProfileLoading(false)
    }

    // Cleanup timeout on unmount
    return () => {
      if (loadTimeout) {
        clearTimeout(loadTimeout)
      }
    }
  }, [isAuthenticated, userInfo, isLoading, toast, router])

  // Fallback: if we're connected but userInfo is still not available after a delay, show options
  useEffect(() => {
    if (isAuthenticated && !userInfo && !isLoading) {
      const fallbackTimer = setTimeout(() => {
        console.log('Fallback: User connected but no userInfo after 3 seconds')
        setProfileLoading(false)
      }, 3000)

      return () => clearTimeout(fallbackTimer)
    }
  }, [isAuthenticated, userInfo, isLoading])

  const handleSave = async () => {
    if (!userInfo?.email) {
      console.error('No user email available for saving')
      return
    }

    setIsSaving(true)
    try {
      console.log('Saving profile with data:', formData)
      const updatedProfile = await upsertUserProfile({
        ...userInfo,
        name: formData.name,
        email: formData.email,
        phone_e164: formData.phone_e164,
        ens_label: formData.ens_label,
        currency: formData.currency
      })

      if (updatedProfile) {
        console.log('Profile saved successfully:', updatedProfile)
        setProfile(updatedProfile)
        setIsEditing(false)
        toast({
          title: "Profile updated",
          description: "Your profile information has been saved successfully.",
        })
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error",
        description: "Failed to save profile information.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone_e164: profile.phone_e164 || '',
        ens_label: profile.ens_label || '',
        currency: profile.currency || 'USD'
      })
    }
    setIsEditing(false)
  }

  // Show loading while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Restoring your session...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null // The useAuthGuard hook handles the redirect
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading profile...</p>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.replace("/profile")}
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.replace("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!userInfo?.email && !profileLoading && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-xl font-semibold mb-4">User Information Not Available</h2>
          <p className="text-muted-foreground mb-6">
            Could not obtain your user information. This can happen if:
          </p>
          <ul className="text-sm text-muted-foreground mb-6 text-left space-y-2">
            <li>• Your session has expired</li>
            <li>• There is a problem with the Web3Auth connection</li>
            <li>• You need to sign in again</li>
          </ul>
          <div className="space-y-3">
            <Button onClick={() => router.replace("/auth/signin")} className="w-full">
              Sign In Again
            </Button>
            <Button variant="outline" onClick={() => router.replace("/dashboard")} className="w-full">
              Back to Dashboard
            </Button>
            <Button variant="ghost" onClick={() => router.replace("/profile")} className="w-full">
              Reload Page
            </Button>
          </div>

          {/* Debug info */}
          <div className="mt-6 p-4 bg-muted rounded-lg text-xs">
            <p className="font-semibold mb-2">Debug Status:</p>
            <p>Connected: {isAuthenticated ? 'Yes' : 'No'}</p>
            <p>Loading Auth: {isLoading ? 'Yes' : 'No'}</p>
            <p>UserInfo: {userInfo ? 'Available' : 'Not available'}</p>
            <p>Email: {userInfo?.email || 'N/A'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl font-serif font-bold">Profile</h1>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" alt={formData.name || 'User'} />
                <AvatarFallback className="text-lg">
                  {formData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{formData.name || 'No name provided'}</h3>
                <p className="text-muted-foreground">{formData.email || 'No email provided'}</p>
                {formData.ens_label && (
                  <Badge variant="outline" className="mt-2">
                    {formData.ens_label}
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="py-2 px-3 bg-muted rounded-md">{formData.name || 'Not provided'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                  />
                ) : (
                  <p className="py-2 px-3 bg-muted rounded-md">{formData.email || 'Not provided'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone_e164}
                    onChange={(e) => setFormData({ ...formData, phone_e164: e.target.value })}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="py-2 px-3 bg-muted rounded-md">{formData.phone_e164 || 'Not provided'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ensLabel">ENS Label</Label>
                {isEditing ? (
                  <Input
                    id="ensLabel"
                    value={formData.ens_label}
                    onChange={(e) => setFormData({ ...formData, ens_label: e.target.value })}
                    placeholder="your-name.confiado.eth"
                  />
                ) : (
                  <p className="py-2 px-3 bg-muted rounded-md">{formData.ens_label || 'Not set'}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Preferred Currency</Label>
                {isEditing ? (
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full py-2 px-3 bg-background border border-input rounded-md"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                  </select>
                ) : (
                  <p className="py-2 px-3 bg-muted rounded-md">{formData.currency}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
