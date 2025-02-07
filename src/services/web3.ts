import { ethers } from 'ethers'

import {
  ETHEREUM_MAINNET,
  NETWORK_CONNECTIONS,
  THETA_MAINNET,
} from './constants/network-connections'
import { TOKEN_CONTRACT_ABI } from './constants/token-contract-abi'

const CONTRACT_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint)',
  'function decimals() public view returns (uint8)',
  'function totalSupply() public view returns (uint256)',
  'function transfer(address to, uint amount)',
  'event Transfer(address indexed from, address indexed to, uint amount)',
]

async function getMetaMaskProvider() {
  if (!window.ethereum) throw new Error(`No MetaMask found!`)
  await window.ethereum.send('eth_requestAccounts')

  const provider = new ethers.BrowserProvider(window.ethereum, 'any')
  provider.on('network', (newNetwork, oldNetwork) => {
    if (oldNetwork) window.location.reload()
  })
  return provider
}

async function getBalance(address: string) {
  const provider = await getMetaMaskProvider()
  const balance = await provider.getBalance(address)
  return ethers.formatEther(balance.toString())
}

async function getTokenBalance(
  address: string,
  contractAddress: string,
  decimals = 18,
) {
  const provider = await getMetaMaskProvider()
  const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider)
  const balance = await contract.balanceOf(address)
  return ethers.formatUnits(balance, decimals)
}

function getDefaultBlockchain() {
  const blockchain = process.env.NEXT_PUBLIC_BLOCKCHAIN

  if (blockchain === 'theta') {
    return THETA_MAINNET
  } else {
    return ETHEREUM_MAINNET
  }
}

async function getTransaction(hash: string) {
  const provider = await getMetaMaskProvider()
  const tx = await provider.getTransactionReceipt(hash)
  return tx
}

async function transferToken(
  toAddress: string,
  tokenAmount: number,
  contractAddress: string,
) {
  try {
    const provider = await getMetaMaskProvider()
    const signer = await provider.getSigner()

    const contract = new ethers.Contract(
      contractAddress,
      TOKEN_CONTRACT_ABI,
      signer,
    )

    const amountInWei = ethers.parseUnits(String(tokenAmount))
    const txResponse = await contract.transfer(toAddress, amountInWei)
    const receipt = await txResponse.wait()

    return receipt.hash
  } catch (error) {
    console.error('Error sending tokens:', error)
    throw error
  }
}

async function getCurrentNetwork() {
  const provider = await getMetaMaskProvider()
  const network = await provider.getNetwork()
  return network
}

async function changeNetwork(chainId: string) {
  const hexChainId = `0x${Number(chainId).toString(16)}`

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hexChainId }],
    })
  } catch (switchError: any) {
    if (switchError?.code === 4902) {
      const networkConnection = NETWORK_CONNECTIONS.find(
        (connection) => connection.chainId === chainId,
      )

      if (!networkConnection) {
        throw new Error(`Network with chainId ${chainId} not found.`)
      }

      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: hexChainId,
              chainName: networkConnection.name,
              rpcUrls: [networkConnection.rpcUrl],
              nativeCurrency: {
                name: networkConnection.symbol,
                symbol: networkConnection.symbol,
                decimals: 18,
              },
              blockExplorerUrls: [networkConnection?.blockExplorerUrl || ''],
            },
          ],
        })
      } catch (addError: any) {
        throw new Error(`Failed to add the network: ${addError?.message}`)
      }
    } else {
      throw new Error(`Failed to switch the network: ${switchError?.message}`)
    }
  }
}

export const web3Service = {
  getMetaMaskProvider,
  getBalance,
  getTokenBalance,
  transferToken,
  getTransaction,
  getCurrentNetwork,
  changeNetwork,
  getDefaultBlockchain,
}
