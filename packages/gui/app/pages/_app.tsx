import "../css/tailwind.css"

import { Head } from "blitz"
import { AppProps } from "next/app"

export default ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
    </Head>
    <div className="antialiased bg-gray-100 text-gray-900">
      <Component {...pageProps} />
    </div>
  </>
)
