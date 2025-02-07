'use client'

import { ethers } from 'ethers'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { STORAGE_KEYS, StorageHelper } from '@/services/storage-helper'
import { web3Service } from '@/services/web3'
import { useWalletStore } from '@/state/wallet.store'

import { Button } from './ui/button'

export function ConnectMetamask() {
  const { setWalletAddress, walletAddress, setCurrentNetwork } =
    useWalletStore()

  const defaultNetwork = web3Service.getDefaultBlockchain()

  const walletAddressStorage = StorageHelper.getItem(STORAGE_KEYS.USER_WALLET)

  async function signWallet() {
    const signatureStorage = StorageHelper.getItem(
      STORAGE_KEYS.USER_WALLET_SIGN,
    )

    if (signatureStorage) {
      return signatureStorage
    }

    const ethereum = await window?.ethereum
    const signer = await new ethers.BrowserProvider(ethereum).getSigner()
    try {
      const signature = await signer.signMessage(
        'Sign this message to prove you own this wallet.',
      )

      StorageHelper.setItem(STORAGE_KEYS.USER_WALLET_SIGN, signature)

      return signature
    } catch (error) {
      console.error('Error signing message:', error)
    }
  }

  async function connectToMetaMask() {
    if ((window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        })

        const _walletAddress = accounts[0]

        const signature = await signWallet()
        if (!signature) {
          toast.error(
            'Signature for the message was denied. You must sign the message to proceed.',
          )
          return
        }

        StorageHelper.setItem(STORAGE_KEYS.USER_WALLET, _walletAddress)
        setWalletAddress(_walletAddress)

        const currentChainId = await (window as any).ethereum.request({
          method: 'eth_chainId',
        })

        if (parseInt(currentChainId, 16) !== parseInt(defaultNetwork.chainId)) {
          await web3Service.changeNetwork(defaultNetwork.chainId)

          setCurrentNetwork(defaultNetwork)
        }
      } catch (error: any) {
        console.error('Error connecting to MetaMask:', error)
        toast.error('Error connecting to MetaMask: ' + error.message)
      }
    } else {
      toast.error(
        'MetaMask is not installed. Please install it to use this feature.',
      )
    }
  }

  useEffect(() => {
    if (walletAddressStorage && !walletAddress) {
      connectToMetaMask()
    }
  }, [])

  return (
    <Button
      onClick={connectToMetaMask}
      size="default"
      className="p-4 font-bold sm:p-5"
    >
      Connect to MetaMask
    </Button>
  )
}
