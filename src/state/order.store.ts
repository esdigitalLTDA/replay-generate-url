// useUserStore.ts
import { create } from 'zustand'

interface Status {
  status: string
  message?: string
}

interface OrderState {
  status: Status
  completedOrder: any
  txHash: string
  isPaid: boolean
  isApprovedOrder: boolean
  tryAgain: boolean
  setStatus: (status: Status) => void
  setTxHash: (txHash: string) => void
  setCompletedOrder: (order: any | null) => void
  setOrderPaid: (bool: boolean) => void
  setIsApprovedOrder: (bool: boolean) => void
  setTryAgain: (bool: boolean) => void
  resetOrder: () => void
}

export const useOrderState = create<OrderState>((set) => ({
  status: { status: '', message: '' },
  txHash: '',
  completedOrder: null,
  isPaid: false,
  isApprovedOrder: false,
  tryAgain: false,
  setStatus: (status) => set({ status }),
  setTxHash: (txHash: string) => set({ txHash }),
  setCompletedOrder: (order: any | null) => set({ completedOrder: order }),
  setOrderPaid: (bool) => set({ isPaid: bool }),
  setIsApprovedOrder: (bool: boolean) => set({ isApprovedOrder: bool }),
  setTryAgain: (bool: boolean) => set({ tryAgain: bool }),
  resetOrder: () =>
    set({
      status: { status: '', message: '' },
      txHash: '',
      completedOrder: null,
      isPaid: false,
      isApprovedOrder: false,
      tryAgain: false,
    }),
}))
