import { env } from "@/config/enviroment";
import { getDeployments } from "@/deployments";
import "@/styles/globals.css";
import { AppPropsWithLayout } from "@/types/Layout";
import { alephzeroTestnet, UseInkathonProvider } from "@scio-labs/use-inkathon";
import { Inconsolata, Poppins } from "next/font/google";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

const poppins = Inconsolata({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <main className={poppins.className}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <style>
          {`
          :root {
            --font-poppins: ${poppins.style.fontFamily}, 'Poppins';
          }
          `}
        </style>
      </Head>
      <UseInkathonProvider
        appName="vetra"
        connectOnInit={true}
        defaultChain={env.defaultChain || alephzeroTestnet}
        deployments={getDeployments()}
      >
        {getLayout(<Component {...pageProps} />)}
        <Toaster />
      </UseInkathonProvider>
    </main>
  );
}
