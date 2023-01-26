import install from "@twind/with-next/app";

// @ts-ignore
import config from "../../twind.config.js";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default install(config, MyApp);
