import 'fontsource-noto-sans-jp'
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
    <Head>
    </Head>
    <ChakraProvider
    theme={extendTheme({
      fonts: {
        heading: `'Noto Sans JP', sans-serif`,
        body: `'Noto Sans JP', sans-serif`,
      },
    })}
    >
      <Component { ...pageProps } />
    </ChakraProvider>
    </>
  );
}
