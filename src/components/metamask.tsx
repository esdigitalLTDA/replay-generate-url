/* eslint-disable react/no-unescaped-entities */
import { ethers } from 'ethers'
import { LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import Blockies from 'react-blockies'
import { toast } from 'sonner'

import { STORAGE_KEYS, StorageHelper } from '@/services/storage-helper'
import { shortenAddress } from '@/services/utils'
import { useOrderState } from '@/state/order.store'
import { useWalletStore } from '@/state/wallet.store'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
]

export function Metamask() {
  const { setWalletAddress, walletAddress, setCurrentNetwork } =
    useWalletStore()
  const { resetOrder } = useOrderState()

  const [rplayBalance, setRplayBalance] = useState<string | null>(null)

  function disconnectFromMetaMask() {
    StorageHelper.removeItem(STORAGE_KEYS.USER_WALLET)
    setWalletAddress(null)
    setCurrentNetwork(null)

    resetOrder()

    toast.success('Disconnected from MetaMask')
  }

  async function fetchRplayBalance() {
    if (!walletAddress || typeof window.ethereum === 'undefined') return

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_RPLAY_CONTRACT_ADDRESS!,
        ERC20_ABI,
        provider,
      )

      const balance = await contract.balanceOf(walletAddress)
      const decimals = await contract.decimals()

      const formattedBalance = ethers.formatUnits(balance, decimals)
      setRplayBalance(formattedBalance)
    } catch (error) {
      console.error('Error fetching RPLAY balance:', error)
    }
  }

  useEffect(() => {
    if (walletAddress) {
      fetchRplayBalance()
    }
  }, [walletAddress])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg bg-muted-foreground/20 px-4 py-2">
        <div className="flex items-center gap-4">
          {walletAddress && (
            <Blockies
              seed={walletAddress?.toLowerCase()}
              className="rounded-full"
              size={8}
            />
          )}
          <span className="text-xs font-semibold md:text-sm">
            {shortenAddress(walletAddress)}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {walletAddress && rplayBalance !== null && (
          <DropdownMenuLabel className="text-sm font-medium">
            RPLAY Balance: {rplayBalance}
          </DropdownMenuLabel>
        )}
        {walletAddress && rplayBalance === '0.0' && (
          <DropdownMenuLabel className="text-sm font-medium text-red-500">
            You don't have any RPLAY tokens.
            <a
              href="https://www.mexc.com/price/RPLAY"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-blue-500 underline"
            >
              Buy RPLAY on MEXC
            </a>
          </DropdownMenuLabel>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-3"
          onClick={disconnectFromMetaMask}
        >
          <LogOut className="h-4 w-4 rotate-180" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
