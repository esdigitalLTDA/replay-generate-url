'use client'

import { useWalletStore } from '@/state/wallet.store'

import { ConnectMetamask } from './connect-metamask'
import { Metamask } from './metamask'
import { ReplayLogo } from './replay-logo'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  const { walletAddress } = useWalletStore()

  return (
    <header className="mt-8 flex h-12 max-h-12 w-full flex-col items-start justify-between gap-4 px-4 sm:items-center sm:px-6 md:flex-row md:px-8 lg:px-10">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ReplayLogo />
          <h1 className="text-2xl font-bold">Replay</h1>
        </div>
        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-6">
        {walletAddress ? (
          <div className="flex items-center gap-3">
            <Metamask />
          </div>
        ) : (
          <div>
            <ConnectMetamask />
          </div>
        )}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
