import { Eip1193Provider } from 'ethers/types/providers'
import mongoose from 'mongoose'

declare global {
  interface Window {
    ethereum?: Eip1193Provider
  }

  namespace NodeJS {
    interface Global {
      mongoose: {
        conn: typeof mongoose | null
        promise: Promise<typeof mongoose> | null
      }
    }
  }
}

export {}
