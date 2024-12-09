import { ReactNode } from 'react'

import { Header } from '@/components/header'

export default function BridgeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid min-h-screen w-full max-w-[1600px] grid-rows-[min-content_max-content] gap-5">
      <Header />
      <div className="px-4 py-8 max-sm:mt-10 md:px-8">{children}</div>
    </div>
  )
}
