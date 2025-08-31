"use client"

import { useEffect } from 'react'
import { useENS } from '@/hooks/useENS'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface ENSDisplayProps {
  address: string
  showAvatar?: boolean
  showBadge?: boolean
  className?: string
}

export function ENSDisplay({ 
  address, 
  showAvatar = true, 
  showBadge = true,
  className = "" 
}: ENSDisplayProps) {
  const { ensName, ensAvatar, loading, resolveENS } = useENS()

  useEffect(() => {
    if (address) {
      resolveENS(address)
    }
  }, [address, resolveENS])

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {showAvatar && <Skeleton className="h-8 w-8 rounded-full" />}
        <Skeleton className="h-4 w-24" />
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showAvatar && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={ensAvatar || undefined} alt={ensName || address} />
          <AvatarFallback>
            {ensName ? ensName.slice(0, 2).toUpperCase() : address.slice(2, 4).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {ensName || formatAddress(address)}
        </span>
        
        {ensName && showBadge && (
          <Badge variant="secondary" className="text-xs w-fit">
            ENS
          </Badge>
        )}
      </div>
    </div>
  )
}
