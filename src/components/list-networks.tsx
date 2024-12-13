/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { Network, TriangleAlert } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { web3Service } from '@/services/web3'
import { useWalletStore } from '@/state/wallet.store'

import { Base } from './networks/base'
import { Ethereum } from './networks/ethereum'
import { Theta } from './networks/theta'
import { Button } from './ui/button'

const networks = {
  // ethereum: {
  //   chainId: '1',
  //   icon: Ethereum,
  // },
  theta: {
    chainId: '365',
    icon: Theta,
  },
  // arbitrum: Airbitrum,
  // optimism: Optimism,
  // polygon: Polygon,
  base: {
    chainId: '84532',
    icon: Base,
  },
  // bnbChain: BNBChain,
  // avalanche: Avalanche,
  // celo: Celo,
  // blast: Blast,
}

interface ListNetworksProps {
  withText?: boolean
}

export function ListNetworks({ withText = false }: ListNetworksProps) {
  const [currentNetworkIcon, setCurrentNetworkIcon] =
    useState<ReactElement | null>(null)

  const { setCurrentNetwork, setIncompatibleNetwork } = useWalletStore()

  async function handleNetworkChange(chainId: string) {
    try {
      await web3Service.changeNetwork(chainId)

      // const networkEntry = Object.entries(networks).find(
      //   ([_, network]) => network.chainId === chainId,
      // )
      // if (networkEntry) {
      //   const Icon = networkEntry[1].icon
      //   setCurrentNetworkIcon(<Icon />)
      // }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    async function fetchCurrentNetwork() {
      const network = await web3Service.getCurrentNetwork()
      const chainIdStr = network.chainId.toString()

      const networkData = {
        name: network.name,
        chainId: chainIdStr,
      }

      setCurrentNetwork(networkData)

      const networkEntry = Object.entries(networks).find(
        ([_, { chainId }]) => chainId === chainIdStr,
      )
      if (networkEntry) {
        const Icon = networkEntry[1].icon
        setCurrentNetworkIcon(<Icon />)
        setIncompatibleNetwork(false)
      } else {
        setCurrentNetworkIcon(<TriangleAlert className="text-yellow-400" />)
        setIncompatibleNetwork(true)
      }
    }

    fetchCurrentNetwork()

    window.ethereum.on('chainChanged', fetchCurrentNetwork)

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('chainChanged', fetchCurrentNetwork)
      }
    }
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <DropdownMenuTrigger asChild>
          {withText ? (
            <Button
              className="flex items-center gap-2 font-medium"
              size="lg"
              variant="default"
            >
              Switch Network
              <Network className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="outline">{currentNetworkIcon}</Button>
          )}
        </DropdownMenuTrigger>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44">
        <DropdownMenuLabel>Networks</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(networks).map(
          ([networkName, { chainId, icon: Icon }]) => (
            <DropdownMenuItem
              key={chainId}
              className="flex items-center justify-between gap-2"
              onClick={() => handleNetworkChange(chainId)}
            >
              {networkName.charAt(0).toUpperCase() + networkName.slice(1)}
              <Icon />
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
