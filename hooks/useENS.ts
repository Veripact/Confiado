import { useState, useEffect } from 'react'
import { createPublicClient, http, normalize } from 'viem'
import { mainnet } from 'viem/chains'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
})

export function useENS() {
  const [ensName, setEnsName] = useState<string | null>(null)
  const [ensAvatar, setEnsAvatar] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resolveENS = async (address: string) => {
    if (!address) return

    setLoading(true)
    setError(null)

    try {
      // Resolve ENS name from address
      const name = await publicClient.getEnsName({
        address: address as `0x${string}`
      })

      setEnsName(name)

      // If we have a name, try to get the avatar
      if (name) {
        try {
          const avatar = await publicClient.getEnsAvatar({
            name: normalize(name)
          })
          setEnsAvatar(avatar)
        } catch (avatarError) {
          console.warn('Could not resolve ENS avatar:', avatarError)
          setEnsAvatar(null)
        }
      }
    } catch (err) {
      console.error('ENS resolution error:', err)
      setError('Failed to resolve ENS name')
      setEnsName(null)
      setEnsAvatar(null)
    } finally {
      setLoading(false)
    }
  }

  const resolveAddress = async (ensName: string) => {
    if (!ensName) return null

    setLoading(true)
    setError(null)

    try {
      const address = await publicClient.getEnsAddress({
        name: normalize(ensName)
      })
      return address
    } catch (err) {
      console.error('ENS address resolution error:', err)
      setError('Failed to resolve ENS address')
      return null
    } finally {
      setLoading(false)
    }
  }

  const isValidENSName = (name: string): boolean => {
    return name.endsWith('.eth') && name.length > 4
  }

  return {
    ensName,
    ensAvatar,
    loading,
    error,
    resolveENS,
    resolveAddress,
    isValidENSName
  }
}
