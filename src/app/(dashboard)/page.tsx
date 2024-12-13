'use client'

import { useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useWalletStore } from '@/state/wallet.store'

import { MyUrls } from './my-urls'
import VideoForm from './video-form'

export default function Home() {
  const { walletAddress } = useWalletStore()

  const [activeTab, setActiveTab] = useState('generate-url')

  function onGenerateUrl() {
    setActiveTab('my-urls')

    setTimeout(() => {
      localStorage.removeItem('videoData')
    }, 500)
  }

  return (
    <main className="flex w-full flex-col items-center 2xl:mt-4">
      {walletAddress ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="generate-url">Generate URL</TabsTrigger>
            <TabsTrigger value="my-urls">My URLs</TabsTrigger>
          </TabsList>
          <TabsContent value="generate-url">
            <VideoForm onGenerateUrl={onGenerateUrl} />
          </TabsContent>
          <TabsContent value="my-urls">
            <MyUrls />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="mt-28 flex w-full items-center justify-center gap-3">
          <strong className="text-2xl">
            Please, connect your wallet to continue.
          </strong>
        </div>
      )}
    </main>
  )
}
