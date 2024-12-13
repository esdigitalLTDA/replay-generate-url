import { Base } from './base'
import { Ethereum } from './ethereum'
import { Theta } from './theta'

interface NetworkIconProps {
  chainId: string
}

export function NetworkIcon({ chainId }: NetworkIconProps) {
  const Icon: { [key: string]: JSX.Element } = {
    '1': <Ethereum />,
    '365': <Theta />,
    '84532': <Base />,
  }

  return Icon[chainId] || null
}
