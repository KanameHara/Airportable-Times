import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { MapProvider } from '../components/contexts/MapContext';
import { LoadScript } from '@react-google-maps/api';
import { AuthProvider } from "@/components/contexts/AuthContext";
import Footer from "@/components/layouts/Footer";

// カスタムテーマの定義
const theme = extendTheme({
  // グローバルスタイルの定義があればここに記述
  styles: {
    global: {
      body: {
        bg: "#F7FAFC",
      },
    },
  },
})

  // Autocompleteコンポーネントでplacesライブラリを利用
  // const libraries = ['places']; 
  const libraries: ("places" | "geometry")[] = ["places"];

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MapProvider>
      <ChakraProvider theme={theme}>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
        libraries={libraries}
      >
        <AuthProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <main style={{ flexGrow: 1 }}>
              <Component {...pageProps} />
            </main>
            <Footer />
          </div>
        </AuthProvider>  
      </LoadScript>
      </ChakraProvider>
    </MapProvider>
  )
}