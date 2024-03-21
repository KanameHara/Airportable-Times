import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { MapProvider } from '../components/contexts/MapContext';

// カスタムテーマの定義
const theme = extendTheme({
  // グローバルスタイルの定義があればここに記述
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MapProvider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </MapProvider>
  )
}