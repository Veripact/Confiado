import { useEnsName, useEnsAvatar, useEnsAddress } from 'wagmi'
import { normalize } from 'viem/ens'

export function useENSProfile(address?: `0x${string}`) {
  const { data: ensName, isLoading: nameLoading, error: nameError } = useEnsName({
    address,
    chainId: 1,
  })

  const { data: ensAvatar, isLoading: avatarLoading } = useEnsAvatar({
    name: ensName,
    chainId: 1,
  })

  return {
    ensName,
    ensAvatar,
    loading: nameLoading || avatarLoading,
    error: nameError
  }
}

export function useENSResolver() {
  const isValidENSName = (name: string): boolean => {
    return name.endsWith('.eth') && name.length > 4
  }

  return {
    isValidENSName
  }
}

export function useENSAddress(name?: string) {
  const normalizedName = name ? normalize(name) : undefined
  
  const { data: address, isLoading, error } = useEnsAddress({
    name: normalizedName,
    chainId: 1,
  })

  return {
    address,
    loading: isLoading,
    error
  }
}
