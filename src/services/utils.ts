function shortenAddress(address: string | null) {
  if (!address) return ''
  return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`
}

export { shortenAddress }
