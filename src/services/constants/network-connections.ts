export const THETA_MAINNET = {
  name: 'Theta Mainnet',
  rpcUrl: 'https://eth-rpc-api.thetatoken.org/rpc',
  chainId: '361',
  symbol: 'TFUEL',
  blockExplorerUrl: 'https://explorer.thetatoken.org',
}

export const THETA_TESTNET = {
  name: 'Theta Testnet',
  rpcUrl: 'https://eth-rpc-api-testnet.thetatoken.org/rpc',
  chainId: '365',
  symbol: 'TFUEL',
  blockExplorerUrl: 'https://testnet-explorer.thetatoken.org',
}

export const BASE = {
  name: 'Base Sepolia',
  rpcUrl: 'https://sepolia.base.org',
  chainId: '84532',
  symbol: 'ETH',
}

export const campNetworkTestnet = {
  chainId: '0x4FBE8',
  chainName: 'Camp Network Testnet',
  rpcUrls: ['https://rpc.camp-network-testnet.gelato.digital'],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrls: ['https://camp-network-testnet.blockscout.com'],
}

export const ETHEREUM_MAINNET = {
  name: 'Ethereum Mainnet',
  rpcUrl: 'https://ethereum-rpc.publicnode.com',
  chainId: '1',
  symbol: 'ETH',
  blockExplorerUrl: 'https://etherscan.io',
}

export const ETHEREUM_TESTNET = {
  name: 'Ethereum Testnet',
  rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
  chainId: '5',
  symbol: 'ETH',
  blockExplorerUrl: 'https://goerli.etherscan.io',
}

export const NETWORK_CONNECTIONS = [
  THETA_MAINNET,
  THETA_TESTNET,
  BASE,
  ETHEREUM_MAINNET,
  ETHEREUM_TESTNET,
]
