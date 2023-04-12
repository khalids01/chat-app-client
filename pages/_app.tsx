import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'
import SocketsProvider from '@/context/socket.context'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'


const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  if (!show) {
    return <></>
  }

  return (
    <SocketsProvider>
      <MantineProvider theme={{ colorScheme: 'dark', fontFamily: inter.style.fontFamily }} withGlobalStyles withNormalizeCSS>
        <Component {...pageProps} />
      </MantineProvider>
    </SocketsProvider>
  )
}
