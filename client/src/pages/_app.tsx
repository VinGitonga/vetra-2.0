import AppServices from "@/AppServices";
import { env } from "@/config/enviroment";
import { getDeployments } from "@/deployments";
import "@/styles/globals.css";
import { AppPropsWithLayout } from "@/types/Layout";
import { alephzeroTestnet, UseInkathonProvider } from "@scio-labs/use-inkathon";
import { Inconsolata } from "next/font/google";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

const inconsolata = Inconsolata({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <main className={inconsolata.className}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <style>
          {`
          :root {
            --font-inconsolata: ${inconsolata.style.fontFamily}, 'Inconsolata';
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
        <AppServices>{getLayout(<Component {...pageProps} />)}</AppServices>
        <Toaster />
      </UseInkathonProvider>
    </main>
  );
}
