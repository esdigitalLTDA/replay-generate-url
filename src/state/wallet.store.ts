// useUserStore.ts
import { create } from 'zustand'

interface OrderPending {
  fromNetwork: string
  toNetwork: string
  tokenAmount: number
  receiveAmount: number
}

interface CurrentNetwork {
  name: string
  chainId: string
}

interface WalletState {
  walletAddress: string | null
  isIncompatibleNetwork: boolean | null
  currentNetwork: CurrentNetwork | null
  orderPending: OrderPending | null
  setWalletAddress: (address: string | null) => void
  setIncompatibleNetwork: (isIncompatible: boolean) => void
  setCurrentNetwork: (network: CurrentNetwork | null) => void
  setOrderPending: (order: OrderPending) => void
  removeOrderPending: () => void
}

export const useWalletStore = create<WalletState>((set) => ({
  walletAddress: null,
  isIncompatibleNetwork: null,
  currentNetwork: null,
  orderPending: null,
  setWalletAddress: (address) => set({ walletAddress: address }),
  setIncompatibleNetwork: (isIncompatible) =>
    set({ isIncompatibleNetwork: isIncompatible }),
  setCurrentNetwork: (network) => set({ currentNetwork: network }),
  setOrderPending: (order: OrderPending) => set({ orderPending: order }),
  removeOrderPending: () => set({ orderPending: null }),
}))
