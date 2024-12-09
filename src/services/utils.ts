function shortenAddress(address: string | null) {
  if (!address) return ''
  return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`
}

function isHLS(url: string) {
  return url.includes('.m3u8')
}

export { shortenAddress, isHLS }
