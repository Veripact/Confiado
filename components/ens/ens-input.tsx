"use client"

import React, { useState } from 'react'
import { useENSResolver, useENSAddress } from '@/hooks/useENS'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Loader2 } from 'lucide-react'
import { ENSDisplay } from './ens-display'

interface ENSInputProps {
  onAddressResolved?: (address: string, ensName?: string) => void
  placeholder?: string
  className?: string
}

export function ENSInput({ 
  onAddressResolved, 
  placeholder = "Enter ENS name or address...",
  className = "" 
}: ENSInputProps) {
  const [input, setInput] = useState('')
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null)
  const [searchName, setSearchName] = useState<string>('')
  
  const { isValidENSName } = useENSResolver()
  const { address, loading } = useENSAddress(searchName)

  const handleSearch = () => {
    if (!input.trim()) return

    // Check if input is an ENS name
    if (isValidENSName(input)) {
      setSearchName(input)
    } else if (input.startsWith('0x') && input.length === 42) {
      // Input is already an address
      setResolvedAddress(input)
      onAddressResolved?.(input)
    }
  }

  // Handle address resolution result
  React.useEffect(() => {
    if (address && searchName) {
      setResolvedAddress(address)
      onAddressResolved?.(address, searchName)
      setSearchName('') // Reset search
    }
  }, [address, searchName, onAddressResolved])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleClear = () => {
    setInput('')
    setResolvedAddress(null)
    setSearchName('')
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button 
          onClick={handleSearch} 
          disabled={loading || !input.trim()}
          size="sm"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
        {resolvedAddress && (
          <Button 
            onClick={handleClear} 
            variant="outline"
            size="sm"
          >
            Clear
          </Button>
        )}
      </div>

      {resolvedAddress && (
        <div className="p-3 bg-gray-50 rounded-md">
          <ENSDisplay address={resolvedAddress} />
        </div>
      )}
    </div>
  )
}
