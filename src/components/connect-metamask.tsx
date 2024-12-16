'use client'

import { ethers } from 'ethers'
import { useEffect } from 'react'
import { toast } from 'sonner'

import { THETA_MAINNET } from '@/services/constants/network-connections'
import { STORAGE_KEYS, StorageHelper } from '@/services/storage-helper'
import { useWalletStore } from '@/state/wallet.store'

import { Button } from './ui/button'

export function ConnectMetamask() {
  const { setWalletAddress, walletAddress } = useWalletStore()

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

  async function switchToEthereumNewtwokr() {
    try {
      const ethereum = window.ethereum
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          { chainId: `0x${parseInt(THETA_MAINNET.chainId).toString(16)}` },
        ],
      })
    } catch (error: any) {
      if (error?.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${parseInt(THETA_MAINNET.chainId).toString(16)}`,
                chainName: THETA_MAINNET.name,
                nativeCurrency: {
                  name: THETA_MAINNET.symbol,
                  symbol: THETA_MAINNET.symbol,
                  decimals: 18,
                },
                rpcUrls: [THETA_MAINNET.rpcUrl],
                blockExplorerUrls: [THETA_MAINNET.blockExplorerUrl],
              },
            ],
          })
          toast.success('Theta Testnet added to MetaMask and switched.')
        } catch (addError) {
          console.error('Error adding Theta Testnet:', addError)
          toast.error('Failed to add Theta Testnet to MetaMask.')
        }
      } else {
        console.error('Error switching network:', error)
        toast.error('Failed to switch to Theta Testnet.')
      }
    }
  }

  async function connectToMetaMask() {
    if ((window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        })

        const walletAddress = accounts[0]

        const signature = await signWallet()

        if (!signature) {
          toast.error(
            'Signature for the message was denied. You must sign the message to proceed with the bridging process.',
          )
          return
        }

        StorageHelper.setItem(STORAGE_KEYS.USER_WALLET, walletAddress)
        setWalletAddress(walletAddress)

        const currentChainId = await window.ethereum.request({
          method: 'eth_chainId',
        })

        if (Number(currentChainId) !== Number(THETA_MAINNET.chainId)) {
          return await switchToEthereumNewtwokr()
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
